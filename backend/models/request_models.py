from pydantic import BaseModel, EmailStr
from typing import List, Optional


# Chat Request Model
class QueryRequest(BaseModel):
    user_id: str
    query: str
    history: Optional[List[str]] = []


class ContactForm(BaseModel):
    name: str
    email: EmailStr
    company: str | None = None
    message: str