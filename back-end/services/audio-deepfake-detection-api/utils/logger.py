import logging
from logging.handlers import RotatingFileHandler
from config import Config

logger = logging.getLogger("deepfake-detector")
logger.setLevel(Config.LOG_LEVEL)

formatter = logging.Formatter(
    "%(asctime)s [%(levelname)s] %(name)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)

# Console output
console_handler = logging.StreamHandler()
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

# Rotating file output
file_handler = RotatingFileHandler(Config.LOG_FILE, maxBytes=5_000_000, backupCount=3)
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)
