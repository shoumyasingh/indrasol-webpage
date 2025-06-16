from fastapi import FastAPI, Request
from openai import OpenAI
from pinecone import Pinecone, ServerlessSpec
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
# from config.settings import PINECONE_API_KEY, OPENAI_API_KEY
from knowledge_base.website_content import scrapped_website_content,get_urls
from knowledge_base.sales_content import get_sales_content
import logging
import os
import json
import hashlib
from pydantic import BaseModel
import time
from services.pinecone_service import store_documents

app = FastAPI()


OPENAI_API_KEY = os.getenv("OPENAIIND")
PINECONE_API_KEY = os.getenv("PINECONEIND")

openai_client = OpenAI(api_key=OPENAI_API_KEY)
# Initialize Pinecone (replace with your API key and index name)
pc = Pinecone(api_key=PINECONE_API_KEY)
index_name = "indrasol-website-content"
if index_name not in pc.list_indexes().names():
        pc.create_index(
            name=index_name, 
            dimension=1536, 
            metric='cosine',
            spec=ServerlessSpec(
                cloud='aws',
                region='us-east-1'
            )
        )
index = pc.Index(index_name)

hashes = {}


# Initialize OpenAI
def get_openai_client():
    return openai_client

def get_pinecone_index():
    return index

# Split content into smaller chunks
async def split_content(content, chunk_size=500):
    if not content:
        logging.warning("No content to split")
        return []
    words = content.split()
    final_chunks = []
    current_chunk = []
    current_length = 0
    for word in words:
        word_length = len(word) + 1
        if current_length + word_length > chunk_size and current_chunk:
            final_chunks.append(" ".join(current_chunk))
            current_chunk = [word]
            current_length = word_length
        else:
            current_chunk.append(word)
            current_length += word_length
    if current_chunk:
        final_chunks.append(" ".join(current_chunk))
    logging.info(f"Split content into {len(final_chunks)} chunks")
    return [chunk.strip() for chunk in final_chunks if chunk.strip()]

# Create embeddings using OpenAI
async def create_embedding(text):
    client = get_openai_client()
    response =  client.embeddings.create(input=text, model="text-embedding-ada-002")
    return response.data[0].embedding


# Compute hash of content
def compute_hash(content):
    """Compute a SHA-256 hash of the content."""
    return hashlib.sha256(content.encode('utf-8')).hexdigest()

# Load hashes from file
def load_hashes():
    """Load stored hashes from hashes.json."""
    if os.path.exists('hashes.json'):
        with open('hashes.json', 'r') as f:
            logging.info("Loading hashes from file")
            return json.load(f)
    logging.info("No hashes file found, starting with empty hashes")
    return {}

# Save hashes to file
def save_hashes():
    """Save the current hashes to hashes.json."""
    with open('hashes.json', 'w') as f:
        json.dump(hashes, f)

# Modified store_embeddings
async def store_embeddings(chunks: list[str], namespace: str, source_id: str):
    """
    Stores a list of text chunks as vector embeddings in Pinecone under a given namespace.
    
    Args:
        chunks (list[str]): The text chunks to embed and store.
        namespace (str): Pinecone namespace (e.g., "website", "sales").
        source_id (str): A unique identifier for the source (URL, title, etc.).
    """
    for i, chunk in enumerate(chunks):
        try:
            embedding = await create_embedding(chunk)
            vector_id = f"{source_id.replace('/', '_')}_{i}"
            index.upsert(
                vectors=[{
                    "id": vector_id,
                    "values": embedding,
                    "metadata": {
                        "text": chunk,
                        "source": source_id
                    }
                }],
                namespace=namespace
            )
            logging.info(f"Upserted vector {vector_id} in namespace '{namespace}'")
        except Exception as e:
            logging.error(f"Failed to upsert vector for {source_id}, chunk {i}: {e}")


def split_overlap(text: str, size: int = 400, overlap: int = 50):
    words = text.split()
    for start in range(0, len(words), size - overlap):
        yield " ".join(words[start:start + size])


# Website content initialization
async def initialize_website_content():
    urls = get_urls()
    for url in urls:
        content = await scrapped_website_content(url)
        chunks  = list(split_overlap(content))
        await store_documents(
                chunks=chunks,
                namespace="website",
                source_id=url,
                category="Website"
            )
        hashes[url] = compute_hash(content)
    save_hashes()

#  Sales content initialization
async def initialize_sales_content():
    sales_items = await get_sales_content()
    for item in sales_items:
        chunks = list(split_overlap(item["content"]))
        await store_documents(
            chunks=chunks,
            namespace="sales",
            source_id=item["title"],
            category=item["title"],   # e.g., Cloud Engineering
            doc_type="benefit"
        )

def check_index_stats():
    stats = index.describe_index_stats()
    logging.info(f"Pinecone index stats: {stats}")

