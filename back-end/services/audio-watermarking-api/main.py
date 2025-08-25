from fastapi import FastAPI
from routes import router
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

APP_NAME = os.getenv("APP_NAME", "Audio Watermarking")
APP_PORT = int(os.getenv("APP_PORT", 8000))

app = FastAPI(title=APP_NAME)

app.include_router(router, prefix="/api/watermark", tags=["Watermarking"])

origins = [
    f"http://localhost:{APP_PORT}",
    f"http://127.0.0.1:{APP_PORT}"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=APP_PORT, reload=True)