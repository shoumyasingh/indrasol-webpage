from services.openai_service import run_openai_prompt
#from prompts.intent_prompt import intent_prompt

PROMPT_PATH = "app/prompts/intent_prompt.txt"

async def run_intent_agent(user_message: str, history: list) -> str:
    with open(PROMPT_PATH, "r") as file:
        prompt_template = file.read()

    # Combine last few history lines for context
    history_context = " | ".join(history[-3:]) if history else "[]"

    prompt = (
        f"{prompt_template}\n\n"
        f"User: {user_message}\n"
        f"History: {history_context}\n→"
    )
    response = await run_openai_prompt(prompt)
    return response
