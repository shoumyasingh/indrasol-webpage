# from services.pinecone_service import search_pinecone

# async def retrieve_context(user_query: str) -> str:
#     # You can add dynamic filters here if needed based on earlier agents
#     filters = {}  # Example: {"category": {"$in": ["SecureTrack", "BizRadar"]}}

#     matched_chunks = await search_pinecone(user_query, top_k=5, filters=filters)

#     if not matched_chunks:
#         return "No relevant context found."

#     return "\n\n".join(matched_chunks)