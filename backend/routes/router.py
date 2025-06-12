from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import logging

# ────── request / response models ──────
from models.request_models import QueryRequest
from models.response_models import ChatResponse

# ────── helper services ──────
from services.objection_service import contains_objection          # async bool
from services.lead_service import detect_service, is_hot_lead      # async str / bool
from services.supabase_service import upsert_conversation_memory, sync_qualified_lead
# ────── AI agents ──────
from agents.engagement_agent import run_engagement_agent
from agents.intent_agent import run_intent_agent
from agents.context_agent import retrieve_context
from agents.sales_agent import run_sales_agent
from agents.objection_agent import run_objection_agent
from agents.summary_agent import run_summary_agent
from agents.info_agent import run_info_agent
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
        if not req.history:
            logging.info("Engagement Agent taking over")
            response = await run_engagement_agent(req.query)
            logging.info(f"Engagement Agent response: {response}")
            if not response or not isinstance(response, str):
                raise HTTPException(status_code=500, detail="Engagement Agent failed to respond")
            return ChatResponse(response=response, routed_agent="engagement")
        
        if len(req.history) == 1 and "User:" in req.history[0] and "Bot:" not in req.history[0]:
            logging.info("Engagement Agent taking over")
            response = await run_engagement_agent(req.history[0])
            logging.info(f"Engagement Agent response: {response}")
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
            await upsert_conversation_memory(
                user_id=req.user_id,
                memory={
                    "intent": "Objection",
                    "product": "",
                    "service": "",
                    "qualified": False,
                    "last_agent": "ObjectionAgent"
                }
            )
            return ChatResponse(response=response, routed_agent="objection")

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
                await upsert_conversation_memory(
                    user_id=req.user_id,
                    memory={
                        "intent": "Info Request",
                        "qualified": False,
                        "last_agent": "InfoAgent"
                    }
                )
                return ChatResponse(
                    response=info_reply,
                    intent="Info Request",
                    routed_agent="info"
                )
            return ChatResponse(
                response="Glad to help! Let me know what you’re exploring — products, services, or just browsing.",
                intent=intent,
                routed_agent="neutral"
            )
        
        # --------- Info Request ----------
        # if intent == "Info Request":
        #     ctx = await retrieve_context(req.query)
        #     info_reply = await run_info_agent(req.query, ctx["chunks"]) \
        #                 if ctx["chunks"] else "Let me confirm that for you."
        #     return ChatResponse(response=info_reply, intent=intent, routed_agent="info")


        # --------- Interested (Product / Service) ----------
        if intent in ("Interested in Product", "Interested in Services","Info Request"):
            logging.info("Interested intent detected, routing to Sales Agent / Info Agent")
            context  = await retrieve_context(req.query)
            if not context["chunks"]:
                logging.warning("No RAG context found.")
                return ChatResponse(
                    response="Tell me a bit more so I can point you to the right solution.",
                    intent=intent,
                    routed_agent="neutral"
                )
            # if await is_pure_factual(req.query):
            #     logging.info("Info Agent taking over as this is a pure factual question")
            #     logging.info(f"Info Agent context: {context}")
            #     reply = await run_info_agent(req.query, context["chunks"])
            #     logging.info(f"Info Agent response: {reply}")
            #     return ChatResponse(response=reply, intent="Info Request", routed_agent="info")
            logging.info("Interested intent detected, routing to Sales Agent")

            context_txt = "\n\n".join(context["chunks"])
            logging.info(f"Sales Agent context text: {context_txt}")
            reply = await run_sales_agent(req.query, context_txt, conv_summary)
            logging.info(f"Sales Agent response: {reply}")

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
            await upsert_conversation_memory(
                user_id=req.user_id,
                memory=memory
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
            await upsert_conversation_memory(
                user_id=req.user_id,
                memory={
                    "intent": intent,
                    "product": "",
                    "service": "",
                    "qualified": True,
                    "last_agent": "CTA"
                }
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
                response="Awesome! Would you like to book a demo or speak to our expert team directly?",
                intent=intent,
                routed_agent="cta"
            )

        # --------- Fallback ----------
        return ChatResponse(
            response="I'm here to help, but need a bit more detail. Could you tell me what you're looking for?",
            routed_agent="fallback"
        )

    except Exception as e:
        logging.exception("Chat controller crashed")
        raise HTTPException(status_code=500, detail=str(e))