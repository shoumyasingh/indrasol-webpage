from pydantic import BaseModel, EmailStr
from typing import List, Optional, Union


# Chat Request Model
class QueryRequest(BaseModel):
    user_id: str
    query: str
    history: Optional[List[str]] = []

class ChatRequest(BaseModel):
    user_id: str | None = None
    text: str

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    company: Optional[str] = None
    message: str