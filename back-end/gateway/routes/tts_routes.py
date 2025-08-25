from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import StreamingResponse
import httpx
from config import settings

router = APIRouter()

@router.post("/synthesize_xtts")
async def proxy_synthesize_xtts(data: dict):
    """Proxy XTTS synthesis"""
    try:
        async with httpx.AsyncClient(timeout=300.0) as client:
            response = await client.post(f"{settings.TTS_SERVICE_URL}/synthesize_xtts", json=data)
        response.raise_for_status()
        return response.json()
    except httpx.RequestError as exc:
        return {"error": f"Request failed: {exc}"}
    except httpx.HTTPStatusError as exc:
        return {"error": f"Bad response: {exc.response.status_code} - {exc.response.text}"}


@router.post("/synthesize_vits")
async def proxy_synthesize_vits(data: dict):
    """Proxy VITS synthesis"""
    try:
        async with httpx.AsyncClient(timeout=300.0) as client:
            response = await client.post(f"{settings.TTS_SERVICE_URL}/synthesize_vits", json=data)
        response.raise_for_status()
        return response.json()
    except httpx.RequestError as exc:
        return {"error": f"Request failed: {exc}"}
    except httpx.HTTPStatusError as exc:
        return {"error": f"Bad response: {exc.response.status_code} - {exc.response.text}"}


@router.get("/languages")
async def proxy_languages():
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{settings.TTS_SERVICE_URL}/languages")
    return response.json()


@router.get("/speakers")
async def proxy_speakers():
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{settings.TTS_SERVICE_URL}/speakers")
    return response.json()
