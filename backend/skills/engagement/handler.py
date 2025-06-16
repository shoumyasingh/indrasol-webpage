"""
📦 skills/engagement/handler.py
Greets first-time visitors, highlights Indrasol’s two products + four services,
and ends with ONE discovery question that steers them deeper.

Executed **only** on the very first user turn in a conversation.
"""

from __future__ import annotations

import html
import logging
from pathlib import Path
from time import perf_counter
from typing import Any

from mcp.schema    import Conversation, Result, Skill, Turn
from services.openai_client_service import async_chat
from services.bot_response_formatter_md import ensure_markdown

_LOG = logging.getLogger("skill.engagement")

_PROMPT_SYS = Path(__file__).with_name("prompt.md").read_text(encoding="utf-8")
_FALLBACK   = (
    "👋 Welcome to **Indrasol**! We offer **SecureTrack**, **BizRadar**, and four "
    "security-focused service pillars. Which area interests you today?"
)
PROMPT_PATH = Path(__file__).parent.parent / "engagement/engagement_prompt.txt"
# --------------------------------------------------------------------------- #
#  Handler                                                                     #
# --------------------------------------------------------------------------- #
async def _handle(turn: Turn, convo: Conversation) -> Result:
    tic = perf_counter()
    _LOG.info("Engagement skill invoked – msg=%r", turn.text[:80])

    sys_prompt = "You are a helpful assistant."

    with open(PROMPT_PATH, "r") as file:
        prompt_template = file.read()

    prompt = (
        f"{prompt_template}\n\n"
        f"User message: {turn.text}\n\n"
        f"Engagement Agent:"
    )
    try:
        llm_reply = await async_chat(
            system = sys_prompt,
            user   = prompt,
            model  = "gpt-4o-mini",
            temperature = 0.4,
            max_tokens  = 300,
        )
        reply = (llm_reply or "").strip() or _FALLBACK

    except Exception as exc:                                      # pragma: no cover
        _LOG.exception("Engagement skill crashed: %s", exc)
        reply = _FALLBACK

    reply = await ensure_markdown(reply)

    return Result(
        turn_id      = turn.id,
        text         = reply,
        routed_skill = "engagement",
        finished     = False,
        latency_ms   = int((perf_counter() - tic) * 1000),
    )

# --------------------------------------------------------------------------- #
#  Match function                                                              #
# --------------------------------------------------------------------------- #
def _match(turn: Turn, convo: Conversation) -> bool:
    """
    Trigger only when **this is the very first user turn** in the conversation
    (i.e., conversation length == 0 before this turn).
    """
    return convo.num_user_turns == 0


# --------------------------------------------------------------------------- #
#  Exported Skill object                                                       #
# --------------------------------------------------------------------------- #
skill = Skill(
    name     = "engagement",
    kind     = "system",
    priority = 50,          # runs before intent / sales / etc.
    timeout  = 20,
    match    = _match,
    handle   = _handle,
)
