import re
from functools import lru_cache

# --- legacy keywords (fast, free) -----------
_OBJECTION_KEYWORDS = [
    "expensive", "cost", "price", "budget",
    "complex", "difficult", "hard to set up",
    "secure", "compliance", "risk",
    "already use", "have another tool", "alternative", "too much", "too high"
]

_regex_pattern = re.compile(r"\b(" + "|".join(re.escape(k) for k in _OBJECTION_KEYWORDS) + r")\b", re.I)

# --- LLM prompt template --------------------
_CLASSIFIER_PROMPT = """
You are an intent classifier for sales objections.
Classify the user's last sentence as either:
OBJECTION, NO_OBJECTION.

An OBJECTION includes concerns about price, budget, complexity,
security, integration, timeline, or "already using another vendor".

Return ONLY the label.

User: "{sentence}"
"""

@lru_cache(maxsize=512)   # memoise identical queries
def _regex_hit(text: str) -> bool:
    return bool(_regex_pattern.search(text))

async def _llm_objection_check(text: str) -> bool:
    """
    One cheap OpenAI call (~1¢ per 1K tokens) that returns True/False.
    """
    prompt = _CLASSIFIER_PROMPT.format(sentence=text.strip())
    try:
        result = await run_openai_prompt(prompt, model="gpt-3.5-turbo-0125", max_tokens=1, temperature=0)
        return result.strip().upper().startswith("OBJECTION")
    except Exception as e:
        # if LLM fails, opt-out to regex
        return _regex_hit(text)

# PUBLIC API ------------------------------------------------------------------
async def contains_objection(text: str) -> bool:
    """
    Fast path: regex.  If it fires -> True (cheap).
    Else call LLM for nuanced phrases ("Seems steep for our startup").
    """
    if _regex_hit(text):
        return True
    return await _llm_objection_check(text)