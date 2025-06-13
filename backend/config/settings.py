import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAIIND")
PINECONE_API_KEY = os.getenv("PINECONEIND")
SUPABASE_URL = os.getenv("SUPABASE_URL_IND")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY_IND")
SUPABASE_API_KEY = os.getenv("SUPABASE_API_KEY_IND")
FROM_EMAIL = os.getenv("FROM_EMAIL")
TO_EMAIL = os.getenv("TO_EMAIL")
SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
MAILERSEND_API_KEY = os.getenv("MAILERSEND_API_KEY")
MAILERSEND_API = os.getenv("MAILERSEND_API")
FROM_NAME = os.getenv("FROM_NAME")