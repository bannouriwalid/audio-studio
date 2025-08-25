from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import StreamingResponse
import httpx
from config import settings

router = APIRouter()


@router.post("/detect")
async def proxy_deepfake_detect(file: UploadFile = File(...)):
    files = {"file": (file.filename, await file.read(), file.content_type)}

    try:
        async with httpx.AsyncClient(timeout=httpx.Timeout(60.0)) as client:
            response = await client.post(f"{settings.DEEPFAKE_SERVICE_URL}/detect", files=files)
        response.raise_for_status()
        return response.json()
    except httpx.RequestError as exc:
        return {"error": f"Request failed: {exc}"}
    except httpx.HTTPStatusError as exc:
        return {"error": f"Bad response: {exc.response.status_code} - {exc.response.text}"}


@router.get("/history")
async def proxy_deepfake_history():
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{settings.DEEPFAKE_SERVICE_URL}/history")
        response.raise_for_status()
        return response.json()
    except httpx.RequestError as exc:
        return {"error": f"Request failed: {exc}"}
    except httpx.HTTPStatusError as exc:
        return {"error": f"Bad response: {exc.response.status_code} - {exc.response.text}"}


@router.post("/history/reset")
async def proxy_deepfake_history_reset():
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{settings.DEEPFAKE_SERVICE_URL}/history/reset")
        response.raise_for_status()
        return response.json()
    except httpx.RequestError as exc:
        return {"error": f"Request failed: {exc}"}
    except httpx.HTTPStatusError as exc:
        return {"error": f"Bad response: {exc.response.status_code} - {exc.response.text}"}