import asyncio
from pinecone_service import query_pinecone


async def debug_sales():
    matches = await query_pinecone(
        query="cloud landing zones", 
        namespace="sales",
        filters={"category": {"$in": ["Cloud Engineering"]}},
        top_k=3
    )
    for m in matches:
        print(m["category"], m["type"], "→", m["text"][:80], "…")

asyncio.run(debug_sales())