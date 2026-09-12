import os
import logging
from typing import Union, List, Optional
import httpx

logger = logging.getLogger("libretranslate")

LIBRETRANSLATE_URL = os.getenv("LIBRETRANSLATE_URL", "http://localhost:5000").rstrip("/")
LIBRETRANSLATE_API_KEY = os.getenv("LIBRETRANSLATE_API_KEY", None)

async def translate_text(
    text: Union[str, List[str]], 
    source: str = "en", 
    target: str = "hi",
    format: str = "text"
) -> dict:
    """
    Forward translation requests to the self-hosted LibreTranslate service.
    Handles single string or array of strings, timeouts, network issues, and invalid inputs gracefully.
    Returns:
        dict: {"translatedText": ..., "source": source, "target": target, "status": "success" | "fallback"}
    """
    # Empty or identity check
    if not text:
        return {
            "translatedText": "" if isinstance(text, str) else [],
            "source": source,
            "target": target,
            "status": "success"
        }

    if source == target:
        return {
            "translatedText": text,
            "source": source,
            "target": target,
            "status": "success"
        }

    payload = {
        "q": text,
        "source": source,
        "target": target,
        "format": format
    }
    if LIBRETRANSLATE_API_KEY:
        payload["api_key"] = LIBRETRANSLATE_API_KEY

    endpoint = f"{LIBRETRANSLATE_URL}/translate"

    try:
        async with httpx.AsyncClient(timeout=6.0) as client:
            response = await client.post(
                endpoint,
                json=payload,
                headers={"Content-Type": "application/json"}
            )

            if response.status_code == 200:
                data = response.json()
                translated = data.get("translatedText", text)
                return {
                    "translatedText": translated,
                    "source": source,
                    "target": target,
                    "status": "success"
                }
            else:
                logger.warning(
                    f"LibreTranslate returned status {response.status_code}: {response.text}"
                )
    except httpx.ConnectError:
        logger.warning(
            f"LibreTranslate not reachable at {LIBRETRANSLATE_URL}. Using fallback."
        )
    except httpx.TimeoutException:
        logger.warning(
            f"LibreTranslate request timed out at {LIBRETRANSLATE_URL}. Using fallback."
        )
    except Exception as e:
        logger.warning(
            f"Error contacting LibreTranslate: {str(e)}. Using fallback."
        )

    # Fallback to original source text
    return {
        "translatedText": text,
        "source": source,
        "target": target,
        "status": "fallback"
    }
