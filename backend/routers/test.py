from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from knowledge_base.website_content import scrapped_website_content
from knowledge_base.sales_content import get_sales_content
from services.bot_service import export_pinecone_to_markdown
from services.bot_service import delete_all_pinecone_data
from agents.engagement_agent import run_engagement_agent
router = APIRouter()

@router.post("/website_content")
async def website_content_endpoint(url:str):
    data =  await scrapped_website_content(url)
    return JSONResponse(content={"message": "Test successful", "data": data})
@router.get("/sales_content")
def sales_content_endpoint():   
    # Call the function to get sales content
    sales_content = get_sales_content()
    return JSONResponse(content={"sales_content": sales_content})
@router.get("/retrieve_data")
def retrieve_data_endpoint():
    # Call the export function from bot_service
    export_pinecone_to_markdown()
    return JSONResponse(content={"message": "Data retrieval initiated"})
@router.delete("/delete_data")
def delete_data_endpoint():
    delete_all_pinecone_data()
    return JSONResponse(content={"message": "All Pinecone data deleted successfully"})
@router.post("/engagement")
async def engagement_endpoint(request: Request):
    data = await request.json()
    user_message = data.get("message", "")
    if not user_message:
        return JSONResponse(content={"error": "Message is required"}, status_code=400)
    
    response = await run_engagement_agent(user_message)
    return JSONResponse(content={"response": response})