"""
📦 skills/objection/handler.py
Handle pricing / timing / capability objections with a
Problem → Value → Proof → CTA mini-framework.
"""

from __future__ import annotations

import logging
from pathlib import Path
from time import perf_counter
from typing import Any, List

from mcp.schema   import Skill, Turn, Conversation, Result
from services.openai_client_service import async_chat

_LOG         = logging.getLogger("skill.objection")
_PROMPT_TMPL = Path(__file__).with_name("prompt.md").read_text()

FALLBACK = (
    "I understand your hesitation. Most clients felt the same until they saw "
    "how **Indrasol** cut audit prep by **76 %**. Would a brief call help?"
)
PROMPT_PATH = Path(__file__).parent.parent / "objection/objection_prompt.txt"
# ---------------------------------------------------------------------------#
#  helper – construct system prompt
# ---------------------------------------------------------------------------#
def _mk_system_prompt(rag: List[str], summary: str) -> str:
    rag_block     = "\n".join(f"• {c.strip()}" for c in rag).strip()
    summary_block = summary.strip()
    return (
        f"{_PROMPT_TMPL}\n\n"
        f"---\n"
        f"## RAG context\n{rag_block}\n\n"
        f"## Conversation so far\n{summary_block}"
    )

# ---------------------------------------------------------------------------#
#  Skill.handle()
# ---------------------------------------------------------------------------#
async def _handle(turn: Turn, convo: Conversation) -> Result:
    tic = perf_counter()

    rag_chunks      = convo.state.get("rag_context", [])
    memory_summary  = convo.state.get("memory_summary", "")
    sys_prompt      = _mk_system_prompt(rag_chunks, memory_summary)
    sys_prompt = "You are a helpful assistant."

    with open(PROMPT_PATH, "r") as file:
        prompt_template = file.read()

    prompt = (
        f"{prompt_template}\n\n"
        f"User Objection: {turn.text}\n\n"
        f"Context (if needed):\n{rag_chunks}\n\n"
        f"Chat History (if needed):\n{memory_summary}\n\n"
        f"Your Response:"
    )

    try:
        reply = await async_chat(
            system=sys_prompt,
            user  = prompt,
            model = "gpt-4.1",
            temp  = 0.4,
            tokens= 280,
        )
        if not reply:
            reply = FALLBACK

    except Exception as exc:            # safety-net
        _LOG.exception("Objection LLM failed: %s", exc)
        reply = FALLBACK

    latency = int((perf_counter() - tic) * 1000)
    return Result(
        turn_id      = turn.id,
        text         = reply,
        routed_skill = "objection",
        finished     = False,
        latency_ms   = latency,
    )

# ---------------------------------------------------------------------------#
#  Skill.match()
# ---------------------------------------------------------------------------#
def _match(turn: Turn, convo: Conversation) -> bool:
    """
    Light heuristic: if the *previous* bot message invited a demo / CTA **and**
    the current user message contains negative sentiment or a classic objection
    keyword, let this skill handle it.
    """
    txt = turn.text.lower()

    objection_kw = ("too expensive", "price", "budget", "already have",
                    "not sure", "later", "need approval", "compare", "risk")
    if any(k in txt for k in objection_kw):
        return True

    # also trigger if user says "no", "maybe later", etc. right after a CTA
    if txt in {"no", "not now", "maybe later"}:
        prev_bot = convo.latest_bot_message().lower()
        if any(k in prev_bot for k in ("demo", "schedule", "call")):
            return True

    return False


# ---------------------------------------------------------------------------#
#  Exported Skill object – what the dispatcher imports                    #
# ---------------------------------------------------------------------------#
skill = Skill(
    name     = "objection",
    kind     = "domain",
    priority = 520,  
    timeout  = 20,       # seconds
    match    = _match,
    handle   = _handle,
)
