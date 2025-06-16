import re, logging
from email_validator import validate_email, EmailNotValidError
from services.openai_service import run_openai_prompt


# ---------- regex helpers ----------
RE_EMAIL   = re.compile(r"\b[\w\.-]+@[\w\.-]+\.\w{2,}\b")
LEGAL_SUFX = re.compile(r"\b(inc|corp|co|llc|ltd|plc|gmbh|pvt|sa|oy)\.?$", re.I)
YES_WORDS  = {"yes","yeah","yep","sure","ok","okay","certainly","absolutely"}
# sentences ≳ 4 words after company almost always = message
LONG_FREE  = re.compile(r"\b\w+(?:\s+\w+){2,}")  

def bot_recently_asked_for_message(history: str) -> bool:
    # peek at last 2 bot lines (cheap heuristic)
    hist = history.lower().splitlines()
    bot_turns = [l for l in hist[-4:] if l.startswith("bot:")]
    return any(k in " ".join(bot_turns)
               for k in ("goal", "pain-point", "challenge", "topic", "focus"))

def is_email(text:str)->bool:
    if not RE_EMAIL.search(text): return False
    try:
        validate_email(RE_EMAIL.search(text)[0])
        return True
    except EmailNotValidError:
        return False
    
def is_yes_word(t: str) -> bool:
    return t.lower().strip() in YES_WORDS

def is_company(text:str)->bool:
    """
    Treat 1-5 word strings *without* @ as company when:
      • ends with a legal suffix  OR
      • contains "inc", "corp" etc.                        OR
      • user is at "ask_company" stage and text isn't name/email/yes
    """
    t = text.strip()
    if "@" in t:
        return False
    words = t.split()
    if not (1 <= len(words) <= 5):
        return False
    # 1) clear legal suffix
    if LEGAL_SUFX.search(t):
        return True
    # 2) common company keywords
    if any(w.lower() in {"inc","corp","llc","ltd","gmbh"} for w in words):
        return True
    # 3) otherwise treat as company if it contains a consonant and isn't a pure "yes"
    return any(c.isalpha() and c.lower() not in "aeiou" for c in t) and t.lower() not in YES_WORDS

def is_name(text:str)->bool:
    # Exclude common business/service terms that might appear in names
    txt = text.strip()
    if is_yes_word(txt):
        return False
    
    words = txt.split()
    if not (1 <= len(words) <= 4):
        return False
    if not all(w.isalpha() for w in words):
        return False
    
    if "@" in txt and "." in txt:
        return False
    
    banned = {
        "engineering", "security", "cloud", "data", "application", 
        "services", "products", "solutions", "track", "radar",
        "ai", "artificial", "intelligence", "machine", "learning"
    }
    
    
    return all(w.lower() not in banned for w in words)

# ---------- LLM fallback ----------
async def llm_classify(free_text:str)->str:
    """Returns one of name/email/company/message/other."""
    prompt = (f"Classify the following snippet into "
              f"[name, email, company, message, other]. "
              f"Return only the label.\n\nSnippet: ```{free_text}```")
    resp = await run_openai_prompt(prompt, model="gpt-4o-mini")
    return resp.choices[0].message.content.strip().lower()

# ---------- main detector ----------
async def detect_stage(collected:dict, current:str, history:str)->str:
    cur = current.strip()
    low = cur.lower()

    has_name    = bool(collected.get("name"))
    has_email   = bool(collected.get("email"))
    has_company = bool(collected.get("company"))
    has_msg     = bool(collected.get("message"))

     # ---------- 1. classify the user's latest input ---------------------
    if is_email(cur):
        typ = "email"
    elif is_company(cur):
        typ = "company"
    elif is_name(cur):
        typ = "name"
    elif low in YES_WORDS:
        typ = "yes_no"
    else:
        typ = await llm_classify(cur)      # message / other

    logging.info("classified current input as %s", typ)

     # ---------- 2. decide the next stage --------------------------------
     # (order matters – go from least to most-specific)
    
    # a) still collecting the three mandatory fields
    if not has_name and typ == "name":
        return "process_name"
    if has_name and not has_email and typ == "email":
        return "process_email"
    if has_name and has_email and not has_company and typ == "company":
        return "process_company"

    # b) we HAVE name/email/company but not the optional message yet
    #    treat *any* non-empty response as a message – even if it looks like
    #    "company" – because we already stored the company.
    if has_name and has_email and has_company and not has_msg:
        if cur.strip():  # any non-empty response becomes the message
            return "process_message"
        return "ask_message"
    
    # c) everything collected –> finish
    if all((has_name, has_email, has_company, has_msg)):
        return "complete_booking"

    # d) default ask-sequence fall-through
    if not has_name:
        return "ask_name"
    if not has_email:
        return "ask_email"
    if not has_company:
        return "ask_company"
    return "ask_message"
