import logging
from logging.handlers import RotatingFileHandler
from config import Config
import os

os.makedirs(Config.LOG_DIR, exist_ok=True)
LOG_FILE = os.path.join(Config.LOG_DIR, "app.log")

logger = logging.getLogger("voice-app")
logger.setLevel(Config.LOG_LEVEL)

formatter = logging.Formatter(
    "%(asctime)s [%(levelname)s] %(name)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)

# Console handler
console_handler = logging.StreamHandler()
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

# Rotating file handler
file_handler = RotatingFileHandler(LOG_FILE, maxBytes=5_000_000, backupCount=3)
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)