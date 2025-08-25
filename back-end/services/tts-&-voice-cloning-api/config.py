import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    APP_HOST = os.getenv("APP_HOST", "0.0.0.0")
    APP_PORT = int(os.getenv("APP_PORT", 5002))
    ROOT_DIR = os.getenv("ROOT_DIR", "Added_Voices")
    LOG_DIR = os.getenv("LOG_DIR", "/root/app")
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
    # Models
    XTTS_MODEL = os.getenv("XTTS_MODEL", "tts_models/multilingual/multi-dataset/xtts_v2")
    VITS_MODEL = os.getenv("VITS_MODEL", "tts_models/en/ljspeech/vits")

