from __future__ import annotations
import logging
from services.pinecone_service import query_pinecone          # ← your existing helper
from mcp.schema import Skill, Turn, Conversation, Result

_LOG = logging.getLogger("skill.rag_context")


def _needs_context(turn: Turn) -> bool:            # very lightweight filter
    return len(turn.text.split()) > 2              # ignore “yes”, “hi”, …

async def _handle(turn: Turn, convo: Conversation) -> Result:
    filters = {}
    website = await query_pinecone(turn.text, namespace="website", filters=filters)
    matches = website or await query_pinecone(turn.text, namespace="sales", filters=filters)

    chunks  = [m["text"] for m in matches]
    meta    = {"rag_chunks": chunks[:6]}           # keep it small

    _LOG.info("RAG found %s chunks", len(chunks))

    return Result(
        turn_id      = turn.id,
        text         = "",                         # utility skills often say nothing
        routed_skill = "rag-context",
        finished     = False,
        meta         = meta
    )

skill = Skill(
    name     = "rag-context",
    kind     = "utility",
    priority = 180,
    match    = lambda t, c: _needs_context(t),
    handle   = _handle
)
