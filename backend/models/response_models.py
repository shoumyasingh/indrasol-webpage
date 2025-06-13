from pydantic import BaseModel

# Chat Response
class ChatResponse(BaseModel):
    response: str
    intent: str = ""
    routed_agent: str = ""
