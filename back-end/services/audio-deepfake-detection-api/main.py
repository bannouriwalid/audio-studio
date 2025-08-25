from flask import Flask
from flask_cors import CORS
from routes.detect_routes import detect_bp
from routes.history_routes import history_bp
from config import Config
from utils.logger import logger

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Register routes
    app.register_blueprint(detect_bp)
    app.register_blueprint(history_bp)

    return app

app = create_app()

if __name__ == "__main__":
    logger.info(f"Starting server on {Config.APP_HOST}:{Config.APP_PORT}")
    app.run(host=Config.APP_HOST, port=Config.APP_PORT)
