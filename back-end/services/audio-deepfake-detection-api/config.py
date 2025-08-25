import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    APP_HOST = os.getenv("APP_HOST", "0.0.0.0")
    APP_PORT = int(os.getenv("APP_PORT", 5000))
    HISTORY_FILE = os.getenv("HISTORY_FILE", "history.json")
    LOG_FILE = os.getenv("LOG_FILE", "app.log")
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
    # Model parameters
    MODEL_NAME = os.getenv("MODEL_NAME", "nii-yamagishilab/wav2vec-large-anti-deepfake-nda")
    ENCODER_LAYERS = int(os.getenv("ENCODER_LAYERS", 24))
    ENCODER_EMBED_DIM = int(os.getenv("ENCODER_EMBED_DIM", 1024))
    ENCODER_FFN_EMBED_DIM = int(os.getenv("ENCODER_FFN_EMBED_DIM", 4096))
    ENCODER_ATTENTION_HEADS = int(os.getenv("ENCODER_ATTENTION_HEADS", 16))
    FINAL_DIM = int(os.getenv("FINAL_DIM", 768))