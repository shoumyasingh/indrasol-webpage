"""
📦 skills/follow_up/handler.py
Collect visitor details (name → email → company → message) and, once all four
are captured, trigger an internal e-mail via `process_contact()`.

The skill is *state-driven*:

    ask_name → process_name → ask_email → process_email
      → ask_company → process_company → ask_message → process_message
      → complete_booking
"""

from __future__ import annotations

import html
import logging
from time import perf_counter
from typing import Any, Dict, List

from mcp.schema import Conversation, Result, Skill, Turn
from services.bot_response_formatter_md import ensure_markdown
from services.email_service            import process_contact
from models.request_models             import ContactForm
from .stage_detect                     import detect_stage

_LOG = logging.getLogger("skill.follow_up")

# ---------------------------------------------------------------------------- #
#  Utilities                                                                   #
# ---------------------------------------------------------------------------- #
def _scrape_history(history: List[str]) -> Dict[str, str]:
    """
    Very light regex sweep over USER lines only.  Returns
    dict(name, email, company, message) — missing keys are empty strings.
    """
    info = {"name": "", "email": "", "company": "", "message": ""}

    for line in history:
        if not line.lower().startswith("user:"):
            continue
        content = line[5:].strip()

        if not info["email"] and "@" in content and "." in content:
            info["email"] = content
        elif (
            not info["name"]                       # name not set yet
            and " " in content                     # at least 2 words
            and content.replace(" ", "").isalpha() # only letters
        ):
            info["name"] = content
        # company and message are left for stage-detect

    return info


def _simple(reply: str, suggested: List[str]) -> Result:
    return Result(
        turn_id      = "",     # filled by dispatcher afterwards
        text         = reply,
        routed_skill = "follow_up",
        finished     = False,
        suggested    = suggested
    )


async def _book_demo(info: Dict[str, str]) -> Result:
    """Fire the e-mail and build a success reply."""
    body = (
        "Demo request from chatbot\n\n"
        f"User message: {info['message'] or '—'}\n\n"
        "Interested in scheduling a demo / discovery call."
    )
    form = ContactForm(
        name    = info["name"],
        email   = info["email"],
        company = info["company"] or None,
        message = body,
    )

    try:
        await process_contact(form)
        _LOG.info("✔ Demo booked for %s <%s>", info['name'], info['email'])

        reply = (
            f"Perfect, **{html.escape(info['name'])}**! "
            "Your request is logged — expect a confirmation e-mail shortly."
        )
        reply = await ensure_markdown(reply)

        return Result(
            turn_id      = "",
            text         = reply,
            routed_skill = "follow_up",
            finished     = True,
            suggested    = ["Great, thanks!", "Reschedule later"],
            payload      = info                       # pass details upstream
        )

    except Exception as exc:                                         # pragma: no cover
        _LOG.exception("❌ Booking failed: %s", exc)
        return _simple(
            "Hmm, something went wrong while scheduling. I’ll alert a human "
            "colleague to follow up.",
            ["Try again", "Contact support"],
        )


# ---------------------------------------------------------------------------- #
#  Skill.handle()                                                              #
# ---------------------------------------------------------------------------- #
async def _handle(turn: Turn, convo: Conversation) -> Result:         # noqa: C901
    tic = perf_counter()

    history_strings = convo.to_legacy_strings()   # helper on Conversation
    collected       = _scrape_history(history_strings)

    stage = await detect_stage(collected, turn.text, history_strings)
    _LOG.info("Demo-booking stage ➜ %s", stage)

    # Store what user *just* sent if `process_*`
    msg = turn.text.strip()
    if stage == "process_name":
        collected["name"] = msg
    elif stage == "process_email":
        collected["email"] = msg
    elif stage == "process_company":
        collected["company"] = msg
    elif stage == "process_message":
        collected["message"] = msg
        stage = "complete_booking"

    # ---------- branching replies -----------------------------------------
    if stage == "ask_name":
        return _simple(
            "Perfect! May I get your **name** so I can personalise things?",
            ["Share my name", "Maybe later"]
        )

    if stage == "process_name":
        return _simple(
            f"Thanks **{html.escape(msg)}**! What’s the best **email** to reach you?",
            ["Provide email", "Skip e-mail"]
        )

    if stage == "ask_email":
        return _simple(
            f"Thanks **{html.escape(collected['name'])}**! "
            "Could you share your **e-mail**?",
            ["Provide email", "Skip e-mail"]
        )

    if stage == "process_email":
        return _simple(
            "Got it. Which **company** are you with?",
            ["Share company", "Freelancer / none"]
        )

    if stage in {"ask_company", "process_company"}:
        # Whether we just processed or still need company, next step is message
        return _simple(
            "Great. Any specific **goals or challenges** "
            "you’d like us to cover during the demo?",
            ["Security challenges", "Integration questions", "Skip"]
        )

    if stage == "ask_message":
        return _simple(
            "Any particular **topics** you want to focus on?",
            ["Security challenges", "Integration questions", "Skip"]
        )

    if stage == "complete_booking":
        res = await _book_demo(collected)
        res.latency_ms = int((perf_counter() - tic) * 1000)
        return res

    # Fallback — should rarely be hit
    return _simple(
        "Let me help you schedule that demo — what’s your **name**?",
        ["Share my name"]
    )


# ---------------------------------------------------------------------------- #
#  Skill.match()                                                               #
# ---------------------------------------------------------------------------- #
def _match(turn: Turn, convo: Conversation) -> bool:
    """
    Trigger if either:
      1. We’re **already** collecting info (demo_stage = collecting_info), or
      2. The current user message explicitly asks to “book a demo / schedule”.
    """
    state = convo.state
    if state.get("demo_stage") == "collecting_info":
        return True

    txt = turn.text.lower()
    explicit_kw = ("book demo", "schedule demo", "demo booking",
                   "book a demo", "schedule a demo")
    return any(k in txt for k in explicit_kw)


# ---------------------------------------------------------------------------- #
#  Exported Skill object                                                       #
# ---------------------------------------------------------------------------- #
skill = Skill(
    name     = "follow_up",
    kind     = "system",
    priority = 550, 
    timeout  = 30,
    match    = _match,
    handle   = _handle,
)
