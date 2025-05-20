from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import threading
# from indra_bot import WebContentProcessor
from routes_register import router as api_router
from contextlib import asynccontextmanager
from services.bot_service import initialize_pinecone, get_pinecone_index, load_hashes, check_for_updates, get_urls, check_index_stats
import pinecone
# from backend.config.settings import PINECONE_API_KEY
from apscheduler.schedulers.background import BackgroundScheduler   
import logging
from fastapi.responses import Response
# from backend.config.settings import PINECONE_API_KEY, OPENAI_API_KEY


logging.basicConfig(level=logging.INFO)

# Define lifespan manager first
@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        global hashes
        hashes = load_hashes()
        index = get_pinecone_index()
        stats = index.describe_index_stats()
        logging.info(f"Vector count : {stats['total_vector_count']}")
        if stats["total_vector_count"] == 0:
            logging.info("Initializing pinecone")
            initialize_pinecone()
        scheduler = BackgroundScheduler()
        scheduler.add_job(check_for_updates, 'interval', seconds=86400)  # Every day
        scheduler.start()
        app.state.scheduler = scheduler  # Prevent garbage collection
        yield
    except Exception as e:
        logging.error(f"Error during lifespan startup: {e}")
        raise  # Re-raise if you want the app to fail on startup errors
    finally:
        # Cleanup resources in finally block to ensure they run even on errors
        if hasattr(app.state, 'scheduler'):
            app.state.scheduler.shutdown()
        pass

# Create the FastAPI app once
app = FastAPI(
    title="IndraSol Web Service",
    description="A web service for IndraSol",
    version="1.0.0",
    lifespan=lifespan
)

# Allow frontend origins
origins = [
    # "http://localhost:8081",
    "http://localhost:8080",
    # "http://127.0.0.1:8081",
    "http://127.0.0.1:8080",
    "http://127.0.0.1:8080/",
    "http://localhost:3000",  # React default port
    "http://127.0.0.1:3000",
    "http://localhost:5173",  # Vite default port
    "http://127.0.0.1:5173",
    "https://indrasol.com",
    "https://development--indrasol.netlify.app",
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows specific origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Custom middleware to handle OPTIONS requests
async def custom_cors_middleware(request: Request, call_next):
    if request.method == "OPTIONS":
        response = Response(status_code=200)
        origin = request.headers.get("origin")
        if origin in origins:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"  # Specify methods or use "*"
            response.headers["Access-Control-Allow-Headers"] = "content-type"  # Match requested headers or use "*"
            response.headers["Access-Control-Allow-Credentials"] = "true"
        return response
    
    # Process non-OPTIONS requests normally
    response = await call_next(request)
    origin = request.headers.get("origin")
    if origin in origins:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

# Apply the custom middleware
app.middleware("http")(custom_cors_middleware)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logging.info(f"Request: {request.method} {request.url} Origin: {request.headers.get('origin')}")
    response = await call_next(request)
    return response

# Global bot instance
# bot = WebContentProcessor()

# Flag to ensure processing runs only once
# startup_ran = False

# List of URLs to process on startup
urls = get_urls()

# Include API router
app.include_router(api_router, prefix="/v1/routes")

# @app.on_event("startup")
# async def startup_event():
#     global startup_ran
#     if not startup_ran:
#         print("Starting URL processing in a separate thread...")
#         thread = threading.Thread(target=bot.process_urls, args=(urls,))
#         thread.start()
#         startup_ran = True
#         print("URL processing thread started.")

# @app.get("/extract/query")
# async def query_bot(text: str = Query(..., description="Query text for IndraBot")):
#     if not text.strip():
#         raise HTTPException(status_code=400, detail="Missing 'text' parameter")

#     try:
#         response = bot.query(text)
#         return {"response": response}
#     except Exception as e:
#         print(f"Error in /extract/query: {e}")
#         raise HTTPException(status_code=500, detail="Internal server error")
