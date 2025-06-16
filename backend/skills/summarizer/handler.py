from __future__ import annotations
import logging, textwrap
from mcp.schema import Skill, Turn, Conversation, Result
from services.openai_client_service import async_chat

_LOG = logging.getLogger("skill.summariser")

_SYSTEM = (
            "You are a concise summarizer for a sales chatbot. "
            "Write 3–4 sentences covering: "
            "1) the visitor’s main goals or pains, "
            "2) any objections raised so far, "
            "3) their current buying stage (cold / curious / hot)."
        )

def _should_summarise(convo: Conversation) -> bool:
    # Every 4 turns or when the running summary is empty
    return (convo.turn_index % 4 == 0) or ("summary" not in convo.extras)

async def _handle(turn: Turn, convo: Conversation) -> Result:
    if not _should_summarise(convo):
        return Result.noop(turn.id, "summariser-skipped")

    transcript = "\n".join(
        f"User: {m.text}" if m.is_user else f"Bot: {m.text}"
        for m in convo.messages[-12:]          # last N messages only
    )
    prompt = f"{_SYSTEM}\n\nConversation so far:\n{transcript}\n\n---\nSummary:"

    summary, usage = await async_chat([
        {"role": "system", "content": _SYSTEM},
        {"role": "user",   "content": prompt}
    ])

    _LOG.info("summary=%s", summary)

    meta = {"summary": summary, "openai_usage": usage}

    return Result(
        turn_id      = turn.id,
        text         = "",          # nothing shown to user
        routed_skill = "summariser",
        finished     = False,
        meta         = meta
    )

skill = Skill(
    name     = "summariser",
    kind     = "utility",
    priority = 190,
    match    = lambda t, c: True,    # always eligible, _handle decides to skip
    handle   = _handle
)
