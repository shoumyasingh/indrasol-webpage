from services.openai_service import run_openai_prompt
from pathlib import Path

PROMPT_PATH = Path(__file__).parent.parent / "prompts/objection_prompt.txt"

async def run_objection_agent(user_message: str, context: str = "", history: str = "") -> str:
    with open(PROMPT_PATH, "r") as file:
        prompt_template = file.read()

    prompt = (
        f"{prompt_template}\n\n"
        f"User Objection: {user_message}\n\n"
        f"Context (if needed):\n{context}\n\n"
        f"Chat History (if needed):\n{history}\n\n"
        f"Your Response:"
    )

    response = await run_openai_prompt(prompt)
    return response
