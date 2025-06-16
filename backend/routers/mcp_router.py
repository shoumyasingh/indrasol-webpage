"""
FastAPI entry-point that hands every incoming chat turn to the MCP dispatcher.

• One POST  /v1/mcp/message     – main chat endpoint
• One GET   /v1/mcp/skills      – quick health / debugging

The router:
  1.  Builds / updates a Conversation object per user-id
  2.  Delegates routing to mcp.dispatcher.Dispatcher
  3.  Persists memory + lead logs via helpers in services.supabase_service
"""
from __future__ import annotations

import logging
import uuid
from time import perf_counter

from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel

from mcp.dispatcher import Dispatcher
from mcp.skill_loader import SkillLoader
from mcp.schema import Conversation, Turn
from models.request_models import ChatRequest
from models.response_models import ChatResponse

from services.supabase_service import (
    get_conversation_history,
    upsert_conversation_memory,
    insert_lead_log,
)

# -------------------------------------------------------------------- #
#  FastAPI plumbing
# -------------------------------------------------------------------- #
router = APIRouter(prefix="/mcp", tags=["mcp"])
LOGGER = logging.getLogger("mcp.router")

# One global Dispatcher instance (skills loaded once at startup)
_DISPATCHER: Dispatcher | None = None


def _get_dispatcher() -> Dispatcher:
    global _DISPATCHER
    if _DISPATCHER is None:
        skills_root = Dispatcher.default_skills_root()
        loaded      = SkillLoader(skills_root).load_all()
        _DISPATCHER = Dispatcher(loaded)        # class we just added
    return _DISPATCHER



# -------------------------------------------------------------------- #
#  Routes
# -------------------------------------------------------------------- #
@router.get("/skills", summary="List active MCP skills")
async def list_skills(dispatcher: Dispatcher = Depends(_get_dispatcher)):
    return {
        "count": len(dispatcher.skills),
        "skills": [
            {
                "name": s.name,
                "kind": s.kind,
                "priority": s.priority,
                "timeout": s.timeout,
            }
            for s in dispatcher.skills
        ],
    }


@router.post(
    "/message",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
)
async def chat_endpoint(payload: ChatRequest,
                        dispatcher: Dispatcher = Depends(_get_dispatcher)):
    """
    Single chat-turn handler.

    Workflow
    --------
    1. Build / fetch Conversation from Supabase
    2. Append new Turn
    3. Call dispatcher – get Result
    4. Persist updated memory + lead log if finished
    5. Return Result to client
    """
    # 0. user_id
    user_id = payload.user_id or str(uuid.uuid4())

    # 1. Load previous history (strings → Conversation)
    history_strings  = await get_conversation_history(user_id, as_strings=True)
    conversation     = Conversation(user_id=user_id)
    for line in history_strings:
        # Original history strings include "User:" / "Bot:" prefixes
        if line.startswith("User: "):
            conversation.add_turn(
                Turn(id=str(uuid.uuid4()), text=line[6:])
            )
        elif line.startswith("Bot: "):
            conversation.add_turn(
                Turn(id=str(uuid.uuid4()), text=line[5:], meta={"role": "bot"})
            )

    # 2. Append this incoming turn
    new_turn = Turn(id=str(uuid.uuid4()), text=payload.text)
    conversation.add_turn(new_turn)
    LOGGER.info("Step 2: New turn added: %s", new_turn)

    # 3. Dispatch
    t0      = perf_counter()
    result  = await dispatcher.dispatch(new_turn, conversation)
    result.latency_ms = int((perf_counter() - t0) * 1_000)
    LOGGER.info("Step 3: Result: %s", result)

    # 4. Persist conversation memory (async – don’t block response)
    try:
        # Build human-readable history strings for storage
        hist_strings = []
        for turn in conversation.turns:
            prefix = "User: " if turn.meta.get("role") != "bot" else "Bot: "
            hist_strings.append(prefix + turn.text)

        await upsert_conversation_memory(
            user_id=user_id,
            memory={
                "last_skill": result.routed_skill,
                "finished":   result.finished,
            },
            history=hist_strings,
        )
        LOGGER.info("Step 4: Conversation memory updated")

        # If the skill logged a lead (follow-up skill does this) – insert
        if result.routed_skill == "follow_up" and result.finished:
            lead_payload = {
                "user_id":  user_id,
                "name":     conversation.memory.get("name", ""),
                "email":    conversation.memory.get("email", ""),
                "company":  conversation.memory.get("company", ""),
                "message":  conversation.memory.get("message", ""),
                "channel":  ["email"],
            }
            await insert_lead_log(lead_payload)
            LOGGER.info("Step 5: Lead logged")
    except Exception as exc:            # no 500 for the user – just log
        LOGGER.exception("Memory / lead persistence failed: %s", exc)

    # 5. Error → raise HTTP 500
    if result.error:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=result.error,
        )

    # 6. Return
    return ChatResponse(**result.to_dict())
