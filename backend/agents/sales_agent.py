from services.openai_service import run_openai_prompt

PROMPT_PATH = "app/prompts/sales_prompt.txt"

async def run_sales_agent(user_message: str, context: str) -> str:
    with open(PROMPT_PATH, "r") as file:
        prompt_template = file.read()

    prompt = (
        f"{prompt_template}\n\n"
        f"User message: {user_message}\n\n"
        f"Context:\n{context}\n\n"
        f"Sales Agent:"
    )

    response = await run_openai_prompt(prompt)
    return response