import os
from flask import Blueprint, request, jsonify
from utils.audio_utils import tts_to_bytes
from utils.logger import logger

clone_bp = Blueprint("clone", __name__)
XTTS = None

@clone_bp.route("/synthesize_clone", methods=["POST"])
def synthesize_clone():
    """Clone a voice from uploaded .wav samples and synthesize text."""
    text = request.form.get("text")
    language = request.form.get("language", "en")

    if not text or "speaker_wav" not in request.files:
        return jsonify({"error": "Missing text or speaker_wav"}), 400

    speaker_paths = []
    try:
        for i, file in enumerate(request.files.getlist("speaker_wav")):
            path = f"temp_speaker_{i}.wav"
            file.save(path)
            logger.debug(f"Saved temp speaker file: {path}")
            speaker_paths.append(path)

        result = tts_to_bytes(XTTS, text=text, language=language, speaker_wav=speaker_paths)
        return jsonify(result)

    finally:
        for path in speaker_paths:
            try: os.remove(path)
            except: pass
