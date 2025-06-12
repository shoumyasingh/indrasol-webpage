import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAIIND")
PINECONE_API_KEY = os.getenv("PINECONEIND")
SUPABASE_URL = os.getenv("SUPABASE_URL_IND")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY_IND")
SUPABASE_API_KEY = os.getenv("SUPABASE_API_KEY_IND")