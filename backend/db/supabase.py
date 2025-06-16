from supabase import create_client, Client
from config.settings import SUPABASE_URL, SUPABASE_SERVICE_KEY
from fastapi import HTTPException
from functools import lru_cache
import asyncio
import httpx
from concurrent.futures import ThreadPoolExecutor
from config.logging import setup_logging
import logging

setup_logging()
# Global thread pool for running Supabase operations asynchronously
thread_pool = ThreadPoolExecutor()

# Initialize Supabase client
@lru_cache
def get_supabase_client():
    # http_client = httpx.Client()
    supbase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    return supbase

# Helper to run Supabase operations asynchronously
async def run_supabase_async(func):
    return await asyncio.get_event_loop().run_in_executor(
        thread_pool, func
    )

# Helper for safer Supabase operations with error handling
async def safe_supabase_operation(operation, error_message="Supabase operation failed"):
    try:
        return await run_supabase_async(operation)
    except Exception as e:
        logging.exception(f"{error_message}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"{error_message}: {str(e)}")

