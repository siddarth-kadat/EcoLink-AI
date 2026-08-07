
# pyrefly: ignore [missing-import]
from fastapi import FastAPI
from app.routes.donations import router as donation_router
from app.routes.recommendations import router as recommendation_router

app = FastAPI(title="EcoLink AI")

app.include_router(donation_router, prefix="/api/v1")
app.include_router(recommendation_router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "EcoLink AI Backend Running"}