from services.openai_service import run_openai_prompt
from pathlib import Path

PROMPT_PATH = Path(__file__).parent.parent / "prompts/intent_prompt.txt"

async def run_intent_agent(user_message: str, history: str) -> str:
    with open(PROMPT_PATH, "r") as file:
        prompt_template = file.read()

    prompt = (
        f"{prompt_template}\n\n"
        f"User: {user_message}\n"
        f"History: {history}\n→"
    )
    response = await run_openai_prompt(prompt)
    return response
