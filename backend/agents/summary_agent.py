
from typing import List
from openai import OpenAI # or your LLM SDK
import logging
from services.openai_service import run_openai_prompt
async def run_summary_agent(history: List[str]) -> str:
    """
    Runs the summary agent to generate a concise summary of the chat history.
    
    Args:
        history (List[str]): The chat history to summarize.
        
    Returns:
        str: The generated summary of the conversation.
    """
    logging.info("Running summary agent on chat history.")
    summary = await summarize_history(history)
    return summary
async def summarize_history(history: List[str]) -> str:
    if not history:
        return ""

    try:
        # Format history into a chat transcript
        formatted_history = "\n".join([f"User: {history[i]}" if i % 2 == 0 else f"Bot: {history[i]}" for i in range(len(history))])

        system_prompt = (
            "You are a concise summarizer for a sales chatbot. "
            "Write 3–4 sentences covering: "
            "1) the visitor’s main goals or pains, "
            "2) any objections raised so far, "
            "3) their current buying stage (cold / curious / hot)."
        )


        prompt = f"{system_prompt}\n\nConversation:\n{formatted_history}\n\n---\nSummary:"

        summary = await run_openai_prompt(prompt)

        # logging.info(f"Generated conversation summary: {summary}")
        return summary

    except Exception as e:
        logging.exception("Failed to summarize chat history.")
        return ""
