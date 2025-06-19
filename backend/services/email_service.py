from models.request_models import ContactForm
from services.openai_service import run_openai_prompt
from config.settings import FROM_EMAIL, TO_EMAIL, MAILERSEND_API_KEY, FROM_NAME
import logging
from pydantic import EmailStr
import logging, html2text
from mailersend import emails
import re

# Create the client once – internal httpx session is re-used
_mailer = emails.NewEmail(MAILERSEND_API_KEY)

_FROM_EMAIL = FROM_EMAIL
_FROM_NAME  = FROM_NAME

# Debug: Check if API key is loaded


async def send_mailersend(
    *,
    subject: str,
    html_body: str,
    to_email: EmailStr,
) -> None:
    """
    Send an email via MailerSend SDK.
    Raises RuntimeError / ValueError from SDK on failure.
    """

    logging.info(f"MAILERSEND_API_KEY loaded: {'Yes' if MAILERSEND_API_KEY else 'No'}")
    if MAILERSEND_API_KEY:
        logging.info(f"API Key starts with: {MAILERSEND_API_KEY[:10]}...")
    mail = {}                                              # body container

    _mailer.set_mail_from({"email": _FROM_EMAIL,
                           "name":  _FROM_NAME}, mail)
    _mailer.set_mail_to([{"email": str(to_email)}], mail)
    _mailer.set_subject(subject, mail)
    _mailer.set_html_content(html_body, mail)

    # quick plaintext: HTML→text so Gmail dark-mode previews look sane
    _mailer.set_plaintext_content(
        html2text.html2text(html_body).strip(), mail
    )

    # Fire & forget – API returns 202 JSON on success
    resp = _mailer.send(mail)
    logging.info("MailerSend response: %s", resp)           # optional




async def draft_email_body_html(form: ContactForm) -> str:
    """
    Ask GPT to return ONLY an HTML body (no <html> wrapper, no subject line).
    """
    system_prompt = (
        "You are a senior marketing assistant. Write a concise, friendly INTERNAL "
        "email in HTML that notifies the sales team about a new website enquiry. "
        "Requirements:\n"
        "• Do NOT include a subject line or emojis.\n"
        "• Start with a short greeting (e.g., 'Hi Team,').\n"
        "• Use an unordered list (<ul><li>) to show Name, Email, Company, Message.\n"
        "• End with a brief call-to-action (‘Please follow up…’) and a friendly sign-off as “Indrasol Sales”.\n"
        "Return ONLY the HTML snippet."
    )

    user_msg = (
        f"Name: {form.name}\n"
        f"Email: {form.email}\n"
        f"Company: {form.company or '—'}\n"
        f"Message: {form.message}"
    )

    html_body = await run_openai_prompt(
        prompt=user_msg,
        system_prompt=system_prompt,
        temperature=0.5,
        max_tokens=250,
        model="gpt-4o-mini",
    )
    m = re.search(r"```(?:html)?\s*(.*?)```", html_body, re.DOTALL | re.IGNORECASE)
    html_body = m.group(1) if m else html_body
    return html_body.strip()

async def process_contact(form: ContactForm, is_bot: bool = True):
    try:
        html_body  = await draft_email_body_html(form)
        if is_bot:
            subject = (
                f"New Business Enquiry through IndraBot – {form.name}"
                    + (f" ({form.company})" if form.company else "")
            )
        else:
            subject = (
                f"New Business Enquiry through Contact US Form {form.name}"
                + (f" ({form.company})" if form.company else "")
            ) 
        # TO_EMAIL = TO_EMAIL
        await send_mailersend(
            subject=subject,
            html_body=html_body,
            to_email=TO_EMAIL,
        )
        logging.info(f"Contact email sent successfully to {TO_EMAIL}")
    except Exception as exc:
        logging.error("Failed to send contact email", exc_info=exc)
        raise  # Re-raise the exception so the caller can handle it