# pyrefly: ignore [missing-import]
from fastapi import FastAPI
from app.routes.donations import router as donation_router

app = FastAPI(title="EcoLink AI")

app.include_router(donation_router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "EcoLink AI Backend Running"}