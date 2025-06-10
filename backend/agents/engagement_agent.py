import os
from services.openai_service import run_openai_prompt
#from prompts.engagement_prompt import engagaement_prompt

PROMPT_PATH = "/prompts/engagement_prompt.txt"

async def run_engagement_agent(user_message: str) -> str:
    with open(PROMPT_PATH, "r") as file:
        prompt_template = file.read()

    prompt = f"{prompt_template}\n\nUser: {user_message}\nAI:"
    response = await run_openai_prompt(prompt)
    return response
