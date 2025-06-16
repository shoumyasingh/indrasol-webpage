"""
skills/memory/handler.py
------------------------
Single authority for reading / updating the `conversation_memory` row
in Supabase.

• If called *directly* (e.g. from another skill) use:

    await skills.memory.handler.run(user_id, patch={...})

• If ever routed by the MCP dispatcher it still behaves, returning
  a Result object so the pipeline stays consistent.
"""

from __future__ import annotations

import logging
from time import perf_counter
from typing import Any, Dict, Optional

from mcp.schema import Conversation, Result, Skill, Turn
from services.supabase_service import (
    get_conversation_memory, upsert_conversation_memory
)

_LOG = logging.getLogger("skill.memory")

# --------------------------------------------------------------------- #
# Internal helper (shared by both call paths)
# --------------------------------------------------------------------- #
async def _read_write(user_id: str,
                      patch: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Reads current memory, optionally merges `patch`, persists, and
    returns the (possibly updated) row.
    """
    current = await get_conversation_memory(user_id) or {}
    _LOG.debug("Fetched memory for %s → %s", user_id, current)

    if patch:
        merged = {**current, **patch}
        await upsert_conversation_memory(user_id=user_id, memory=merged)
        _LOG.info("Upserted memory for %s → %s", user_id, merged)
        current = merged

    return current


# --------------------------------------------------------------------- #
# 1)  DIRECT CALL  – other skills / routers use this
# --------------------------------------------------------------------- #
async def run(user_id: str,
              patch: Optional[Dict[str, Any]] = None,
              **kwargs) -> Dict[str, Any]:
    """
    Direct helper – returns a plain dict (legacy contract).

    Returns
    -------
    {
      "status": "ok" | "error",
      "memory": { …full row… } | {},
      "error":  "...msg"          # only on failure
    }
    """
    try:
        mem = await _read_write(user_id, patch)
        return {"status": "ok", "memory": mem}

    except Exception as exc:                     # pragma: no cover
        _LOG.exception("Memory skill failed: %s", exc)
        return {"status": "error", "memory": {}, "error": str(exc)}


# --------------------------------------------------------------------- #
# 2)  MCP DISPATCH PATH (rare but safe)
# --------------------------------------------------------------------- #
async def _handle(turn: Turn, convo: Conversation) -> Result:
    """
    Permits the dispatcher to route here if a user explicitly asks
    something like “What info do you have on me?”.
    """
    tic = perf_counter()
    try:
        mem = await _read_write(convo.user_id)
        text = (
            "Here’s what I’ve stored so far:\n\n"
            "```json\n" + mem.__repr__() + "\n```"
        )
    except Exception as exc:                    # pragma: no cover
        text = f"Sorry – couldn’t fetch memory: {exc}"

    return Result(
        turn_id      = turn.id,
        text         = text,
        routed_skill = "memory",
        finished     = True,
        latency_ms   = int((perf_counter() - tic) * 1000),
    )


def _match(turn: Turn, convo: Conversation) -> bool:
    """
    Only claim the turn if it *explicitly* looks like a memory request.
    Keeps the skill out of normal routing.
    """
    return turn.text.strip().lower() in {
        "show memory", "what do you know about me", "show context"
    }


# Exported Skill object (dispatcher will ignore unless _match() == True)
skill = Skill(
    name     = "memory",
    kind     = "helper",
    priority = 900,     # very low priority
    timeout  = 8,
    match    = _match,
    handle   = _handle,
)
