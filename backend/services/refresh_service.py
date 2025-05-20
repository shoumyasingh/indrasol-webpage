
from services.bot_service import get_pinecone_index, scrape_url, split_content, create_embedding
from pydantic import BaseModel
import logging

# Refresh a single URL's embeddings
def refresh_url(url):
    # Get index dimension
    index = get_pinecone_index()
    stats = index.describe_index_stats()
    dimension = stats["dimension"]
    
    # Scrape and process new content
    content = scrape_url(url)
    chunks = split_content(content)
    
    # Generate new embeddings
    new_vectors = []
    for i, chunk in enumerate(chunks):
        embedding = create_embedding(chunk)
        vector_id = f"{url.replace('/', '_')}_{i}"
        new_vectors.append((vector_id, embedding, {"text": chunk, "url": url}))
    
    # Query and delete existing vectors for this URL
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
    
    # Insert new vectors
    index.upsert(new_vectors)

# Refresh multiple URLs
def refresh_urls(urls_to_refresh):
    for url in urls_to_refresh:
        logging.info(f"Refreshing {url}")
        refresh_url(url)
        logging.info(f"Finished refreshing {url}")

# Pydantic model for refresh request
class RefreshRequest(BaseModel):
    refresh_urls: list[str] = []