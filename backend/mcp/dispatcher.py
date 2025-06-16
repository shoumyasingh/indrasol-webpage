# mcp/dispatcher.py
"""
MCP Dispatcher
--------------

Selects the best Skill for a single user turn, executes that Skill,
and returns its Result.

  * Single source-of-truth for routing
  * Async / cancellation-safe
  * Robust logging + error handling
  * Graceful fallback when no Skill claims the turn
"""

from __future__ import annotations

import asyncio
import logging
from pathlib  import Path
from typing   import Optional, List

from mcp.schema       import Conversation, Turn, Result, Skill
from mcp.skill_loader import SkillLoader

LOGGER = logging.getLogger("mcp.dispatcher")

# ──────────────────────────────────────────────────────────────────────
#  Load all skills once at import-time
# ──────────────────────────────────────────────────────────────────────
_loader  = SkillLoader(Path(__file__).parent.parent / "skills")
_SKILLS: List[Skill] = _loader.load_all()    # already ordered by priority

# Log both name and priority, e.g. "sales(700)"
LOGGER.info(
    "Skill order: %s",
    [f"{s.name}({s.priority})" for s in _SKILLS],
)


_FALLBACK: Optional[Skill] = next(                     # optional catch-all
    (s for s in _SKILLS if s.kind == "fallback"), None
)


# ──────────────────────────────────────────────────────────────────────
#  Public, functional API
# ──────────────────────────────────────────────────────────────────────

async def dispatch(turn: Turn, convo: Conversation) -> Result:
    """
    Route *turn* through one or more skills.

    The loop stops when we get a Result that is either:
      • finished      == True      OR
      • text.strip()  != ""        OR
      • skill.kind    not in {"utility"}
    """
    LOGGER.info("MCP-dispatch turn=%s text=%s", turn.id, turn.text)

    executed: set[str] = set()
    while True:                                         # chain
        skill = _select_skill(turn, convo, executed)
        LOGGER.info("→ routed to skill «%s»", skill.name)

        timeout = getattr(skill, "timeout", 20)

        try:
            result: Result = await asyncio.wait_for(
                skill.handle(turn, convo), timeout
            )
            LOGGER.debug("skill %s returned %s", skill.name, result)

        except asyncio.TimeoutError:
            LOGGER.error("skill %s timed-out", skill.name)
            return Result.make_error(
                turn_id=turn.id,
                err_msg=f"{skill.name} timed-out — please try again."
            )

        except Exception as exc:
            LOGGER.exception("skill %s crashed: %s", skill.name, exc)
            return Result.make_error(
                turn_id=turn.id,
                err_msg="Sorry, I hit an internal error. Please try again."
            )

        # ── stop-condition ────────────────────────────────────────────
        if (
            result.finished
            or result.text.strip()                       # user-visible text
            or skill.kind != "utility"                  # non-utility skill
        ):
            return result

        # no-op utility → keep chaining
        executed.add(skill.name)
        LOGGER.info("Skill %s produced no user text – continuing chain", skill.name)

# async def dispatch(turn: Turn, convo: Conversation) -> Result:
#     """Route *turn* to the first Skill whose `match()` returns True."""
#     LOGGER.info("MCP-dispatch turn=%s  text=%s meta=%s", turn.id, turn.text, turn.meta)

#     skill = _select_skill(turn, convo)
#     LOGGER.info("→ routed to skill «%s»", skill.name)

#     timeout = getattr(skill, "timeout", 20)  # seconds  (optional in manifest)

#     try:
#         result: Result = await asyncio.wait_for(skill.handle(turn, convo), timeout)
#         LOGGER.info("skill %s completed in %s ms", skill.name, result.latency_ms)
#         return result

#     except asyncio.TimeoutError:
#         LOGGER.error("skill %s timed-out after %s s", skill.name, timeout)
#         return Result.make_error(turn.id, f"Skill {skill.name} timed-out — please try again.")

#     except Exception as exc:                 # pylint: disable=broad-except
#         LOGGER.exception("skill %s crashed: %s", skill.name, exc)
#         return Result.make_error(turn.id, "Sorry, I hit an internal error. Please try again.")


# ──────────────────────────────────────────────────────────────────────
#  Internal helpers
# ──────────────────────────────────────────────────────────────────────
def _select_skill(
    turn: Turn, convo: Conversation, skip: set[str]
) -> Skill:
    """
    First skill whose match() returns True **and** is not in *skip*.
    Falls back to inline-fallback.
    """
    for skill in _SKILLS:
        if skill.name in skip:
            continue
        try:
            if skill.match(turn, convo):
                return skill
        except Exception as exc:
            LOGGER.exception("match() failed in %s: %s", skill.name, exc)

    return _FALLBACK if _FALLBACK else _make_inline_fallback()


def _make_inline_fallback() -> Skill:
    """Create an in-memory Skill object used only if nothing else exists."""
    async def _handle(turn: Turn, _: Conversation) -> Result:
        return Result(
            turn_id      = turn.id,
            text         = "I'm not sure I can help with that – could you try rephrasing?",
            routed_skill = "inline-fallback",
            finished     = False
        )

    def _match(_: Turn, __: Conversation) -> bool:
        return True

    return Skill(
        name     = "inline-fallback",
        kind     = "fallback",
        match    = _match,
        handle   = _handle,
        priority = 99_999
    )

# ──────────────────────────────────────────────────────────────────────
#  Class façade for routers / tests that want their own instance
# ──────────────────────────────────────────────────────────────────────
def _skills_root_default() -> Path:
    return Path(__file__).parent.parent / "skills"


class Dispatcher:
    """
    Wrapper that lets external code hold its *own* skill-set
    (useful in tests) while still re-using the global routing logic.
    """
    def __init__(self, skills: Optional[List[Skill]] | None = None) -> None:
        self.skills: List[Skill] = skills or _SKILLS            # fall back to global list

    # keep parity with old call-site
    @staticmethod
    def default_skills_root() -> Path:
        return _skills_root_default()

    # instance method simply delegates to module-level dispatch()
    async def dispatch(self, turn: Turn, convo: Conversation) -> Result:
        return await dispatch(turn, convo)


