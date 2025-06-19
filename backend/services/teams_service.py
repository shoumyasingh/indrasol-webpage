# Webhook - https://default01c9c0cb6231402189ef3f15739368.de.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/c4dd1c4d2f0843c39dc602a1762b7d37/triggers/manual/paths/invoke/?api-version=1&tenantId=tId&environmentName=Default-01c9c0cb-6231-4021-89ef-3f15739368de&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=doHHMeILKx6AUfio-4CT0Wo7t4KJ8W6xNDcdEdIWoAQ

from models.request_models import ContactForm
import logging
import requests
from config.settings import TEAMS_WEBHOOK_URL

async def format_teams_message(form: ContactForm) -> None:

    try:
        name = form.name
        email = form.email
        company = form.company
        message = form.message
        
        title = "🎯 New Business Enquiry"
        summary_text = "This could be a great opportunity — let's connect with the lead promptly, offer them the value they're looking for, and turn this into a meaningful conversation! 💼"
        
                # Using simple text format for webhook bot compatibility
        text_content = f"""**{title}**

👤 **Name:** {name}

📧 **Email:** {email}

🏢 **Company:** {company or "Not specified"}

💬 **Message:** {message or "No message provided"}

---

📈 **{summary_text}**"""
        
        payload = {
            "text": text_content
        }
        
        response = requests.post(TEAMS_WEBHOOK_URL, json=payload, timeout=10)
        response.raise_for_status()  # Raises exception for HTTP error codes
        logging.info(f"Teams notification sent successfully for {email}")
    except Exception as exc:
        logging.error("Failed to send Teams notification", exc_info=exc)
        raise  # Re-raise the exception so the caller can handle it