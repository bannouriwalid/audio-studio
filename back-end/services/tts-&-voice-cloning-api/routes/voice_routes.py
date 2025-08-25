import os
from flask import Blueprint, request, jsonify, send_file
from utils.voices_management import (
    list_voices,
    create_voice,
    delete_voice,
    rename_voice,
    list_voice_files as list_files,
    upload_voice_file as save_file,
    delete_voice_file as remove_file,
    rename_voice_file as rename_file,
    allowed_file
)
from utils.logger import logger
from config import Config
from werkzeug.utils import secure_filename

voice_bp = Blueprint("voice", __name__)

# ===== VOICE FOLDER ROUTES =====
@voice_bp.route("/voices", methods=["GET"])
def get_voices():
    """List all created voices."""
    return jsonify(list_voices())

@voice_bp.route("/voices", methods=["POST"])
def add_voice():
    """Create a new voice folder."""
    name = request.form.get("name")
    if not name:
        return jsonify({"error": "Missing voice name"}), 400
    ok, msg = create_voice(name)
    if not ok:
        return jsonify({"error": msg}), 400
    return jsonify({"message": "Voice created"}), 200

@voice_bp.route("/voices", methods=["DELETE"])
def remove_voice():
    """Delete an existing voice folder."""
    name = request.args.get("name")
    if not delete_voice(name):
        return jsonify({"error": "Voice not found"}), 404
    return jsonify({"message": "Voice deleted"})

@voice_bp.route("/voices/rename", methods=["PUT"])
def change_voice_name():
    """Rename an existing voice folder."""
    old = request.form.get("old")
    new = request.form.get("new")
    if not rename_voice(old, new):
        return jsonify({"error": "Voice not found"}), 404
    return jsonify({"message": "Voice renamed"})


# ===== VOICE FILE ROUTES =====
@voice_bp.route("/voices/<voice>", methods=["GET"])
def get_voice_files(voice):
    """List all audio files in a specific voice folder."""
    files = list_files(voice)
    return jsonify(files)

@voice_bp.route("/voices/<voice>", methods=["POST"])
def upload_file(voice):
    """Upload a .wav file into a voice folder."""
    if "file" not in request.files:
        return jsonify({"error": "Missing audio file"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400
    if not allowed_file(file.filename):
        return jsonify({"error": "Only .wav files are allowed"}), 400

    ok, msg = save_file(voice, file)
    if not ok:
        return jsonify({"error": msg}), 400

    logger.info(f"Uploaded voice file {file.filename} to {voice}")
    return jsonify({"message": "File uploaded successfully", "path": msg})

@voice_bp.route("/voices/<voice>/<filename>", methods=["GET"])
def serve_file(voice, filename):
    """Serve stored audio file as .wav."""
    path = os.path.join(Config.ROOT_DIR, secure_filename(voice), secure_filename(filename))
    if not os.path.exists(path):
        return jsonify({"error": "Audio file not found"}), 404
    return send_file(path, mimetype="audio/wav")

@voice_bp.route("/voices/<voice>", methods=["DELETE"])
def delete_file(voice):
    """Delete a specific audio file in a voice folder."""
    filename = request.args.get("filename")
    if not filename:
        return jsonify({"error": "Missing filename"}), 400
    if not remove_file(voice, filename):
        return jsonify({"error": "File not found"}), 404
    return jsonify({"message": "File deleted"})

@voice_bp.route("/voices/<voice>/rename", methods=["PUT"])
def rename_file_route(voice):
    """Rename a specific audio file in a voice folder."""
    old = request.form.get("old")
    new = request.form.get("new")
    if not old or not new:
        return jsonify({"error": "Missing old or new filename"}), 400
    ok, msg = rename_file(voice, old, new)
    if not ok:
        return jsonify({"error": msg}), 400
    return jsonify({"message": "File renamed", "path": msg})