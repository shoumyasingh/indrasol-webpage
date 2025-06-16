from fastapi import APIRouter, HTTPException, BackgroundTasks
from config.logging import setup_logging
from models.request_models import ContactForm
from services.email_service import process_contact

setup_logging()


contact_router = APIRouter()


@contact_router.post("/contact", status_code=202)
async def submit_contact_form(bg: BackgroundTasks, form: ContactForm):
    """Accept the form and queue async email job."""
    bg.add_task(process_contact, form)
    return {"detail": "Message accepted – we’ll be in touch soon!"}