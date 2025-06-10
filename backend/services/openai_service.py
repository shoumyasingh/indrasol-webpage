import os
import openai
import asyncio

openai.api_key = os.getenv("OPENAI_API_KEY")

async def run_openai_prompt(prompt: str) -> str:
    response = await asyncio.to_thread(
        lambda: openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a helpful AI assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=300
        )
    )
    return response.choices[0].message.content.strip()