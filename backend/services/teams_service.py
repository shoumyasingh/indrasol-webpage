# Webhook - https://default01c9c0cb6231402189ef3f15739368.de.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/c4dd1c4d2f0843c39dc602a1762b7d37/triggers/manual/paths/invoke/?api-version=1&tenantId=tId&environmentName=Default-01c9c0cb-6231-4021-89ef-3f15739368de&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=doHHMeILKx6AUfio-4CT0Wo7t4KJ8W6xNDcdEdIWoAQ

from models.request_models import ContactForm
import logging
import requests

TEAMS_WEBHOOK_URL = "https://default01c9c0cb6231402189ef3f15739368.de.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/c4dd1c4d2f0843c39dc602a1762b7d37/triggers/manual/paths/invoke/?api-version=1&tenantId=tId&environmentName=Default-01c9c0cb-6231-4021-89ef-3f15739368de&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=doHHMeILKx6AUfio-4CT0Wo7t4KJ8W6xNDcdEdIWoAQ"

async def format_teams_message(form: ContactForm, is_bot: bool = True) -> None:

    try:
        name = form.name
        email = form.email
        company = form.company
        message = form.message
        if is_bot:
            payload =  {
                "text": f"""
                    🎯 **New Business Enquiry through IndraBot**

                    👤 **Name:** {name}  
                    📧 **Email:** {email}  
                    🏢 **Company:** {company}  
                    💬 **Message:** {message}

                    📈 This could be a great opportunity — let’s connect with the lead promptly, offer them the value they’re looking for, and turn this into a meaningful conversation! 💼
                    """
            }
        else:
            payload = {
                "text": f"""
                    🎯 **New Business Enquiry through Contact US Form**

                    👤 **Name:** {name}  
                    📧 **Email:** {email}  
                    🏢 **Company:** {company}  
                    💬 **Message:** {message}
                    """
            }
        requests.post(TEAMS_WEBHOOK_URL, json=payload)
    except Exception as exc:
        logging.error("Failed to send contact email", exc_info=exc)