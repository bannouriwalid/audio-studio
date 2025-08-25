from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import StreamingResponse
import httpx
from config import settings

router = APIRouter()

@router.post("/embed")
async def proxy_embed(wav_file: UploadFile = File(...)):
    files = {"wav_file": (wav_file.filename, await wav_file.read(), wav_file.content_type)}

    async with httpx.AsyncClient() as client:
        response = await client.post(f"{settings.WATERMARK_SERVICE_URL}/api/watermark/embed", files=files)
    return StreamingResponse(
        response.aiter_bytes(),
        status_code=response.status_code,
        media_type=response.headers.get("content-type", "application/octet-stream")
    )


@router.post("/embed-bits")
async def proxy_embed_bits(wav_file: UploadFile = File(...), bits: str = Form(...)):
    files = {"wav_file": (wav_file.filename, await wav_file.read(), wav_file.content_type)}
    data = {"bits": bits}

    async with httpx.AsyncClient() as client:
        response = await client.post(f"{settings.WATERMARK_SERVICE_URL}/api/watermark/embed-bits", files=files, data=data)

    return StreamingResponse(
        response.aiter_bytes(),
        status_code=response.status_code,
        media_type=response.headers.get("content-type", "application/octet-stream")
    )


@router.post("/detect")
async def proxy_detect(wav_file: UploadFile = File(...), threshold: float = Form(0.5)):
    files = {"wav_file": (wav_file.filename, await wav_file.read(), wav_file.content_type)}
    data = {"threshold": str(threshold)}

    try:
        async with httpx.AsyncClient(timeout=httpx.Timeout(60.0)) as client:
            response = await client.post(f"{settings.WATERMARK_SERVICE_URL}/api/watermark/detect", files=files, data=data)
        response.raise_for_status()
        return response.json()
    except httpx.RequestError as exc:
        return {"error": f"Request failed: {exc}"}
    except httpx.HTTPStatusError as exc:
        return {"error": f"Bad response: {exc.response.status_code} - {exc.response.text}"}


@router.post("/probability-map")
async def proxy_probability_map(wav_file: UploadFile = File(...)):
    files = {"wav_file": (wav_file.filename, await wav_file.read(), wav_file.content_type)}

    try:
        async with httpx.AsyncClient(timeout=httpx.Timeout(60.0)) as client:
            response = await client.post(f"{settings.WATERMARK_SERVICE_URL}/api/watermark/probability-map", files=files)
        response.raise_for_status()
        return response.json()
    except httpx.RequestError as exc:
        return {"error": f"Request failed: {exc}"}
    except httpx.HTTPStatusError as exc:
        return {"error": f"Bad response: {exc.response.status_code} - {exc.response.text}"}
