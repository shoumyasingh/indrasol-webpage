from fastapi import APIRouter, Request
from services.bot_service import get_openai_client, retrieve_relevant_chunks, refresh_urls, RefreshRequest
from fastapi import BackgroundTasks
from pydantic import BaseModel
import logging

bot_router = APIRouter()

# Pydantic model for refresh request
class QueryRequest(BaseModel):
    query: str = ""

# FastAPI endpoint
@bot_router.post("/chat")
async def chat(request: QueryRequest):
    query = request.query

    client = get_openai_client()
    
    # Retrieve relevant content
    relevant_chunks = retrieve_relevant_chunks(query, top_k=3)
    logging.info(f"Retrieved chunks for query '{query}': {relevant_chunks}")
    context = "\n".join(relevant_chunks)
    
    # Call OpenAI with limited context
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant that answers questions based solely on the provided context from our website. Do not use external knowledge. If the context does not contain the information, reply politely about not having information at tha moment.'"
            },
            {
                "role": "user",
                "content": f"Based on the following context from our website, please answer the query specifically:\n\nContext: {context}\n\nQuery: {query}"
            }
        ],
        max_tokens=500
    )
    
    return {"response": response.choices[0].message.content}


# Refresh endpoint
@bot_router.post("/refresh")
async def refresh_embeddings(request: RefreshRequest, background_tasks: BackgroundTasks):
    """Manually trigger a refresh for specified or all URLs."""
    if request.refresh_urls:
        urls_to_refresh = request.refresh_urls
    background_tasks.add_task(refresh_urls, urls_to_refresh)
    return {"message": "Refresh started in the background"}