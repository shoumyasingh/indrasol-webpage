# import os
# import pinecone
# import openai
# from config.settings import OPENAI_API_KEY, PINECONE_API_KEY

# openai.api_key = OPENAI_API_KEY
# pinecone.init(api_key=PINECONE_API_KEY, environment=os.getenv("PINECONE_ENV"))

# index = pinecone.Index(os.getenv("PINECONE_INDEX"))

# async def embed_text(text: str) -> list:
#     response = openai.Embedding.create(
#         input=[text],
#         model="text-embedding-3-small"
#     )
#     return response['data'][0]['embedding']

# async def search_pinecone(query: str, top_k: int = 5, filters: dict = None) -> list:
#     vector = await embed_text(query)

#     results = index.query(
#         vector=vector,
#         top_k=top_k,
#         include_metadata=True,
#         filter=filters or {}
#     )

#     chunks = []
#     for match in results.matches:
#         chunks.append(match.metadata.get("text") or "")
#     return chunks
