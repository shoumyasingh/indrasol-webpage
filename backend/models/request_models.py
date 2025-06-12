from pydantic import BaseModel
from typing import List, Optional


# Chat Request Model
class QueryRequest(BaseModel):
    user_id: str
    query: str
    history: Optional[List[str]] = []