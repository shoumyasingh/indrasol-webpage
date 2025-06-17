from fastapi import APIRouter, HTTPException, BackgroundTasks
from config.logging import setup_logging
from models.request_models import ContactForm
from services.email_service import process_contact
from services.teams_service import format_teams_message

setup_logging()


contact_router = APIRouter()


@contact_router.post("/email_contact", status_code=202)
async def submit_contact_form(bg: BackgroundTasks, form: ContactForm):
    """Accept the form and queue async email job."""
    bg.add_task(process_contact, form, is_bot=False)
    return {"detail": "Message accepted – we’ll be in touch soon!"}


@contact_router.post("/notify_teams", status_code=202)
async def notify_teams(bg: BackgroundTasks, form: ContactForm):
    """Accept the form and queue async email job."""
    bg.add_task(format_teams_message, form, is_bot=False)
    return {"detail": "Message accepted – we’ll be in touch soon!"}