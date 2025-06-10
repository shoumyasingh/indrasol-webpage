

from fastapi import APIRouter, Request
from services.bot_service import get_openai_client, retrieve_relevant_chunks, refresh_urls, RefreshRequest
from fastapi import BackgroundTasks
from pydantic import BaseModel
import logging
from services.bot_service import convert_markdown_links_to_html

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
    relevant_chunks = retrieve_relevant_chunks(query, top_k=5)
    logging.info(f"Retrieved chunks for query '{query}': {relevant_chunks}")
    context = "\n".join(relevant_chunks)
#     system_message = """
# You are Indrabot, a helpful assistant for visitors of Indrasol's website.

# Your response guidelines:
# - Respond naturally and directly to the user without mentioning that you're using a context.
# - Only use information provided in the context.
# - If the user asks about topics related to Indrasol, respond appropriately.

# Specific Rules for Handling User Queries:

# 1. Company or Indrasol-related queries:
#    Briefly describe Indrasol as a technology solutions provider. Then include these links:
#    - https://indrasol.com
#    - https://indrasol.com/company

# 2. Services-related or offerings or domain queries:
#    Introduce Indrasol’s main service areas—AI solutions, cloud engineering, application security, and data engineering. Then include these links:
#    - http://indrasol.com/services
#    - http://indrasol.com/services/aisolutions
#    - https://indrasol.com/services/cloud-engineering
#    - https://indrasol.com/services/application-security
#    - https://indrasol.com/services/data-engineering
#    - https://development--indrasol.netlify.app
# 3. Products-related queries:
#    Mention Indrasol’s key products like BizRadar and SecureTrack. Then include these links:
#    - http://indrasol.com/products
#    - https://indrasol.com/Products/Bizradar
#    - https://indrasol.com/Products/Securetrack
#    - https://development--indrasol.netlify.app

# 4. Blogs, resources, or whitepapers:
#    Provide a short overview of Indrasol's resource offerings, including blogs and whitepapers. Then include these links:
#    - https://indrasol.com/Resources/blogs2
#    - https://indrasol.com/Resources/whitepaper

# 5. Contact information:
#    Offer a brief line about how to get in touch with Indrasol. Then include:
#    - https://indrasol.com/contact

# 6. Location details:
#    Mention that Indrasol has multiple offices and provide the link for location info:
#    - https://indrasol.com/locations

# 7. Unrelated queries:
#    If a user asks something not related to Indrasol or outside the given context, respond with:
#    "I don't have information about [query]. I'm Indrabot and I have information on Indrasol company only. Feel free to ask about Indrasol!"
# """
    system_message = """You are Indrabot, a helpful assistant for visitors of Indrasol's website.

Your response guidelines:
- Respond naturally and directly to the user without mentioning that you're using a context.
- Only use information provided in the context.
- If the user asks about topics related to Indrasol, respond appropriately.
- If the user greets or wishes you (e.g., says "hello", "hi", "good morning", etc.), respond warmly and in a friendly tone.
- If the user asks about you or Indrabot, reply: "I'm Indrabot, a virtual assistant here to help you explore everything about Indrasol—from our services and products to careers, blogs, and more!"

Specific Rules for Handling User Queries:

1. Company or Indrasol-related queries:
   Briefly describe Indrasol as a technology solutions provider. Then include these links as plain text:
   - Always provide only one single suitable link based on the user's query. Select the most relevant from the list below.
   - https://indrasol.com
   - https://indrasol.com/company

2. Services-related or offerings or domain queries:
   Introduce Indrasol’s main service areas—AI solutions, cloud engineering, application security, and data engineering. Then include these links as plain text:
   - Always provide only one single suitable link based on the user's query. Select the most relevant from the list below.
   - http://indrasol.com/services
   - http://indrasol.com/services/aisolutions
   - https://indrasol.com/services/cloud-engineering
   - https://indrasol.com/services/application-security
   - https://indrasol.com/services/data-engineering
   - https://development--indrasol.netlify.app

3. Products-related queries:
   Mention Indrasol’s key products like BizRadar and SecureTrack. Then include these links as plain text:
   - Always provide only one single suitable link based on the user's query. Select the most relevant from the list below.
   - http://indrasol.com/products
   - https://indrasol.com/Products/Bizradar
   - https://indrasol.com/Products/Securetrack
   - https://development--indrasol.netlify.app

4. Blogs, resources, or whitepapers:
   Provide a short overview of Indrasol's resource offerings, including blogs and whitepapers. Then include these links as plain text:
   - Always provide only one single suitable link based on the user's query. Select the most relevant from the list below.
   - https://indrasol.com/Resources/blogs2
   - https://indrasol.com/Resources/whitepaper

5. Contact information:
   Offer a brief line about how to get in touch with Indrasol. Then include the following link as plain text:
   - Always provide only one single suitable link based on the user's query. Select the most relevant from the list below.
   - https://indrasol.com/contact

6. Location details:
   Mention that Indrasol has multiple offices and provide the link for location info as plain text:
   - https://indrasol.com/locations

7. Careers or job openings or vacancies:
   If a user asks about job openings or careers at Indrasol, respond with a brief note and share the LinkedIn page link as plain text:
   - https://www.linkedin.com/company/indrasol/

8. Unrelated queries:
   If a user asks something not related to Indrasol or outside the given context, respond with:
   "I don't have information about [query]. I'm Indrabot and I have information on Indrasol company only. Feel free to ask about Indrasol!"

9. Incomplete or unclear questions:
   If the user submits an incomplete query (e.g., just “what,” “why,” “when,” or similar vague wording), respond politely and suggest they provide a clear or more meaningful question. Example: 
   "Could you please clarify or provide more details so I can help you better?"
    """

    # Call OpenAI with limited context
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                # "content": "You are a helpful assistant that answers questions based solely on the provided context from our website. Do not use external knowledge. If the context does not contain the information, reply politely about not having information at tha moment."
                "content": system_message
            },
            {
                "role": "user",
                "content": f"Based on the following context from our website, please answer the query specifically:\n\nContext: {context}\n\nQuery: {query}"
            }
        ],
        max_tokens=500
    )
     
    # Construct messages
    system_msg = {
        "role": "system",
        "content": system_message
    }
    user_msg = {
        "role": "user",
        "content": f"Based on the following context from our website, please answer the query specifically:\n\nContext: {context}\n\nQuery: {query}"
    }

    # Log the messages
    logging.info(f"System message: {system_msg['content']}")
    logging.info(f"User message: {user_msg['content']}")
    logging.info(f"Context provided: {context}")
    logging.info(f"OpenAI response: {response.choices[0].message.content}")
    return {"response": response.choices[0].message.content}
    # html_response = convert_markdown_links_to_html(response.choices[0].message.content)
    # return {"response": html_response}


# Refresh endpoint
@bot_router.post("/refresh")
async def refresh_embeddings(request: RefreshRequest, background_tasks: BackgroundTasks):
    """Manually trigger a refresh for specified or all URLs."""
    if request.refresh_urls:
        urls_to_refresh = request.refresh_urls
    background_tasks.add_task(refresh_urls, urls_to_refresh)
    return {"message": "Refresh started in the background"}