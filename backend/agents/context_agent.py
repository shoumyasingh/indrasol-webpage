from typing import Optional
from services.pinecone_service import query_pinecone

async def retrieve_context(user_query: str, target_category: Optional[str] = None):
    filters = {"category": {"$in": [target_category]}} if target_category else {}
    # Try website first
    matches = await query_pinecone(user_query, namespace="website", filters=filters)
    if not matches:
        matches = await query_pinecone(user_query, namespace="sales", filters=filters)
    return {"chunks": [m["text"] for m in matches], "meta": matches}
