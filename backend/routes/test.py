from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from services.bot_service import scrape_url
from services.bot_service import export_pinecone_to_markdown
from services.bot_service import delete_all_pinecone_data
router = APIRouter()

@router.post("/test")
def test_endpoint(url:str):
    data =  scrape_url(url)
    return JSONResponse(content={"message": "Test successful", "data": data})
@router.get("/retrieve_data")
def retrieve_data_endpoint():
    # Call the export function from bot_service
    export_pinecone_to_markdown()
    return JSONResponse(content={"message": "Data retrieval initiated"})
@router.delete("/delete_data")
def delete_data_endpoint():
    delete_all_pinecone_data()
    return JSONResponse(content={"message": "All Pinecone data deleted successfully"})