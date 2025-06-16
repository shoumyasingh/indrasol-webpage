import json
import logging
from typing import Dict, List, Any
from pathlib import Path
from services.openai_service import run_openai_prompt
from services.bot_response_formatter_md import ensure_markdown
from services.email_service import process_contact
from models.request_models import ContactForm
from services.stage_detect_service import detect_stage, is_name
import re

PROMPT_PATH = Path(__file__).parent.parent / "prompts/follow_up_prompt.txt"

async def run_follow_up_agent(user_message: str, context: str = "", history: str = "") -> Dict[str, Any]:
    """
    Run the follow-up agent to handle demo booking and lead collection
    Returns: {reply: str, finished: bool, suggested: List[str]}
    """
    try:
        logging.info(f"Follow-up agent processing: '{user_message}'")
        logging.info(f"History: {history}")
        
        # -----------------------------------------------------------------
        # 1) pull structured info from transcript
        # -----------------------------------------------------------------
        collected_info = await extract_collected_info(history, user_message)
        logging.info(f"Collected info after extraction: {collected_info}")
        
        # -----------------------------------------------------------------
        # 2) stage detection (regex + LLM hybrid)
        # -----------------------------------------------------------------
        stage = await detect_stage(collected_info, user_message, history)
        logging.info("Stage classified as ➜ %s", stage)

        # stage may indicate the user *just* supplied a field; store it
        await _apply_processing_stage(collected_info, stage, user_message)
        logging.info(f"Final collected info after processing: {collected_info}")
        
        # -----------------------------------------------------------------
        # 3) craft reply / side-effects (e-mail) based on stage
        # -----------------------------------------------------------------
        payload = await generate_stage_response(stage, collected_info, user_message, history)
        payload["reply"] = await ensure_markdown(payload["reply"])
        
        # Add collected info to payload for use in router
        payload["collected_info"] = collected_info

        return payload
        
    except Exception as e:
        logging.error(f"Follow-up agent error: {e}")
        return {
            "reply": "I'd be happy to help you book a demo! Could you please share your name so I can get that set up for you?",
            "finished": False,
            "suggested": ["Share my name", "Tell me more first", "Maybe later"]
        }

# =====================================================================
# helper: parse transcript for name/email/company/message
# =====================================================================
async def extract_collected_info(history: str, current: str) -> Dict[str, str]:
    """
    Enhanced extraction of structured info from USER lines in the transcript.
    Properly extracts name, email, company, and message from the conversation flow.
    """
    info = {"name": "", "email": "", "company": "", "message": ""}

    if not history:
        return info

    user_lines = []
    bot_lines = []
    
    # Parse history into user and bot lines
    for raw in history.splitlines():
        line = raw.strip()
        if line.lower().startswith("user:"):
            user_text = line[5:].strip()
            user_lines.append(user_text)
        elif line.lower().startswith("bot:"):
            bot_text = line[4:].strip()
            bot_lines.append(bot_text.lower())

    # Extract information based on conversation flow
    for i, user_text in enumerate(user_lines):
        # Email detection
        if not info["email"] and "@" in user_text and "." in user_text:
            info["email"] = user_text
            logging.info(f"User Info: {info}")
            continue

        # Name detection
        if not info["name"] and is_name(user_text):
            info["name"] = user_text
            logging.info(f"User Info: {info}")
            continue

        # Company detection - look for context clues from bot messages
        if not info["company"]:
            # Check if the previous bot message was asking for company
            if i < len(bot_lines):
                # Look at the corresponding bot message or the one before
                bot_idx = min(i, len(bot_lines) - 1)
                prev_bot = bot_lines[bot_idx] if bot_idx >= 0 else ""
                if any(keyword in prev_bot for keyword in ["company", "represent", "organization", "work"]):
                    # This user response is likely the company
                    info["company"] = user_text
                    logging.info(f"User Info: {info}")
                    continue
            
            # Also check if this looks like a company name and we need one
            if info["name"] and info["email"] and not info["company"]:
                # If we have name and email but no company, and this doesn't look like an email or name
                if not ("@" in user_text) and not is_name(user_text):
                    info["company"] = user_text
                    logging.info(f"User Info: {info}")
                    continue

        # Message detection - look for responses to challenges/goals/pain-points questions
        if not info["message"]:
            # Check if the previous bot message was asking for challenges/goals/pain-points
            if i < len(bot_lines):
                # Look at the corresponding bot message or the one before
                bot_idx = min(i, len(bot_lines) - 1)
                prev_bot = bot_lines[bot_idx] if bot_idx >= 0 else ""
                if any(keyword in prev_bot for keyword in ["goal", "pain-point", "challenge", "topic", "focus", "cover"]):
                    # This user response is likely the message
                    info["message"] = user_text
                    logging.info(f"User Info: {info}")
                    continue
            
            # Also check if we have all other info and this is the final piece
            if info["name"] and info["email"] and info["company"] and not info["message"]:
                # If we have name, email, and company, this must be the message
                info["message"] = user_text
                logging.info(f"User Info: {info}")
                continue

        logging.info(f"User Info: {info}")

    return info