# Refresh embeddings for a single URL
async def refresh_url(url: str, content: str | None = None):
    """Refresh Pinecone embeddings for a given URL.

    Args:
        url (str): The page URL.
        content (str | None): Pre-fetched page content. If ``None`` the URL will be scraped internally.
    """
    # Fetch latest content if not provided
    if content is None:
        content = await scrapped_website_content(url)

    # Guard against empty scrape results
    if not content:
        logging.warning(f"No content found for {url}. Skipping refresh.")
        return

    index = get_pinecone_index()

    # ----- Chunk + embed -----
    try:
        chunks: list[str] = await split_content(content)
    except TypeError:
        # Fallback if split_content still returns coroutine when forgotten to await elsewhere
        chunks = await split_content(content)

    if not chunks:
        logging.warning(f"No chunks generated for {url}. Skipping refresh.")
        return

    stats = index.describe_index_stats()
    dimension = stats.get("dimension", 1536)

    new_vectors = []
    for i, chunk in enumerate(chunks):
        embedding = await create_embedding(chunk)
        vector_id = f"{url.replace('/', '_')}_{i}"
        new_vectors.append({
            "id": vector_id,
            "values": embedding,
            "metadata": {"text": chunk, "url": url}
        })

    # Delete existing vectors for this URL
    dummy_vector = [0] * dimension
    results = index.query(
        vector=dummy_vector,
        top_k=10000,
        filter={"url": url},
        include_values=False,
        include_metadata=False
    )
    existing_ids = [match["id"] for match in results["matches"]]
    if existing_ids:
        index.delete(ids=existing_ids)
    
    # Upsert new vectors
    index.upsert(vectors=new_vectors, namespace="website")
    
    # Update hash
    hash_value = compute_hash(content)
    hashes[url] = hash_value
    save_hashes()

# Check for updates periodically
async def check_for_updates():
    """Periodically check for content changes and refresh embeddings."""
    urls = get_urls()
    for url in urls:
        try:
            content = await scrapped_website_content(url)
            new_hash = compute_hash(content)
            if new_hash != hashes.get(url):
                logging.info(f"Change detected for {url}, refreshing...")
                await refresh_url(url, content)
            else:
                logging.info(f"No change for {url}")
        except Exception as e:
            logging.error(f"Failed to check {url}: {e}")

# Refresh multiple URLs
async def refresh_urls(urls_to_refresh: list[str]):
    for url in urls_to_refresh:
        logging.info(f"Refreshing {url}")
        await refresh_url(url)
        logging.info(f"Finished refreshing {url}")

# Pydantic model for refresh request
class RefreshRequest(BaseModel):
    refresh_urls: list[str] = []

# Retrieve relevant chunks from Pinecone
async def retrieve_relevant_chunks(query, top_k=5):
    index = get_pinecone_index()
    query_embedding = await create_embedding(query)
    results = index.query(vector=query_embedding, top_k=top_k, include_metadata=True)
    return [match["metadata"]["text"] for match in results["matches"]]

def export_pinecone_to_markdown(output_file="pinecone_content.md"):
    try:
        index = get_pinecone_index()
        stats = index.describe_index_stats()
        logging.info(f"Exporting Pinecone data (vectors: {stats.get('total_vector_count', 'N/A')})")

        all_texts_by_url = {}

        # You'll need to paginate through all items in Pinecone (simulate with a dummy vector if needed)
        dummy_vector = [0.0] * stats['dimension']
        results = index.query(
            vector=dummy_vector,
            top_k=10000,
            include_metadata=True
        )

        for match in results.get("matches", []):
            metadata = match.get("metadata", {})
            text = metadata.get("text", "")
            url = metadata.get("url", "unknown-url")
            if url not in all_texts_by_url:
                all_texts_by_url[url] = []
            all_texts_by_url[url].append(text)

        # Write to markdown
        with open(output_file, "w", encoding="utf-8") as f:
            for url, chunks in all_texts_by_url.items():
                f.write(f"# Content from: {url}\n\n")
                for chunk in chunks:
                    f.write(f"{chunk}\n\n---\n\n")
        logging.info(f"Markdown file '{output_file}' created successfully.")

    except Exception as e:
        logging.error(f"Failed to export Pinecone data to markdown: {e}")
def delete_all_pinecone_data():
    """
    Deletes all vectors from the Pinecone index.
    WARNING: This operation is irreversible.
    """
    try:
        index = get_pinecone_index()
        logging.info("Deleting all vectors from Pinecone index...")
        
        # Delete all vectors using delete with delete_all=True
        index.delete(delete_all=True)
        
        logging.info("All vectors deleted from Pinecone index successfully.")
    except Exception as e:
        logging.error(f"Failed to delete vectors from Pinecone: {e}")
import re

def convert_markdown_links_to_html(text):
    pattern = r"\[([^\]]+)\]\(([^)]+)\)"
    return re.sub(pattern, r'<a href="\2" target="_blank" style="color: blue;">\1</a>', text)

   
