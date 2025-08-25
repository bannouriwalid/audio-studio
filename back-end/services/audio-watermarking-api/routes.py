from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from services import (
    embed_random_watermark,
    embed_custom_bits,
    detect_watermark,
    get_detection_probabilities,
)
import shutil
import uuid
import os
from dotenv import load_dotenv
from logger import logger

load_dotenv()

router = APIRouter()

INPUT_DIR = os.getenv("INPUT_DIR", "Original")
OUTPUT_DIR = os.getenv("OUTPUT_DIR", "Embedded")

os.makedirs(INPUT_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)


# ---------------- ROUTES ---------------- #

@router.post("/embed")
async def embed_random(wav_file: UploadFile = File(...)):
    """
    Upload a WAV file and embed a random watermark.
    Returns the watermarked file for download.
    """
    file_id = str(uuid.uuid4())
    input_path = f"{INPUT_DIR}/{file_id}_input.wav"
    output_path = f"{OUTPUT_DIR}/{file_id}_watermarked.wav"

    try:
        # Save uploaded file
        with open(input_path, "wb") as f:
            shutil.copyfileobj(wav_file.file, f)
        logger.info(f"File saved: {input_path}")

        # Apply watermark
        embed_random_watermark(input_path, output_path)
        logger.info(f"Watermarked file created: {output_path}")

        return FileResponse(output_path, filename="watermarked.wav")

    except Exception as e:
        logger.error(f"Error embedding random watermark: {e}")
        raise HTTPException(status_code=500, detail="Watermark embedding failed")


@router.post("/embed-bits")
async def embed_with_bits(
    wav_file: UploadFile = File(...),
    bits: str = Form(...),
):
    """
    Upload a WAV file and embed a **custom bit sequence** as watermark.
    Example: bits="010101"
    """
    file_id = str(uuid.uuid4())
    input_path = f"{INPUT_DIR}/{file_id}_input.wav"
    output_path = f"{OUTPUT_DIR}/{file_id}_watermarked.wav"

    try:
        bits_tensor = [int(c) for c in bits.strip()]
        logger.debug(f"Custom bits received: {bits_tensor}")

        # Save uploaded file
        with open(input_path, "wb") as f:
            shutil.copyfileobj(wav_file.file, f)
        logger.info(f"File saved: {input_path}")

        # Apply custom watermark
        embed_custom_bits(input_path, output_path, bits_tensor)
        logger.info(f"Custom watermarked file created: {output_path}")

        return FileResponse(output_path, filename="watermarked.wav")

    except Exception as e:
        logger.error(f"Error embedding custom watermark: {e}")
        raise HTTPException(status_code=500, detail="Custom watermark embedding failed")


@router.post("/detect")
async def detect(
    wav_file: UploadFile = File(...),
    threshold: float = Form(0.5)
):
    """
    Upload a WAV file and check if a watermark exists.
    Returns detection result, probability, and decoded bits.
    """
    file_id = str(uuid.uuid4())
    input_path = f"{INPUT_DIR}/{file_id}_input.wav"

    try:
        # Save uploaded file
        with open(input_path, "wb") as f:
            shutil.copyfileobj(wav_file.file, f)
        logger.info(f"File saved for detection: {input_path}")

        # Run detection
        result = detect_watermark(input_path, threshold)
        logger.info(f"Detection result: {result}")

        return result

    except Exception as e:
        logger.error(f"Error during watermark detection: {e}")
        raise HTTPException(status_code=500, detail="Watermark detection failed")


@router.post("/probability-map")
async def probability_map(wav_file: UploadFile = File(...)):
    """
    Upload a WAV file and return **detection probability statistics**:
    - Frame-level probabilities
    - Bit-level confidence
    """
    file_id = str(uuid.uuid4())
    input_path = f"{INPUT_DIR}/{file_id}_input.wav"

    try:
        # Save uploaded file
        with open(input_path, "wb") as f:
            shutil.copyfileobj(wav_file.file, f)
        logger.info(f"File saved for probability map: {input_path}")

        result = get_detection_probabilities(input_path)
        logger.info(f"Probability map computed for: {file_id}")

        return result

    except Exception as e:
        logger.error(f"Error computing probability map: {e}")
        raise HTTPException(status_code=500, detail="Probability map computation failed")
