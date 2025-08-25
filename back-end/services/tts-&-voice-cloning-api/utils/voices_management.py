import os
import shutil
from werkzeug.utils import secure_filename
from config import Config

ALLOWED_EXTENSIONS = {"wav"}

def allowed_file(filename):
    """Check if uploaded file has allowed extension."""
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

# ===== VOICE FOLDER OPERATIONS =====
def list_voices():
    """Return a list of all voice folders."""
    return [f for f in os.listdir(Config.ROOT_DIR) if os.path.isdir(os.path.join(Config.ROOT_DIR, f))]

def create_voice(name):
    """Create a new voice folder."""
    safe_name = secure_filename(name)
    path = os.path.join(Config.ROOT_DIR, safe_name)
    if os.path.exists(path):
        return False, "Voice already exists"
    os.makedirs(path)
    return True, path

def delete_voice(name):
    """Delete a voice folder."""
    path = os.path.join(Config.ROOT_DIR, secure_filename(name))
    if not os.path.exists(path):
        return False
    shutil.rmtree(path)
    return True

def rename_voice(old, new):
    """Rename a voice folder."""
    old_path = os.path.join(Config.ROOT_DIR, secure_filename(old))
    new_path = os.path.join(Config.ROOT_DIR, secure_filename(new))
    if not os.path.exists(old_path):
        return False
    os.rename(old_path, new_path)
    return True

# ===== FILE OPERATIONS =====
def list_voice_files(voice):
    """Return a list of all .wav files in a voice folder."""
    voice_path = os.path.join(Config.ROOT_DIR, secure_filename(voice))
    if not os.path.exists(voice_path):
        return []
    return [f for f in os.listdir(voice_path) if f.endswith(".wav")]

def upload_voice_file(voice, file):
    """Save a .wav file into the specified voice folder."""
    if not allowed_file(file.filename):
        return False, "Only .wav files are allowed"

    voice_path = os.path.join(Config.ROOT_DIR, secure_filename(voice))
    os.makedirs(voice_path, exist_ok=True)

    file_path = os.path.join(voice_path, secure_filename(file.filename))
    file.save(file_path)
    return True, file_path

def delete_voice_file(voice, filename):
    """Delete a specific .wav file in a voice folder."""
    path = os.path.join(Config.ROOT_DIR, secure_filename(voice), secure_filename(filename))
    if not os.path.exists(path):
        return False
    os.remove(path)
    return True

def rename_voice_file(voice, old_name, new_name):
    """Rename a .wav file in a voice folder."""
    folder = os.path.join(Config.ROOT_DIR, secure_filename(voice))
    old_path = os.path.join(folder, secure_filename(old_name))
    
    # Ensure .wav extension
    if not new_name.endswith(".wav"):
        new_name += ".wav"
    new_path = os.path.join(folder, secure_filename(new_name))

    if not os.path.exists(old_path):
        return False, "File not found"
    if os.path.exists(new_path):
        return False, "File with new name already exists"

    os.rename(old_path, new_path)
    return True, new_path