# common/openai_client.py
"""Shared OpenAI helper – async, retrying, typed."""
from __future__ import annotations
import asyncio, logging, backoff
from openai import AsyncOpenAI, APIError, APIConnectionError, APITimeoutError
from config.settings import OPENAI_API_KEY

_LOG = logging.getLogger("openai")
_CLIENT = AsyncOpenAI(api_key=OPENAI_API_KEY)

_RETRY_EXC = (APITimeoutError, APIError, APIConnectionError)


def _on_backoff(details):                       # nice log line for every retry
    _LOG.warning("OpenAI back-off: attempt %s %s", details["tries"], details["exception"])


@backoff.on_exception(backoff.expo, _RETRY_EXC,
                      max_time=30, jitter=backoff.full_jitter,
                      on_backoff=_on_backoff)
async def async_chat(
    messages: list[dict],
    *,
    model: str = "gpt-4o-mini",
    temperature: float = 0.4,
    max_tokens: int = 400
) -> tuple[str, dict]:
    """
    Coroutine – returns (content, usage_stats)

    `usage_stats` is already a plain dict → safe to JSON-serialise if you
    want to store per-request token counts.
    """
    resp = await _CLIENT.chat.completions.create(
        model         = model,
        messages      = messages,
        temperature   = temperature,
        max_tokens    = max_tokens
    )
    usage = resp.usage.model_dump() if resp.usage else {}
    return resp.choices[0].message.content.strip(), usage