# =====================================================================
# helper: mutate collected-info when stage == process_*
# =====================================================================
async def _apply_processing_stage(collected: Dict[str, str], stage: str, msg: str) -> None:
    msg = msg.strip()
    if stage == "process_name":
        collected["name"] = msg
    elif stage == "process_email":
        collected["email"] = msg
    elif stage == "process_company":
        collected["company"] = msg
    elif stage == "process_message":
        collected["message"] = msg

# =====================================================================
# response logic per stage
# =====================================================================
async def generate_stage_response(
    stage: str,
    info: Dict[str, str],
    current: str,
    history: str
) -> Dict[str, Any]:

    name, email, company, user_msg = (
        info.get("name"), info.get("email"), info.get("company"), info.get("message")
    )

    # -------- ask-* branches ------------------------------------------------
    if stage == "ask_name":
        return _simple("Perfect! What's your **name** so I can personalise things?",
                       ["Share my name", "Skip for now", "More details"])

    if stage == "ask_email":
        return _simple(f"Thanks **{name}**! What's the best **email** to reach you?",
                       ["Provide email", "Skip email", "Book demo later"])

    if stage == "ask_company":
        return _simple("Great – which **company** are you with? "
                       "That helps me tailor the demo.",
                       ["Share company", "Freelancer / none", "Skip"])

    if stage == "ask_message":
        return _simple("Awesome! Any particular **challenges or topics** you'd "
                       "like us to cover?",
                       ["Security challenges", "Integration questions", "Skip this"])

    # -------- process-* (user just sent field) ------------------------------
    if stage == "process_name":
        return _simple(f"Thanks **{current.strip()}**. Could I grab your **email** next?",
                       ["Provide email", "Skip email"])

    if stage == "process_email":
        return _simple("Got it. And which **company** do you represent?",
                       ["Share company", "I'm independent"])

    if stage == "process_company":
        return _simple("Perfect. Lastly, any specific **goals or pain-points** "
                       "for the session?",
                       ["Share goals", "Skip", "Book now"])

    if stage == "process_message":
        # we now have the final missing piece
        stage = "complete_booking"

    # -------- booking complete ---------------------------------------------
    if stage == "complete_booking":
        return await _book_demo(info, current)

    # -------- fallback  -----------------------------------------------------
    return _simple("Let me help you schedule that demo – what's your **name**?",
                   ["Share my name", "Later"])


# =====================================================================
# internal helpers
# =====================================================================
def _simple(reply: str, suggested: List[str]) -> Dict[str, Any]:
    return {"reply": reply, "finished": False, "suggested": suggested}


async def _book_demo(info: Dict[str, str], last_user_text: str) -> Dict[str, Any]:
    """
    Sends the e-mail via ContactForm → process_contact()
    """
    try:
        # Build message body
        body = f"Demo request from chatbot\n\n"
        if info["message"]:
            body += f"User message: {info['message']}\n\n"
        body += "Interested in scheduling a demo / discovery call."

        form = ContactForm(
            name    = info["name"],
            email   = info["email"],
            company = info["company"] or None,
            message = body
        )
        await process_contact(form)
        logging.info("✔ Demo booked for %s <%s>", info['name'], info['email'])

        return {
            "reply": f"Perfect, **{info['name']}**! I've logged your request – "
                     "you'll receive a confirmation e-mail with more details. Our team is excited to connect!",
            "finished": True,
            "suggested": ["Great, thanks!", "Reschedule later"]
        }

    except Exception as e:
        logging.exception("Booking failed: %s", e)
        return _simple(
            "Hmm, something went wrong while scheduling. "
            "Let me alert a human colleague to reach out shortly.",
            ["Try again", "Contact support"]
        )