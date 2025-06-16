"""
Sales skill – turns “Interested” questions into
Problem → Value → Proof → CTA replies.
"""

from __future__ import annotations

import logging, textwrap
from pathlib import Path
from typing  import List

from mcp.schema import Skill, Turn, Conversation, Result
from services.openai_client_service import async_chat

_LOG = logging.getLogger("skill.sales")

PROMPT_TMPL = Path(__file__).with_name("prompt.md").read_text()
FALLBACK    = (
    "Indrasol can definitely help. Would you like a quick demo "
    "or a call with an expert?"
)

PROMPT_PATH = Path(__file__).parent.parent / "sales/sales_prompt.txt"

# ------------------------------------------------------------------ #
#  match(): fire only when intent was classified as “Interested …”
# ------------------------------------------------------------------ #
def _match(turn: Turn, convo: Conversation) -> bool:
    return convo.extras.get("intent") in {
        "Interested in Product",
        "Interested in Services",
        "Ready to engage",
        "Info Request"
    }

# ------------------------------------------------------------------ #
#  handle(): build system-prompt ➜ call OpenAI ➜ return Result
# ------------------------------------------------------------------ #
async def _handle(turn: Turn, convo: Conversation) -> Result:
    rag  : List[str] = convo.extras.get("rag_chunks", [])
    summ : str       = convo.extras.get("summary", "")

    rag_block   = "\n".join(f"• {c}" for c in rag) if rag else "—"
    # sys_prompt  = textwrap.dedent(f"""{PROMPT_TMPL}
    SYSTEM_PROMPT = """
        You are Indrasol’s senior sales engineer.
        Write in a clear, friendly B2B tone (2-3 short paragraphs max).
        Always finish with ONE call-to-action sentence.
        """.strip()

    with open(PROMPT_PATH, "r") as file:
        prompt_template = file.read()
    
    prompt = (
        f"{prompt_template}\n\n"
        f"user_message: {turn.text}\n\n"
        f"rag_context:\n{rag_block}\n\n"
        f"memory_summary:\n{summ}\n\n"
    )

    try:
        reply, usage = await async_chat(
            model     = "gpt-4.1",
            messages  = [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user",   "content": prompt},
            ],
            temperature = 0.2,
            max_tokens  = 350,
        )
    except Exception as exc:                      # noqa: BLE001
        _LOG.exception("OpenAI failed: %s", exc)
        reply, usage = FALLBACK, {}

    if not reply.strip():
        reply = FALLBACK

    return Result(
        turn_id      = turn.id,
        text         = reply.strip(),
        routed_skill = "sales",
        finished     = True,  
        meta         = {"openai_usage": usage},
    )

# ------------------------------------------------------------------ #
skill = Skill(
    name     = "sales",
    kind     = "domain",
    priority = 500,        # runs after utility skills
    match    = _match,
    handle   = _handle,
)
