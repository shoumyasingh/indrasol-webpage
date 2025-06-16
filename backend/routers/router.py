from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import logging
import re
# ────── request / response models ──────
from models.request_models import QueryRequest
from models.response_models import ChatResponse

# ────── helper services ──────
from services.objection_service import contains_objection          # async bool
from services.lead_service import detect_service, is_hot_lead      # async str / bool
from services.supabase_service import upsert_conversation_memory, sync_qualified_lead, get_conversation_memory, get_conversation_history


def build_updated_history(existing_history: list, user_query: str, bot_response: str) -> list:
    """
    Helper function to build updated history by adding the latest user query and bot response.
    
    Args:
        existing_history: Current history from request
        user_query: Latest user message
        bot_response: Latest bot response
        
    Returns:
        List of strings with User:/Bot: prefixes for storage
    """
    return existing_history + [f"User: {user_query}", f"Bot: {bot_response}"]


async def get_last_bot_messages(user_id: str, count: int = 2) -> list:
    """
    Fetch the last N bot messages from stored conversation history.
    
    Args:
        user_id: User ID to fetch history for
        count: Number of recent bot messages to return
        
    Returns:
        List of recent bot messages (newest first)
    """
    try:
        # Get structured history from Supabase
        structured_history = await get_conversation_history(user_id, as_strings=False)
        
        if not structured_history:
            return []
        
        # Extract bot messages from structured format, newest first
        bot_messages = []
        for conversation in reversed(structured_history):  # Start from newest
            if isinstance(conversation, dict) and conversation.get("bot"):
                bot_messages.append(conversation["bot"].lower())
                if len(bot_messages) >= count:
                    break
        
        return bot_messages
        
    except Exception as e:
        logging.error(f"Error fetching last bot messages: {e}")
        # Fallback: extract from current request history if Supabase fails
        fallback_messages = [
            l.lower() for l in reversed([msg for msg in [] if msg.lower().startswith("bot:")])
        ][:count]
        return fallback_messages
# ────── AI agents ──────
from agents.engagement_agent import run_engagement_agent
from agents.intent_agent import run_intent_agent
from agents.context_agent import retrieve_context
from agents.sales_agent import run_sales_agent
from agents.objection_agent import run_objection_agent
from agents.summary_agent import run_summary_agent
from agents.info_agent import run_info_agent
from agents.follow_up_agent import run_follow_up_agent
from services.factual_detector_service import is_pure_factual
import re
from config.logging import setup_logging
import logging
setup_logging()


message_router = APIRouter()





