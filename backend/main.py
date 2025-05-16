from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import threading
# from utils.extract_text_frm_img import get_image_urls, extract_text_from_image
# from utils.extract_text_from_link import extract_text_with_selenium
# from utils.extract_hyperlinks import extract_indrasol_links
from utils.indra_bot import WebContentProcessor

app = FastAPI()

# CORS config - change allow_origins in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # e.g., ["https://your-frontend.com"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# List of URLs to process on startup
urls = [
    "https://indrasol.com/",
    "http://indrasol.com/services/aisolutions",
    "https://indrasol.com/services/cloud-engineering",
    "https://indrasol.com/services/application-security",
    "https://indrasol.com/services/data-engineering",
    "https://indrasol.com/Products/Bizradar",
    "https://indrasol.com/Products/Securetrack",
    "https://indrasol.com/Resources/blogs2",
    "https://indrasol.com/Resources/whitepaper"
]

# Global bot instance
bot = WebContentProcessor()

# Flag to ensure processing runs only once
startup_ran = False

@app.on_event("startup")
async def startup_event():
    global startup_ran
    if not startup_ran:
        print("Starting URL processing in a separate thread...")
        thread = threading.Thread(target=bot.process_urls, args=(urls,))
        thread.start()
        startup_ran = True
        print("URL processing thread started.")

@app.get("/extract/query")
async def query_bot(text: str = Query(..., description="Query text for IndraBot")):
    if not text.strip():
        raise HTTPException(status_code=400, detail="Missing 'text' parameter")

    try:
        response = bot.query(text)
        return {"response": response}
    except Exception as e:
        print(f"Error in /extract/query: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
