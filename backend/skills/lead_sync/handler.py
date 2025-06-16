"""
skills/lead_sync/handler.py
---------------------------
Persists leads to `lead_logs` – and, if `qualified=True`, mirrors the
row into `qualified_leads`.

Duplicate guard
---------------
If the SAME lowercase(email) + ANY overlapping channel was logged
within the past 24 h the insert is skipped and the function returns
`{"status": "duplicate"}`.
"""

from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone
from time       import perf_counter
from typing     import Any, Dict, List, Optional

from mcp.schema import Conversation, Result, Skill, Turn
from services.supabase_service import (
    fetch_recent_leads,
    insert_lead_log,
    insert_qualified_lead,
)

_LOG = logging.getLogger("skill.lead_sync")
_DUPL_WINDOW = timedelta(hours=24)

# --------------------------------------------------------------------- #
# internal helper (shared by direct + dispatcher paths)
# --------------------------------------------------------------------- #
async def _sync_lead(
    *,
    user_id:   str,
    name:      str,
    email:     str,
    channel:   List[str],
    company:   Optional[str] = None,
    message:   Optional[str] = None,
    qualified: bool = False,
) -> Dict[str, Any]:
    email_lc = email.lower()

    # ── 1 / duplicate check ───────────────────────────────────────────
    recent = await fetch_recent_leads(
        email=email_lc,
        since=datetime.now(timezone.utc) - _DUPL_WINDOW
    )
    if recent and set(recent["channel"]) & set(channel):
        _LOG.info("Duplicate lead – skip insert for <%s>", email_lc)
        return {"status": "duplicate"}

    # ── 2 / build payload ─────────────────────────────────────────────
    created_at = datetime.now(timezone.utc).isoformat()
    payload = {
        "user_id":  user_id,
        "name":     name.strip(),
        "email":    email_lc,
        "company":  company.strip() if company else None,
        "message":  message.strip() if message else None,
        "channel":  channel,
        "created_at": created_at,
    }

    # ── 3 / insert into lead_logs ─────────────────────────────────────
    await insert_lead_log(payload)
    _LOG.info("Lead logged → %s", payload)

    # ── 4 / mirror to qualified_leads if flagged ─────────────────────
    if qualified:
        q_payload = {
            "user_id":  user_id,
            "email":    email_lc,
            "intent":   "Demo Booking",
            "product":  None,
            "service":  None,
            "qualified": True,
            "last_message": message or "",
            "logged_at": created_at,
        }
        await insert_qualified_lead(q_payload)
        _LOG.info("Mirrored to qualified_leads")

    return {"status": "ok"}


# --------------------------------------------------------------------- #
# 1)  DIRECT HELPER – other skills call this
# --------------------------------------------------------------------- #
async def run(**kwargs) -> Dict[str, Any]:
    """
    Direct-call signature preserved for existing code.

    Required kwargs: user_id, name, email, channel
    Optional: company, message, qualified (bool)
    """
    try:
        return await _sync_lead(**kwargs)
    except Exception as exc:                      # pragma: no cover
        _LOG.exception("Lead-sync failed: %s", exc)
        return {"status": "error", "error": str(exc)}


# --------------------------------------------------------------------- #
# 2)  MCP DISPATCHER PATH (rare but safe)
# --------------------------------------------------------------------- #
async def _handle(turn: Turn, convo: Conversation) -> Result:
    """
    Allows another skill/router to *delegate* lead logging by passing
    parameters inside the user turn JSON.  Example turn payload:
      { "text": "", "extra": { "select_skill":"lead_sync", "payload":{...} } }
    The dispatcher will parse `extra.payload` and supply it here via
    **turn.extra["payload"]** (per dispatcher logic).
    """
    tic = perf_counter()

    try:
        payload = turn.extra.get("payload", {}) if turn.extra else {}
        outcome = await _sync_lead(**payload)
        txt = f"Lead-sync result: **{outcome['status']}**"
    except Exception as exc:                      # pragma: no cover
        outcome = {"status": "error", "error": str(exc)}
        txt = f"Lead-sync error: {exc}"

    return Result(
        turn_id      = turn.id,
        text         = txt,
        routed_skill = "lead_sync",
        finished     = True,
        latency_ms   = int((perf_counter() - tic) * 1000),
        extra        = outcome,
    )


def _match(turn: Turn, convo: Conversation) -> bool:
    """
    Claim the turn ONLY if another component explicitly set
    extra.select_skill == "lead_sync".  Prevents accidental routing.
    """
    return convo.extras.get("select_skill") == "lead_sync"


# Exported Skill object – dispatcher picks it up automatically
skill = Skill(
    name     = "lead_sync",
    kind     = "helper",
    priority = 900,
    timeout  = 10,
    match    = _match,
    handle   = _handle,
)
