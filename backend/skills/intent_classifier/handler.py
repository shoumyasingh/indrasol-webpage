from __future__ import annotations

import logging, textwrap
from typing import List
from pathlib import Path

from mcp.schema          import Skill, Turn, Conversation, Result
from services.openai_client_service import async_chat

_LOG = logging.getLogger("skill.intent")

INTENTS: List[str] = [
    "Cold",
    "Info Request",
    "Interested in Product",
    "Interested in Services",
    "Ready to engage",
    "Objection",
]

SYS_PROMPT = textwrap.dedent(open(__file__.replace("handler.py", "prompt.md")).read())
PROMPT_PATH = Path(__file__).parent.parent / "intent_classifier/intent_prompt.txt"
# --------------------------------------------------------------------- #
#  match() – run once per turn unless intent is already present
# --------------------------------------------------------------------- #
def _match(turn: Turn, convo: Conversation) -> bool:
    return "intent" not in convo.extras


# --------------------------------------------------------------------- #
#  handle() – classifies the turn and stores label in convo.extras
# --------------------------------------------------------------------- #
async def _handle(turn: Turn, convo: Conversation) -> Result:
    try:

        sys_prompt = "You are a helpful assistant."

        with open(PROMPT_PATH, "r") as file:
            prompt_template = file.read()
        
        prompt = (
            f"{prompt_template}\n\n"
            f"User: {turn.text}\n"
            f"History: {convo.state.get('memory_summary', '')}\n→"
        )

        label, usage = await async_chat(
            model     = "gpt-4.1",
            messages  = [
                {"role": "system", "content": sys_prompt},
                {"role": "user",   "content": prompt},
            ],
            temperature = 0.5,
            max_tokens  = 10,
        )
        label = label.strip()

        if label not in INTENTS:
            _LOG.warning("LLM yielded unknown label %r – falling back to Cold", label)
            label = "Cold"

    except Exception as exc:                       # noqa: BLE001
        _LOG.exception("Intent classifier crashed: %s", exc)
        label, usage = "Cold", {}

    _LOG.info("Intent classifier label: %s", label)

    # ➜ add the label to convo.extras so downstream skills can read it
    convo.extras["intent"] = label

    # Tiny result: nothing to display to user
    return Result(
        turn_id      = turn.id,
        text         = "",             # no visible reply
        routed_skill = "intent-classifier",
        finished     = False,
        meta         = {"intent": label, "openai_usage": usage},
    )

# --------------------------------------------------------------------- #
#  Export skill object
# --------------------------------------------------------------------- #
skill = Skill(
    name     = "intent-classifier",
    kind     = "utility",
    priority = 150,
    match    = _match,
    handle   = _handle,
)
