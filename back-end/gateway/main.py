from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from routes import watermark_routes, deepfake_routes, tts_routes, voice_cloning_routes

app = FastAPI(title="AI Gateway Service")

# CORS setup
origins = ["http://localhost:5173", "http://127.0.0.1:5173", "http://react-frontend"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # change to ["*"] for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(watermark_routes.router, prefix="/api/watermark", tags=["Watermarking"])
app.include_router(deepfake_routes.router, prefix="/api/deepfake", tags=["Deepfake Detection"])
app.include_router(tts_routes.router, prefix="/api/tts", tags=["Text-to-Speech"])
app.include_router(voice_cloning_routes.router, prefix="/api/voice_cloning", tags=["Voice Cloning"])