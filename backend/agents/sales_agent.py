from services.openai_service import run_openai_prompt
from pathlib import Path
from services.bot_response_formatter_md import ensure_markdown

PROMPT_PATH = Path(__file__).parent.parent / "prompts/sales_prompt.txt"

async def run_sales_agent(user_message: str, context: str, history: str) -> str:
    with open(PROMPT_PATH, "r") as file:
        prompt_template = file.read()

    prompt = (
        f"{prompt_template}\n\n"
        f"User message: {user_message}\n\n"
        f"Context:\n{context}\n\n"
        f"Chat History:\n{history}\n\n"
        f"Sales Agent:"
    )

    response = await run_openai_prompt(prompt, model="gpt-4.1")
    return await ensure_markdown(response)