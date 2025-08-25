import os
import json
from datetime import datetime
from config import Config
from utils.logger import logger

def append_to_history(result_list):
    """
    Append a list of results to the history file.
    Creates the history file if it doesn't exist and handles corrupted JSON.

    Args:
        result_list (list): List of result dictionaries to append.
    """
    if os.path.exists(Config.HISTORY_FILE):
        try:
            with open(Config.HISTORY_FILE, "r") as f:
                history = json.load(f)
        except json.JSONDecodeError:
            history = []
    else:
        history = []

    history.extend(result_list)

    with open(Config.HISTORY_FILE, "w") as f:
        json.dump(history, f, indent=2)

    logger.info(f"Appended {len(result_list)} results to history")


def get_history():
    """
    Retrieve the processing history from the history file.
    Adds a timestamp to entries that lack one.

    Returns:
        list: List of history entries.
    """
    if not os.path.exists(Config.HISTORY_FILE):
        return []
    try:
        with open(Config.HISTORY_FILE, "r") as f:
            history = json.load(f)
    except json.JSONDecodeError:
        history = []

    # Ensure all entries have a timestamp
    for entry in history:
        if "timestamp" not in entry:
            entry["timestamp"] = datetime.utcnow().isoformat() + "Z"
    return history


def reset_history():
    """
    Delete the history file, effectively resetting all saved history.
    """
    if os.path.exists(Config.HISTORY_FILE):
        os.remove(Config.HISTORY_FILE)
        logger.warning("History reset.")

