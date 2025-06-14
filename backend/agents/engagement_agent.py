import os
from pathlib import Path
from services.openai_service import run_openai_prompt
from services.bot_response_formatter_md import ensure_markdown

PROMPT_PATH = Path(__file__).parent.parent / "prompts/engagement_prompt.txt"

async def run_engagement_agent(user_message: str, context: str = "", history: str = "") -> str:
    with open(PROMPT_PATH, "r") as file:
        prompt_template = file.read()

    prompt = f"{prompt_template}\n\nUser: {user_message}\nAI:"
    response = await run_openai_prompt(prompt)
    return await ensure_markdown(response)
