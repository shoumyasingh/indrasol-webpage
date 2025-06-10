import os
import uuid
import pinecone
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")
pinecone.init(api_key=os.getenv("PINECONE_API_KEY"), environment=os.getenv("PINECONE_ENV"))

index = pinecone.Index(os.getenv("PINECONE_INDEX"))

def chunk_and_upload(docs: list):
    batch = []
    for doc in docs:
        embedding = openai.Embedding.create(input=[doc['text']], model="text-embedding-3-small")['data'][0]['embedding']
        batch.append({
            "id": str(uuid.uuid4()),
            "values": embedding,
            "metadata": doc
        })
    index.upsert(batch)

# Sample ingestion content
docs = [
    {"text": "SecureTrack enables 95% threat detection and saves 76% review time.", "category": "SecureTrack", "type": "benefit", "intent_stage": "consideration"},
    {"text": "BizRadar tracks over 2.5K+ contracts daily across 8 platforms.", "category": "BizRadar", "type": "stat", "intent_stage": "awareness"}
]

chunk_and_upload(docs)