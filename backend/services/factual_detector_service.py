import re
from functools import lru_cache
from typing import Final

from services.openai_service import run_openai_prompt   # already retry-wrapped

# ── 1. Regex heuristics ────────────────────────────────────────────
_WH_PREFIX: Final = r"^(where|what|when|who|which|how\s+(?:many|long|much)|do you|does it|is there|are there)"
_FACT_KEYWORDS: Final = (
    "location|office|headquarter|hq|address|timezone|"
    "pricing tier|trial|demo length|setup time|integrat(?:e|ion)|"
    "compliance|soc2|nist|hipaa|certification|platforms"
)

_regex_factual = re.compile(fr"{_WH_PREFIX}.*({ _FACT_KEYWORDS })", re.I)

@lru_cache(maxsize=1024)
def _regex_is_factual(text: str) -> bool:
    return bool(_regex_factual.search(text.strip()))


# ── 2. LLM fallback for nuance ─────────────────────────────────────
_FALLBACK_PROMPT = """
Classify the user's question as FACTUAL or NONFACTUAL.

FACTUAL = seeks a concrete fact about company, product, services, availability, setup, price, or credentials.
NONFACTUAL = anything else (opinions, needs, pain points, objections, chit-chat).

Return ONLY the label.

User: "{q}"
"""

async def _llm_is_factual(text: str) -> bool:
    try:
        resp = await run_openai_prompt(
            _FALLBACK_PROMPT.format(q=text.replace('"', "'")),
            model="gpt-3.5-turbo-0125",
            max_tokens=1,
            temperature=0
        )
        return resp.strip().upper().startswith("FACTUAL")
    except Exception:
        # if LLM fails, fall back to heuristic decision
        return False


# ── 3. Public helper ──────────────────────────────────────────────
async def is_pure_factual(text: str) -> bool:
    """
    Returns True if message is probably a stand-alone factual query.
    """
    if _regex_is_factual(text):
        return True
    return await _llm_is_factual(text)
