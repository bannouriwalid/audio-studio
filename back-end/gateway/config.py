import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    GATEWAY_HOST: str = os.getenv("GATEWAY_HOST", "0.0.0.0")
    GATEWAY_PORT: int = int(os.getenv("GATEWAY_PORT", 8080))

    WATERMARK_SERVICE_URL: str = os.getenv("WATERMARK_SERVICE_URL")
    DEEPFAKE_SERVICE_URL: str = os.getenv("DEEPFAKE_SERVICE_URL")
    TTS_SERVICE_URL: str = os.getenv("TTS_SERVICE_URL")

settings = Settings()