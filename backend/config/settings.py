import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAIIND")
PINECONE_API_KEY = os.getenv("PINECONEIND")