@message_router.post("/message", response_model=ChatResponse)
async def chat_controller(req: QueryRequest):
    try:
         # ========== 0. First message → Engagement ==========
        if not req.history and re.match(r"^\s*(hi|hello|hey|greetings|howdy|yo)\b", req.query, re.I):
            logging.info("Engagement Agent taking over")
            response = await run_engagement_agent(req.query)
            # logging.info(f"Engagement Agent response: {response}")
            if not response or not isinstance(response, str):
                raise HTTPException(status_code=500, detail="Engagement Agent failed to respond")
            
            # Build history for first message
            full_history = build_updated_history([], req.query, response)
            await upsert_conversation_memory(
                user_id=req.user_id,
                memory={
                    "intent": "Engagement",
                    "product": "",
                    "service": "",
                    "qualified": False,
                    "last_agent": "EngagementAgent"
                },
                history=full_history
            )
            return ChatResponse(response=response, routed_agent="engagement")

        # ========== 1. Objection shortcut ==========
        if await contains_objection(req.query):
            logging.info("Objection detected, routing to Objection Agent")
            summary = await run_summary_agent(req.history)
            response = await run_objection_agent(req.query, summary)
            logging.info(f"Objection Agent response: {response}")
            if not response or not isinstance(response, str):
                raise HTTPException(status_code=500, detail="Objection Agent returned invalid response")
                           # → persist memory (not yet qualified)
            full_history = build_updated_history(req.history, req.query, response)
            await upsert_conversation_memory(
                user_id=req.user_id,
                memory={
                    "intent": "Objection",
                    "product": "",
                    "service": "",
                    "qualified": False,
                    "last_agent": "ObjectionAgent"
                },
                history=full_history
            )
            return ChatResponse(response=response, routed_agent="objection")
        
        # =====================================================================
        # 1. DEMO-FLOW (follow-up agent) – Only for explicit demo requests and ongoing collections
        # =====================================================================
        try:
            memory_row = await get_conversation_memory(req.user_id) or {}
        except Exception as e:
            logging.error("Supabase memory fetch failed: %s", e)
            memory_row = {}
        logging.info(f"Req.query: {req.query}")
        logging.info(f"Memory last agent: {memory_row.get('last_agent')}")

        # → are we *already* mid-collection?
        in_demo_flow = (
            memory_row.get("last_agent") == "FollowUpAgent"
            and memory_row.get("demo_stage") == "collecting_info"
        )

        # fetch last bot messages to check if we're collecting info
        assistant_lines = await get_last_bot_messages(req.user_id, count=1)
        logging.info(f"Assistant lines: {assistant_lines}")

        bot_collecting_info = any(
            phrase in line
            for line in assistant_lines
            for phrase in (
                "your **name**", "email", "company",
                "goal", "pain-point", "challenge", "topic", "focus on"
            )
        )

                 # → did the *user* explicitly say they want a demo after CTA?
        cta_to_demo = (
            memory_row.get("last_agent") == "CTA" 
            and re.fullmatch(r"\s*(demo|book .*demo|schedule .*demo|yes|sure|ok|okay)\s*",
                 req.query, re.I)
        )

        # Check if bot offered a demo in the last message and user responded positively
        demo_offered_and_accepted = False
        if assistant_lines:
            last_bot_message = assistant_lines[0].lower()
            user_response = req.query.lower().strip()
            
            # Check if bot offered demo/call/meeting in last message
            bot_offered_demo = any(phrase in last_bot_message for phrase in [
                "live demo", "demo", "call", "meeting", "book", "schedule", 
                "speak to", "expert team", "would you like"
            ])
            
            # Check if user responded positively
            user_said_yes = user_response in [
                "yes", "sure", "absolutely", "definitely", "ok", "okay", 
                "yep", "yeah", "of course", "sounds good", "let's do it"
            ]
            
            demo_offered_and_accepted = bot_offered_demo and user_said_yes
            logging.info(f"Bot offered demo: {bot_offered_demo}, User said yes: {user_said_yes}")

        # Only trigger follow-up for very explicit demo requests or ongoing flows
        explicit_demo_request = (
            re.search(r"\b(book.*demo|schedule.*demo|demo.*booking|want.*demo|need.*demo)\b", req.query.lower()) or
            cta_to_demo or
            demo_offered_and_accepted
        )
        
        # Check if user is asking an unrelated question (not demo-related)
        is_demo_related_response = (
            # Simple name-like response (1-3 words, mostly letters)
            (len(req.query.split()) <= 3 and req.query.replace(" ", "").replace(".", "").isalpha()) or
            # Email pattern
            "@" in req.query or
            # Company name response (short business-like response)
            (len(req.query.split()) <= 4 and not req.query.lower().startswith(("what", "where", "how", "why", "when", "who", "tell", "show", "explain"))) or
            # Explicit demo-related keywords
            any(word in req.query.lower() for word in ["demo", "booking", "schedule", "call", "meeting"]) or
            # Short responses that could be answers to demo questions
            req.query.lower().strip() in ["yes", "sure", "ok", "okay", "no", "later", "skip", "next"]
        )
        
        # Check if user is asking a general question (not demo-related)
        is_general_question = (
            req.query.lower().startswith(("what", "where", "how", "why", "when", "who", "tell", "show", "explain", "can you", "do you")) or
            len(req.query.split()) > 5  # Long questions are usually general inquiries
        )
        
        logging.info(f"Explicit demo request: {explicit_demo_request}")
        logging.info(f"Demo offered and accepted: {demo_offered_and_accepted}")
        logging.info(f"In demo flow: {in_demo_flow}")
        logging.info(f"Bot collecting info: {bot_collecting_info}")
        logging.info(f"CTA to demo: {cta_to_demo}")
        logging.info(f"Is demo related response: {is_demo_related_response}")
        logging.info(f"Is general question: {is_general_question}")

        # Only enter follow-up agent if:
        # 1. Explicit demo request, OR
        # 2. In demo flow AND bot is collecting info AND user response is demo-related (not a general question)
        should_use_follow_up = (
            explicit_demo_request or 
            (in_demo_flow and bot_collecting_info and is_demo_related_response and not is_general_question)
        )
        
        if should_use_follow_up:
            logging.info("Follow-up Agent taking over")
            logging.info(f"Follow-up Agent req.query: {req.query}")
            full_history = "\n".join(req.history)
            fu = await run_follow_up_agent(
                user_message=req.query,
                context     ="demo booking",
                history     =full_history
            )

            full_history = build_updated_history(req.history, req.query, fu['reply'])
            await upsert_conversation_memory(
                user_id=req.user_id,
                memory = {
                    "intent": "Demo Booking",
                    "product": "",
                    "service": "",
                    "qualified": True,
                    "last_agent": "SalesAgent" if fu["finished"] else "FollowUpAgent",
                    "demo_stage": "completed" if fu["finished"] else "collecting_info"
                },
                history=full_history
            )
            if fu["finished"]:
                # Extract collected info for qualified lead sync
                collected_info = fu.get("collected_info", {})
                user_email = collected_info.get("email")
                user_message = collected_info.get("message", "")
                
                logging.info(f"Demo booking completed - Collected info: {collected_info}")
                
                # Detect product/service mentions from the conversation
                full_history_text = "\n".join(req.history).lower()
                user_message_lower = user_message.lower()
                
                # Check for product mentions
                product_name = ""
                if "securetrack" in full_history_text or "securetrack" in user_message_lower:
                    product_name = "SecureTrack"
                elif "bizradar" in full_history_text or "bizradar" in user_message_lower:
                    product_name = "BizRadar"
                
                # Check for service mentions
                service_name = ""
                if any(keyword in full_history_text for keyword in ["cloud", "security", "cloud security"]):
                    service_name = "Cloud Security"
                elif any(keyword in full_history_text for keyword in ["ai security", "artificial intelligence"]):
                    service_name = "AI Security"
                elif any(keyword in full_history_text for keyword in ["application security", "app security"]):
                    service_name = "Application Security"
                elif any(keyword in full_history_text for keyword in ["data engineering", "data"]):
                    service_name = "Data Engineering"
                elif "cloud" in full_history_text:
                    service_name = "Cloud Engineering"
                
                logging.info(f"Detected product: '{product_name}', service: '{service_name}'")
                
                await sync_qualified_lead({
                    "user_id": req.user_id,
                    "email": user_email,
                    "intent": "Demo Booking",
                    "product": product_name,
                    "service": service_name,
                    "qualified": True,
                    "last_message": req.query
                })

            return ChatResponse(
                response  = fu["reply"],
                intent    = "Demo Booking",
                routed_agent = "follow_up",
                suggested    = fu.get("suggested", [])
            )

        # Clear demo flow state if user asks general questions while in demo flow
        if in_demo_flow and is_general_question:
            logging.info("User asked general question while in demo flow - clearing demo state")
            await upsert_conversation_memory(
                user_id=req.user_id,
                memory={
                    "intent": "General Inquiry",
                    "product": "",
                    "service": "",
                    "qualified": False,
                    "last_agent": "InfoAgent",
                    "demo_stage": ""  # Clear demo stage
                },
                history=req.history  # Keep existing history
            )

        # ========== 2. Intent classification ==========
        conv_summary = await run_summary_agent(req.history)
        intent = await run_intent_agent(req.query, conv_summary)
        logging.info(f"Intent = {intent}")

        # --------- Cold ----------
        if intent == "Cold":
            logging.info("Cold intent detected, routing to Info Agent")
            quick_ctx = await retrieve_context(req.query)
            if quick_ctx["chunks"]:
                info_reply = await run_info_agent(req.query, quick_ctx["chunks"])
                logging.info(f"Info Agent response: {info_reply}")

                # Persist as Info Request (not qualified)
                full_history = build_updated_history(req.history, req.query, info_reply)
                await upsert_conversation_memory(
                    user_id=req.user_id,
                    memory={
                        "intent": "Info Request",
                        "qualified": False,
                        "last_agent": "InfoAgent"
                    },
                    history=full_history
                )
                return ChatResponse(
                    response=info_reply,
                    intent="Info Request",
                    routed_agent="info"
                )
            # Persist neutral response
            neutral_response = "Glad to help! Let me know what you're exploring — products, services, or just browsing."
            full_history = build_updated_history(req.history, req.query, neutral_response)
            await upsert_conversation_memory(
                user_id=req.user_id,
                memory={
                    "intent": "Cold",
                    "qualified": False,
                    "last_agent": "InfoAgent"
                },
                history=full_history
            )
            return ChatResponse(
                response=neutral_response,
                intent=intent,
                routed_agent="neutral"
            )
        
        # --------- Interested (Product / Service) ----------
        if intent in ("Interested in Product", "Interested in Services","Info Request"):
            logging.info("Interested intent detected, routing to Sales Agent / Info Agent")
            context  = await retrieve_context(req.query)
            if not context["chunks"]:
                logging.warning("No RAG context found.")
                # Persist neutral response when no context found
                neutral_response = "Tell me a bit more so I can point you to the right solution."
                full_history = build_updated_history(req.history, req.query, neutral_response)
                await upsert_conversation_memory(
                    user_id=req.user_id,
                    memory={
                        "intent": intent,
                        "qualified": False,
                        "last_agent": "InfoAgent"
                    },
                    history=full_history
                )
                return ChatResponse(
                    response=neutral_response,
                    intent=intent,
                    routed_agent="neutral"
                )

            # logging.info("Interested intent detected, routing to Sales Agent")

            context_txt = "\n\n".join(context["chunks"])
            # logging.info(f"Sales Agent context text: {context_txt}")
            reply = await run_sales_agent(req.query, context_txt, conv_summary)
            # logging.info(f"Sales Agent response: {reply}")

            # Detect product / service mentioned
            product_name  = ("SecureTrack" if "securetrack" in context_txt.lower()
                             else "BizRadar"  if "bizradar"   in context_txt.lower()
                             else "")
            service_name  = await detect_service(context_txt) or ""

            memory={
                    "intent": intent,
                    "product": product_name,
                    "service": service_name,
                    "qualified": intent != "Cold",
                    "last_agent": "SalesAgent"
                }
            logging.info(f"Sales Agent memory: {memory}")

            # ---------- Persist memory ----------
            full_history = build_updated_history(req.history, req.query, reply)
            await upsert_conversation_memory(
                user_id=req.user_id,
                memory=memory,
                history=full_history
            )

            # ---------- Push hot lead if intent escalates ----------
            if await is_hot_lead(intent):
                await sync_qualified_lead({
                    "user_id": req.user_id,
                    "email": None,                   # capture later
                    "intent": intent,
                    "product": product_name,
                    "service": service_name,
                    "qualified": True,
                    "last_message": req.query
                })

            return ChatResponse(response=reply, intent=intent, routed_agent="sales")

        # --------- Ready to engage (immediate CTA) ----------
        if intent == "Ready to engage":
            # Persist & push lead immediately
            cta_response = "Awesome! Would you like to book a demo or speak to our expert team directly?"
            full_history = build_updated_history(req.history, req.query, cta_response)
            await upsert_conversation_memory(
                user_id=req.user_id,
                memory={
                    "intent": intent,
                    "product": "",
                    "service": "",
                    "qualified": True,
                    "last_agent": "CTA"
                },
                history=full_history
            )
            await sync_qualified_lead({
                "user_id": req.user_id,
                "email": None,
                "intent": intent,
                "product": "",
                "service": "",
                "qualified": True,
                "last_message": req.query
            })

            return ChatResponse(
                response=cta_response,
                intent=intent,
                routed_agent="cta",
                suggested=["Book a demo", "Speak to expert", "Tell me more"]
            )

        # --------- Fallback ----------
        fallback_response = "I'm here to help, but need a bit more detail. Could you tell me what you're looking for?"
        full_history = build_updated_history(req.history, req.query, fallback_response)
        await upsert_conversation_memory(
            user_id=req.user_id,
            memory={
                "intent": "Unknown",
                "qualified": False,
                "last_agent": "FallbackAgent"
            },
            history=full_history
        )
        return ChatResponse(
            response=fallback_response,
            routed_agent="fallback"
        )

    except Exception as e:
        logging.exception("Chat controller crashed")
        raise HTTPException(status_code=500, detail=str(e))