from flask import Blueprint, request, jsonify
from utils.audio_utils import tts_to_bytes
from utils.logger import logger
from utils.constants import SPEAKERS

tts_bp = Blueprint("tts", __name__)
XTTS, VITS = None, None

@tts_bp.route("/synthesize_xtts", methods=["POST"])
def synthesize_xtts():
    """Synthesize speech using XTTS multilingual model."""
    data = request.json
    text = data.get("text")
    speaker = data.get("speaker", "default")
    language = data.get("language", "en")

    if not text:
        return jsonify({"error": "Missing text"}), 400

    logger.info(f"Synthesizing XTTS text='{text[:30]}...' lang={language}")
    result = tts_to_bytes(XTTS, text=text, speaker=speaker, language=language)
    return jsonify(result)

@tts_bp.route("/synthesize_vits", methods=["POST"])
def synthesize_vits():
    """Synthesize speech using English VITS model."""
    data = request.json
    text = data.get("text")

    if not text:
        return jsonify({"error": "Missing text"}), 400

    logger.info(f"Synthesizing VITS text='{text[:30]}...'")
    result = tts_to_bytes(VITS, text=text)
    return jsonify(result)

@tts_bp.route("/languages", methods=["GET"])
def list_languages():
    """List available languages for XTTS model."""
    languages = XTTS.languages if hasattr(XTTS, "languages") else []
    return jsonify(languages)


@tts_bp.route("/speakers", methods=["GET"])
def get_speakers():
    """List available speakers for XTTS model."""
    SPEAKERS["speakers"] = sorted(SPEAKERS["speakers"], key=lambda x: x["name"])
    return jsonify(SPEAKERS)
