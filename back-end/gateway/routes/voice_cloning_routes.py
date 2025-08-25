from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import StreamingResponse
import httpx
from config import settings

router = APIRouter()


# --------- VOICE CLONING --------- #
@router.post("/synthesize_clone")
async def proxy_synthesize_clone(
    text: str = Form(...),
    language: str = Form("en"),
    speaker_wav: list[UploadFile] = File(...)
):
    """Proxy voice cloning"""
    files = []
    for i, wav in enumerate(speaker_wav):
        files.append(("speaker_wav", (wav.filename, await wav.read(), wav.content_type)))
    data = {"text": text, "language": language}

    try:
        async with httpx.AsyncClient(timeout=300.0) as client:
            response = await client.post(
                f"{settings.TTS_SERVICE_URL}/synthesize_clone",
                data=data,
                files=files
            )
        response.raise_for_status()
        return response.json()
    except httpx.RequestError as exc:
        return {"error": f"Request failed: {exc}"}
    except httpx.HTTPStatusError as exc:
        return {"error": f"Bad response: {exc.response.status_code} - {exc.response.text}"}


# --------- VOICE FOLDER ROUTES --------- #
@router.get("/voices")
async def proxy_list_voices():
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{settings.TTS_SERVICE_URL}/voices")
    return response.json()


@router.post("/voices")
async def proxy_create_voice(name: str = Form(...)):
    data = {"name": name}
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{settings.TTS_SERVICE_URL}/voices", data=data)
    return response.json()


@router.delete("/voices")
async def proxy_delete_voice(name: str):
    async with httpx.AsyncClient() as client:
        response = await client.delete(f"{settings.TTS_SERVICE_URL}/voices", params={"name": name})
    return response.json()


@router.put("/voices/rename")
async def proxy_rename_voice(old: str = Form(...), new: str = Form(...)):
    data = {"old": old, "new": new}
    async with httpx.AsyncClient() as client:
        response = await client.put(f"{settings.TTS_SERVICE_URL}/voices/rename", data=data)
    return response.json()


# --------- VOICE FILE ROUTES --------- #
@router.get("/voices/{voice}")
async def proxy_list_voice_files(voice: str):
    """List files in a specific voice folder"""
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{settings.TTS_SERVICE_URL}/voices/{voice}")
    return response.json()


@router.post("/voices/{voice}")
async def proxy_upload_voice_file(voice: str, file: UploadFile = File(...)):
    files = {"file": (file.filename, await file.read(), file.content_type)}
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{settings.TTS_SERVICE_URL}/voices/{voice}", files=files)
    return response.json()


@router.delete("/voices/{voice}")
async def proxy_delete_voice_file(voice: str, filename: str):
    """Delete a specific audio file"""
    params = {"filename": filename}
    async with httpx.AsyncClient() as client:
        response = await client.delete(f"{settings.TTS_SERVICE_URL}/voices/{voice}", params=params)
    return response.json()


@router.put("/voices/{voice}/rename")
async def proxy_rename_voice_file(voice: str, old: str = Form(...), new: str = Form(...)):
    """Rename a specific audio file in a voice folder"""
    data = {"old": old, "new": new}
    async with httpx.AsyncClient() as client:
        response = await client.put(f"{settings.TTS_SERVICE_URL}/voices/{voice}/rename", data=data)
    return response.json()


@router.get("/voices/{voice}/{filename}")
async def proxy_get_voice_file(voice: str, filename: str):
    """Stream back audio file"""
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{settings.TTS_SERVICE_URL}/voices/{voice}/{filename}")
    return StreamingResponse(
        response.aiter_bytes(),
        status_code=response.status_code,
        media_type=response.headers.get("content-type", "audio/wav")
    )
