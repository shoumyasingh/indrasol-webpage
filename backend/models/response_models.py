from pydantic import BaseModel
from typing import Optional, List

# Chat Response
class ChatResponse(BaseModel):
    response: str
    intent: str = ""
    routed_agent: str = ""
    suggested: Optional[List[str]] = None
    action: Optional[str] = None

# class ChatResponse(BaseModel):
#     turn_id:      str
#     text:         str
#     routed_skill: str
#     finished:     bool
#     suggested:    list[str] = []
#     latency_ms:   int
#     error:        str | None = None
#     meta:         dict = {}