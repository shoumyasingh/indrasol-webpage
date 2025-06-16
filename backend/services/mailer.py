import requests
import os
import logging

def send_contact_email(name: str, email: str, company: str = "", note: str = ""):
    """
    Send contact form submission via existing /contact endpoint
    """
    try:
        data = {
            "name": name,
            "email": email,
            "company": company,
            "message": note
        }
        
        # Use environment variable for contact endpoint
        endpoint = os.getenv("CONTACT_ENDPOINT", "https://api.indrasol.com/contact")
        
        response = requests.post(endpoint, json=data, timeout=10)
        response.raise_for_status()
        
        logging.info(f"Contact email sent successfully for {email}")
        return True
        
    except Exception as e:
        logging.error(f"Failed to send contact email: {e}")
        return False 