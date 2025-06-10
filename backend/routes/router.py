from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

from agents.engagement_agent import run_engagement_agent
from agents.intent_agent import run_intent_agent
#from agents.context_agent import retrieve_context
from agents.sales_agent import run_sales_agent
from agents.objection_agent import run_objection_agent
import re

router = APIRouter()

# Chat Request Model
class ChatRequest(BaseModel):
    user_id: str
    message: str
    history: List[str] = []

# Chat Response
class ChatResponse(BaseModel):
    response: str
    intent: str = ""
    routed_agent: str = ""


OBJECTION_KEYWORDS = [
    "expensive", "cost", "price", "budget",
    "complex", "difficult", "hard to set up",
    "secure", "compliance", "risk",
    "already use", "have another tool"
]

def contains_objection(text: str) -> bool:
    pattern = r"|".join([re.escape(k) for k in OBJECTION_KEYWORDS])
    return re.search(pattern, text.lower()) is not None

@router.post("/message", response_model=ChatResponse)
async def chat_controller(req: ChatRequest):
    try:
        # 1. If no history → run Engagement Agent
        if len(req.history) == 0:
            response = await run_engagement_agent(req.message)
            return ChatResponse(response=response, routed_agent="engagement")

        # Objection Check
        if contains_objection(req.message):
            response = await run_objection_agent(req.message)
            return ChatResponse(response=response, routed_agent="objection")

        # 2. Classify intent
        intent = await run_intent_agent(req.message, req.history)

        if intent == "Cold":
            return ChatResponse(
                response="Glad to help! Let me know what you’re exploring — products, services, or just browsing.",
                intent=intent,
                routed_agent="neutral"
            )

        elif intent == "Interested in Product" or intent == "Interested in Services":
            # 3. Retrieve RAG context
            context = await retrieve_context(req.message)

            # 4. Run Sales Agent with context
            response = await run_sales_agent(req.message, context)
            return ChatResponse(response=response, intent=intent, routed_agent="sales")

        elif intent == "Ready to engage":
            return ChatResponse(
                response="Awesome! Would you like to book a demo or speak to our expert team directly?",
                intent=intent,
                routed_agent="cta"
            )

        else:
            return ChatResponse(response="Let me guide you to the right solution!", routed_agent="fallback")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
