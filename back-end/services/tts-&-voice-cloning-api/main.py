from flask import Flask
from flask_cors import CORS
from TTS.api import TTS
import os

from config import Config
from utils.logger import logger
from routes.tts_routes import tts_bp
from routes.voice_routes import voice_bp
from routes.clone_routes import clone_bp

def create_app():
    app = Flask(__name__)
    CORS(app)

    os.makedirs(Config.ROOT_DIR, exist_ok=True)

    # Load models
    from routes import tts_routes, clone_routes
    tts_routes.XTTS = TTS(model_name=Config.XTTS_MODEL, progress_bar=False, gpu=False)
    tts_routes.VITS = TTS(model_name=Config.VITS_MODEL, progress_bar=False, gpu=False)
    clone_routes.XTTS = tts_routes.XTTS

    # Register blueprints
    app.register_blueprint(tts_bp)
    app.register_blueprint(voice_bp)
    app.register_blueprint(clone_bp)

    logger.info("Voice synthesis app initialized successfully")
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host=Config.APP_HOST, port=Config.APP_PORT)