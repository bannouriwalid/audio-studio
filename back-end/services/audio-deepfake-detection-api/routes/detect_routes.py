import os
import torch
from flask import Blueprint, request, jsonify
from services.model_service import model, device
from services.audio_service import load_wav_and_preprocess
from services.history_service import append_to_history
from utils.logger import logger

detect_bp = Blueprint("detect", __name__)

@detect_bp.route("/detect", methods=["POST"])
def detect_deepfake():
    """
    Endpoint to detect deepfake audio from uploaded files.
    Accepts multiple audio files, processes them through the model,
    and returns probabilities of being real or fake.

    Returns:
        JSON response containing detection results or error messages.
    """
    # Validate that at least one file is provided in the request
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    # Retrieve all uploaded files
    files = request.files.getlist("file")
    results = []

    # Process each uploaded file individually
    for file in files:
        # Create a temporary path with the original file extension
        temp_path = "temp_audio" + os.path.splitext(file.filename)[1]
        file.save(temp_path)

        try:
            # Disable gradient computation for inference
            with torch.no_grad():
                # Load and preprocess the audio file
                wav = load_wav_and_preprocess(temp_path, device=device)
                # Perform model inference
                logits = model(wav)
                # Convert logits to probabilities
                probs = torch.nn.functional.softmax(logits, dim=1).cpu().numpy()[0]

            # Structure the result for the current file
            result = {
                "filename": file.filename,
                "real_prob": float(probs[1]),
                "fake_prob": float(probs[0])
            }
            results.append(result)

            # Log successful processing
            logger.info(f"Processed {file.filename} -> real: {probs[1]:.4f}, fake: {probs[0]:.4f}")
        except Exception as e:
            # Handle any errors during processing and log them
            results.append({"filename": file.filename, "error": str(e)})
            logger.error(f"Error processing {file.filename}: {e}")
        finally:
            # Clean up temporary file
            if os.path.exists(temp_path):
                os.remove(temp_path)

    # Append results to processing history
    append_to_history(results)

    # Return single result if only one file, else return list of results
    return jsonify(results[0] if len(results) == 1 else results)
