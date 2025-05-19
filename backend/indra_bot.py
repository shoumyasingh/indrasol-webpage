import requests
from bs4 import BeautifulSoup
from sentence_transformers import SentenceTransformer
import chromadb
import easyocr
from PIL import Image
import io
import numpy as np
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time
from urllib.parse import urljoin
import os
from openai import OpenAI
from dotenv import load_dotenv
import logging
import re
logging.basicConfig(level=logging.INFO)

# List of URLs to process
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

class WebContentProcessor:
    def __init__(self):
        """Initialize models, ChromaDB client, and EasyOCR reader."""
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.chroma_client = chromadb.Client()
        self.collection = self.chroma_client.get_or_create_collection(name="web_content")
        self.reader = easyocr.Reader(['en'])
        self.added_documents = set()  # Track added documents to avoid duplicates
         # Get the API key from the environment variable
        load_dotenv()
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("The OPENAI_API_KEY environment variable is not set. Please set it with your OpenAI API key.")
        self.openai_client = OpenAI(api_key=api_key)
    def extract_text_with_selenium(self, url):
        """Extract text from a webpage using Selenium and format as Markdown."""
        options = Options()
        options.add_argument('--headless')
        options.add_argument('--disable-gpu')
        options.add_argument('--no-sandbox')
        driver = webdriver.Chrome(options=options)
        try:
            driver.get(url)
            time.sleep(3)  # Allow JavaScript to load
            soup = BeautifulSoup(driver.page_source, 'html.parser')
            for tag in soup(['script', 'style']):
                tag.decompose()

            markdown_content = f"# Content from {url}\n\n"
            for element in soup.find_all(['h1', 'h2', 'h3', 'p', 'li']):
                text = element.get_text(strip=True)
                if not text:
                    continue
                if element.name in ['h1', 'h2', 'h3']:
                    level = int(element.name[1])
                    markdown_content += f"{'#' * level} {text}\n\n"
                elif element.name == 'p':
                    markdown_content += f"{text}\n\n"
                elif element.name == 'li':
                    markdown_content += f"- {text}\n"
            return markdown_content
        finally:
            driver.quit()

    def get_image_urls(self, url):
        """Retrieve image URLs from a webpage."""
        options = Options()
        options.add_argument("--headless")
        driver = webdriver.Chrome(options=options)
        try:
            driver.get(url)
            driver.implicitly_wait(5)
            soup = BeautifulSoup(driver.page_source, 'html.parser')
            img_urls = [
                urljoin(url, img.get('src'))
                for img in soup.find_all('img')
                if img.get('src') and any(img.get('src').lower().endswith(ext) for ext in ('.jpg', '.jpeg', '.png', '.webp'))
            ]
            return img_urls
        finally:
            driver.quit()

    def extract_text_from_image(self, image_url):
        """Extract text from an image using EasyOCR."""
        try:
            headers = {'User-Agent': 'Mozilla/5.0'}
            response = requests.get(image_url, headers=headers, timeout=10)
            response.raise_for_status()
            img = Image.open(io.BytesIO(response.content))
            img_array = np.array(img)
            result = self.reader.readtext(img_array, detail=0)
            return ' '.join(result).strip()
        except Exception as e:
            print(f"Error processing image {image_url}: {e}")
            return None

    def split_into_sections(self, content):
        """Split Markdown content into sections based on headers."""
        lines = content.splitlines()
        sections = []
        current_section = []
        for line in lines:
            if line.strip().startswith('#') and current_section:
                sections.append('\n'.join(current_section))
                current_section = [line]
            else:
                current_section.append(line)
        if current_section:
            sections.append('\n'.join(current_section))
        return [section for section in sections if section.strip()]

    def store_in_vector_db(self, content, url, chunk_id):
        """Store content sections in the vector database, avoiding duplicates."""
        sections = self.split_into_sections(content)
        for i, section in enumerate(sections):
            if section not in self.added_documents:
                embedding = self.model.encode([section], show_progress_bar=False)[0]
                self.collection.add(
                    documents=[section],
                    embeddings=[embedding.tolist()],
                    metadatas=[{"url": url, "section_id": f"{chunk_id}_{i}"}],
                    ids=[f"{chunk_id}_{i}"]
                )
                self.added_documents.add(section)

    def process_urls(self, urls, output_file='web_content.md'):
        """Process URLs, extract content once, and store in vector DB."""
        all_content = ""
        for i, url in enumerate(urls):
            print(f"Processing {url}...")
            page_content = self.extract_text_with_selenium(url)
            all_content += page_content

            image_urls = self.get_image_urls(url)
            image_texts = [text for img_url in image_urls if (text := self.extract_text_from_image(img_url))]
            if image_texts:
                image_section = f"## Image Text from {url}\n\n{' '.join(image_texts)}\n\n"
                all_content += image_section
            else:
                all_content += f"## Image Text from {url}\n\nNo text found in images.\n\n"

            self.store_in_vector_db(page_content + (image_section if image_texts else ""), url, f"chunk_{i}")

        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(all_content)
        print(f"Content saved to {output_file}")

    def query(self, query_text):
        # Generate embedding for the query
        query_embedding = self.model.encode([query_text])[0].tolist()
        
        # Retrieve top 3 relevant documents from the vector database
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=10
        )
        # logging.info(f"Query results: {results}")
        documents = results['documents'][0]
        
        # Combine documents into a context string
        context = "\n\n".join(documents)
        
        # Create a prompt for the OpenAI model
        prompt = f"""
You are an interactive assistant that answers only using the provided context with no external knowledge. Do not repeat or include the context in your response. Use a friendly conversational tone. Present answers clearly. Keep responses accurate relevant and limited to the context.

Context: {context}

User Question: {query_text}

Your Task: Respond strictly based on the context above.  

"""

        
        try:
            # Call the OpenAI API to generate a response
            response = self.openai_client.chat.completions.create(
                model="gpt-4.1",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": prompt}
                ]
            )
            # Extract and return the generated answer
            answer = response.choices[0].message.content
            return answer
        except Exception as e:
            raise RuntimeError(f"Error calling OpenAI API: {str(e)}")
    def _format_to_markdown(self, text, query_text):
        """Convert plain text response to Markdown format."""
        # Split the text into paragraphs (based on double newlines or single newlines)
        paragraphs = [p.strip() for p in re.split(r'\n\s*\n|\n', text) if p.strip()]
        
        # Initialize Markdown response with a heading
        markdown_response = f"## Response to Query: {query_text}\n\n"
        
        # Check if the response contains list-like patterns (e.g., starting with numbers or bullets)
        is_list = any(re.match(r'^\d+\. |^- |\* ', p) for p in paragraphs)
        
        if is_list:
            # Format as a list
            markdown_response += "\n".join(paragraphs) + "\n"
        else:
            # Format as paragraphs
            for paragraph in paragraphs:
                # If the paragraph looks like a heading (short and all-caps or title case), format as h3
                if len(paragraph.split()) < 10 and (paragraph.isupper() or paragraph.istitle()):
                    markdown_response += f"### {paragraph}\n\n"
                else:
                    markdown_response += f"{paragraph}\n\n"
        
        return markdown_response



def main():
    """Process URLs and handle user queries."""
    processor = WebContentProcessor()
    print("Extracting and storing data from URLs...")
    processor.process_urls(urls)
    print("\nData extraction complete. You can now query the content.")
    while True:
        query = input("\nEnter your query (or 'quit' to exit): ")
        if query.lower() == 'quit':
            print("Exiting...")
            break
        response = processor.query(query)
        print(f"Response: {response}")

if __name__ == "__main__":
    main()