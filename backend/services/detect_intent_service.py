"""
High-speed fuzzy keyword detection for:

  • Product / Service interest          → detect_interest()
  • Demo-request trigger                → is_demo_request()
  • Positive ‘yes’ style confirmations  → is_positive_response()

Powered by RapidFuzz (≈300 kB, MIT, SIMD) so each call is <1 ms.
"""

from rapidfuzz import fuzz

# ---------------------------------------------------------------------------
# Product / Service keyword maps
# ---------------------------------------------------------------------------
PRODUCT_KEYWORDS = {
    "securetrack":  "SecureTrack",
    "secure track": "SecureTrack",
    "bizradar":     "BizRadar",
    "biz radar":    "BizRadar",
}

SERVICE_KEYWORDS = {
    "cloud security":        "Cloud Security",
    "cloud sec":             "Cloud Security",
    "ai security":           "AI Security",
    "ml security":           "AI Security",
    "application security":  "Application Security",
    "appsec":                "Application Security",
    "data engineering":      "Data Engineering",
    "cloud engineering":     "Cloud Engineering",
}

# ---------------------------------------------------------------------------
# Demo-intent word lists
# ---------------------------------------------------------------------------
DEMO_TRIGGERS = [
    "book demo", "schedule demo", "demo", "live demo", "quick call",
    "book a demo", "schedule a demo", "connect me", "connect with",
    "speak to", "expert team"
]

POSITIVE_WORDS = [
    "yes", "sure", "absolutely", "definitely", "ok", "okay",
    "yep", "yeah", "of course", "sounds good", "let's do it"
]

FUZZ_THRESHOLD = 85            # similarity (0-100)

# ---------------------------------------------------------------------------
# Shared helper
# ---------------------------------------------------------------------------
def fuzzy_contains(text: str, patterns: list[str], threshold: int = FUZZ_THRESHOLD) -> bool:
    """
    True if *any* pattern appears exactly OR with ≥ threshold partial-ratio.
    """
    text = text.lower()
    for pat in patterns:
        if pat in text:
            return True
        if fuzz.partial_ratio(pat, text) >= threshold:
            return True
    return False

# ---------------------------------------------------------------------------
# Product / Service detector
# ---------------------------------------------------------------------------
def _best_match(corpus: str, mapping: dict[str, str]) -> str:
    best_label = ""
    best_score = 0
    for kw, label in mapping.items():
        if kw in corpus:
            return label
        score = fuzz.partial_ratio(kw, corpus)
        if score > best_score and score >= FUZZ_THRESHOLD:
            best_score = score
            best_label = label
    return best_label

def detect_interest(*texts: str) -> tuple[str, str]:
    """
    Args  : arbitrary chunks of user text (message, history, etc.)
    Return: (product_name, service_name) – one or both may be ""
    """
    corpus = " ".join(texts).lower()

    product  = _best_match(corpus, PRODUCT_KEYWORDS)
    service  = _best_match(corpus, SERVICE_KEYWORDS)

    # Rule: if a product is found we usually ignore service to avoid doubles
    if product:
        service = ""

    return product, service

# ---------------------------------------------------------------------------
# Demo helpers
# ---------------------------------------------------------------------------
def is_demo_request(text: str) -> bool:
    """True if user explicitly asks for/speaks about a demo or quick call."""
    return fuzzy_contains(text, DEMO_TRIGGERS)

def is_positive_response(text: str) -> bool:
    """True if user answers with a positive confirmation (yes/ok/… )."""
    return fuzzy_contains(text, POSITIVE_WORDS)
