

from typing import Optional

SERVICE_KEYWORDS = {
    "AI Security": ["ai security", "genai", "llm security", "aispm"],
    "Cloud Engineering": ["cloud engineering", "cspm", "cloud-native", "aws", "gcp", "azure"],
    "Application Security": ["application security", "appsec", "penetration testing", "sast"],
    "Data Engineering": ["data engineering", "etl", "snowflake", "databricks"]
}

async def detect_service(text: str) -> Optional[str]:
    """
    Returns the service pillar name if keywords found, else None.
    """
    lower = text.lower()
    for service, keywords in SERVICE_KEYWORDS.items():
        if any(k in lower for k in keywords):
            return service
    return None

async def is_hot_lead(intent: str) -> bool:
    return intent in ("Ready to engage", "Ready to schedule a demo")  