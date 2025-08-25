from flask import Blueprint, jsonify
from services.history_service import get_history, reset_history

history_bp = Blueprint("history", __name__)

@history_bp.route("/history", methods=["GET"])
def history():
    """
    GET endpoint to retrieve the processing history.
    Returns:
        JSON response containing all saved history entries.
    """
    return jsonify(get_history())

@history_bp.route("/history/reset", methods=["POST"])
def history_reset():
    """
    POST endpoint to reset/clear the processing history.
    Returns:
        JSON response confirming successful history reset.
    """
    reset_history()
    return jsonify({"message": "History reset successfully."})
