# ── services/format_markdown.py ──────────────────────────────────────────
import regex as re
from typing import List
from config.highlight_terms import PRODUCTS, SERVICES, CLIENTS, LOCATIONS, URLS, TITLES

# ─────────────────────────────────────────────────────────────────────────
def _master_keywords() -> List[str]:
    """Return all highlight words, longest first (prevents sub-matches)."""
    pool = set(PRODUCTS + SERVICES + CLIENTS + LOCATIONS + TITLES + list(URLS.keys()))
    return sorted(pool, key=len, reverse=True)



# ── 1. bold keywords ────────────────────────────────────────────────────
def bold_keywords(text: str) -> str:
    for kw in _master_keywords():
        escaped_kw = re.escape(kw)
        # Only bold if not already bold or in a link
        pattern = rf"(?<!\*\*)\b({escaped_kw})\b(?!\*\*)"
        text = re.sub(pattern, r"**\1**", text, flags=re.I)
    return text




# ── 2. bold numbers / % / K ─────────────────────────────────────────────
def bold_stats(text: str) -> str:
    # Only bold numbers if not already bold
    return re.sub(r"(?<!\*\*)(\b\d[\d.,]*(?:\s?[Kk%])?)(?!\*\*)", r"**\1**", text)





# ── 3. Smart Bulletisation ───────────────────────────────────
_TRIGGER = r"(?:including|such as|like|across|within|in)\s+"

def _looks_like_list(parts):            # all items  ≤ 3 words, ≥ 3 items
    return len(parts) >= 3 and all(len(p.split()) <= 3 for p in parts)

def sentence_to_bullets(text: str) -> str:
    pat = re.compile(
        rf"(^|\n)([^.\n]*?{_TRIGGER})"            # lead-in with trigger
        rf"([^.\n]+?(?:,\s*[^.\n]+?){{2,}})"      # ≥ 3 comma items
        rf"(?:\.|—)",
        flags=re.I,
    )

    def repl(m):
        intro = m.group(2).strip()
        parts = [p.strip() for p in m.group(3).split(",")]
        if not _looks_like_list(parts):
            return m.group(0)                    # leave sentence untouched
        bullets = "\n".join(f"- {p}" for p in parts)
        return f"\n{intro}\n{bullets}\n"

    return pat.sub(repl, text,  count=1)         # first list onl
# def sentence_to_bullets(text: str) -> str:
#     """
#     Whenever a sentence contains TWO or more comma-separated items,
#     transform the items into markdown bullet points.
#     """
#     pat = re.compile(
#         r"(^|\n)([^:\n]{0,120}?:\s*)([^.\n,]+?,\s?[^.\n]+?(?:,\s?[^.\n]+?)+)(\.)",
#         flags=re.S,
#     )
#     def repl(m):
#         intro  = m.group(2).strip()
#         items  = [f"- {part.strip()}" for part in re.split(r",\s?", m.group(3))]
#         return f"\n\n{intro}\n" + "\n".join(items) + "\n"
#     return pat.sub(repl, text)




# ── 4. linkify keywords ──────────────────────────────────────────────────
def linkify_keywords(text: str) -> str:
    """Convert keywords to markdown links, handling both plain and bold keywords."""
    # Create a copy to work with
    result = text
    
    # Sort keywords by length (longest first) to avoid partial matches
    sorted_items = sorted(URLS.items(), key=lambda x: len(x[0]), reverse=True)
    
    for kw, url in sorted_items:
        # Skip if this keyword is already linked in the text
        if f"[{kw}](" in result.lower():
            continue
            
        escaped_kw = re.escape(kw)
        
        # Handle bold keywords: **keyword** -> **[keyword](url)**
        bold_pattern = rf"\*\*({escaped_kw})\*\*"
        if re.search(bold_pattern, result, flags=re.I):
            result = re.sub(bold_pattern, rf"**[\1]({url})**", result, flags=re.I, count=1)
            continue
        
        # Handle plain keywords: keyword -> [keyword](url)
        # Use strict word boundaries to avoid partial matches
        plain_pattern = rf"(?<!\w)({escaped_kw})(?!\w)"
        matches = list(re.finditer(plain_pattern, result, flags=re.I))
        
        for match in matches:
            start, end = match.span()
            # Check if this match is not inside existing markdown syntax
            before_text = result[:start]
            after_text = result[end:]
            
            # Skip if already inside a link or bold formatting
            if (before_text.endswith('[') or 
                before_text.endswith('**[') or
                '](' in after_text[:20]):
                continue
                
            # Replace this occurrence
            result = result[:start] + f"[{match.group(1)}]({url})" + result[end:]
            break  # Only replace first occurrence to avoid conflicts
    
    return result

# def linkify_keywords(text: str) -> str:
#     """Replace **Keyword** → **[Keyword](url)** preserving original case."""
#     for rx, url in _LINK_PATTERNS:
#         text = rx.sub(lambda m: f"**[{m.group(1)}]({url})**", text)
#     return text


# ── 5.  one-sentence-per-line  (bullets untouched) ──────────────────────
def sentence_newlines(text: str) -> str:
    out = []
    for line in text.splitlines():
        if line.lstrip().startswith("- "):
            out.append(line)
            continue
        out.append(
            re.sub(
                r"(?<!\w\.\w)(?<!\d\.\d)\.(\s+)(?=[A-Z])", ".\n", line
            )
        )
    return "\n".join(out)


# ── cleanup function ────────────────────────────────────────────────────
def cleanup_markdown(text: str) -> str:
    """Clean up any malformed markdown like double asterisks."""
    # Fix quadruple asterisks (****) -> double asterisks (**)
    text = re.sub(r"\*{4,}", "**", text)
    # Fix triple asterisks (***) -> double asterisks (**)
    text = re.sub(r"\*{3}", "**", text)
    return text

# ── public entry point ──────────────────────────────────────────────────
async def ensure_markdown(reply: str) -> str:
    reply = bold_keywords(reply)
    reply = bold_stats(reply)
    reply = sentence_to_bullets(reply)
    reply = linkify_keywords(reply)
    reply = sentence_newlines(reply)
    reply = cleanup_markdown(reply)  # Clean up any malformed markdown
    return reply
