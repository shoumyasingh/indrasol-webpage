from knowledge_base.blog_titles import BLOG_TITLES
from knowledge_base.whitepapers import WHITEPAPER_TITLES
# ── config/highlight_terms.py ────────────────────────────────────────────
"""
All keywords the formatter should bold or bullet-ize.
Add to these lists any time you add a new logo, city, product, etc.
"""
PRODUCTS = [
    "SecureTrack",
    "BizRadar",
]

SERVICES = [
    "AI Security",
    "Cloud Engineering",
    "Application Security",
    "Data Engineering",
]

CLIENTS = [
    #  ❱❱  copy-paste from the carousel you showed on the site
    "Meta", "Accuray", "Alorica", "TSTT", "Guardian Group",
    "Complete Genomics", "Palo Alto Networks", "Gigamon",
    "Cisco", "GAP", "Banana Republic", "Essex",
    "YuMe", "Planet", "SonicWall", "Charlotte Russe",
    "Alameda Health",
]

LOCATIONS = [
    "San Ramon",
    "San Ramon, CA",
    "Singapore, Singapore",
    "Hyderabad, India",
    "Mexico City, Mexico",
    "Singapore",
    "Hyderabad",
    "Mexico City"
]

URLS = {
    "bizradar":     "https://indrasol.com/Products/Bizradar",
    "securetrack":  "https://indrasol.com/Products/Securetrack",

    # ── services ────────────────────────────────────────────────────────
    "ai solutions":                    "https://indrasol.com/services/aisolutions",
    "ai solutions & security":         "https://indrasol.com/services/aisolutions",
    "cloud engineering & security":    "https://indrasol.com/services/cloud-engineering",
    "application security & compliance":"https://indrasol.com/services/application-security",
    "data engineering, analytics & security": "https://indrasol.com/services/data-engineering",

    # ── resource hubs ───────────────────────────────────────────────────
    "blogs":       "https://indrasol.com/Resources/blogs2",
    "blog":       "https://indrasol.com/Resources/blogs2",
    "whitepapers": "https://indrasol.com/Resources/whitepaper",
    "case studies": "https://indrasol.com/Resources/case-studies",
    "case study": "https://indrasol.com/Resources/case-studies",
}

import re

def _slug(t: str) -> str:
    """turn a title into kebab-case slug used by the site."""
    slug = re.sub(r"[^\w\s-]", "", t).lower()        # drop punctuation
    slug = re.sub(r"\s+", "-", slug).strip("-")      # spaces → dash
    return slug

try:
    from knowledge_base.blog_titles import BLOG_TITLES
    for title in BLOG_TITLES:
        URLS[title.lower()] = (
            "https://indrasol.com/Resources/blog/" + _slug(title)
        )
except ImportError:
    BLOG_TITLES = []

try:
    from knowledge_base.whitepapers import WHITEPAPER_TITLES
    for title in WHITEPAPER_TITLES:
        URLS[title.lower()] = (
            "https://indrasol.com/Resources/whitepaper/" + _slug(title)
        )
except ImportError:
    WHITEPAPER_TITLES = []

# expose the full-title lists so the formatter can bold them
TITLES = BLOG_TITLES + WHITEPAPER_TITLES