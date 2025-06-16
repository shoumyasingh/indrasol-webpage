"""
Fast heuristic + micro-LLM classifier for follow-up stages.
Separate file keeps handler.py readable.
"""

from __future__ import annotations
import re, logging
from typing import Dict, Literal
from email_validator import validate_email, EmailNotValidError
from services.openai_service import run_openai_prompt

_LOG = logging.getLogger("skill.follow_up.stage")

# --- quick regex helpers ----------------------------------------------------
RE_EMAIL   = re.compile(r"\b[\w\.-]+@[\w\.-]+\.\w{2,}\b")
LEGAL_SUFX = re.compile(r"\b(inc|corp|co|llc|ltd|plc|gmbh|pvt|sa|oy)\.?$", re.I)

def _looks_email(text:str)->bool:
    if not RE_EMAIL.search(text): return False
    try:
        validate_email(RE_EMAIL.search(text)[0]); return True
    except EmailNotValidError: return False

def _looks_company(text:str)->bool:
    return (
        "@" not in text and
        (LEGAL_SUFX.search(text) or len(text.split()) <= 4) and
        text.replace(" ","").isalpha()
    )

def _looks_name(text:str)->bool:
    return (
        " " in text and
        1 < len(text.split()) <= 4 and
        text.replace(" ","").isalpha()
    )

YES_WORDS = {"yes","yeah","yep","sure","ok","okay","certainly","absolutely"}

# --- optional micro-LLM fallback -------------------------------------------
async def _llm_classify(snippet:str)->str:
    prompt = (
        "Classify the following snippet into "
        "[name, email, company, message, other]. "
        "Return only the label.\n\nSnippet: ```" + snippet + "```"
    )
    resp = await run_openai_prompt(prompt=prompt, system_prompt="", model="gpt-4o-mini",
                                   temperature=0, max_tokens=5)
    return resp.strip().lower()

# ---------------------------------------------------------------------------
async def detect_stage(
    collected: Dict[str,str],
    current: str,
    history: list[str]
) -> Literal[
    "ask_name","ask_email","ask_company","ask_message",
    "process_name","process_email","process_company","process_message",
    "complete_booking"
]:
    """Pure function → easy to unit-test."""

    cur = current.strip()
    low = cur.lower()

    # quick classification ---------------------------------------------------
    typ = (
        "email"    if _looks_email(cur) else
        "company"  if _looks_company(cur) else
        "name"     if _looks_name(cur) else
        "yes_no"   if low in YES_WORDS else
        "guess"
    )
    if typ == "guess":
        typ = await _llm_classify(cur)        # ~0.3¢ only when needed
    _LOG.info("classified '%s' → %s", cur, typ)

    # snapshot ---------------------------------------------------------------
    has_name    = bool(collected["name"])
    has_email   = bool(collected["email"])
    has_company = bool(collected["company"])
    has_msg     = bool(collected["message"])

    # processing branches ----------------------------------------------------
    if not has_name and typ == "name":
        return "process_name"
    if has_name and not has_email and typ == "email":
        return "process_email"
    if has_name and has_email and not has_company and typ == "company":
        return "process_company"
    if has_name and has_email and has_company and not has_msg:
        if typ == "message":
            return "process_message"
        return "ask_message"

    if not has_name:
        return "ask_name"
    if not has_email:
        return "ask_email"
    if not has_company:
        return "ask_company"

    # final gate
    if has_name and has_email and has_company and has_msg:
        return "complete_booking"

    return "ask_message"   # safe fallback
