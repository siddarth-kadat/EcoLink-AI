# pyrefly: ignore [missing-import]
from typing import Dict
from fastapi import FastAPI

from app.routes.donations import router as donation_router
from app.routes.recommendations import router as recommendation_router
from app.routes.auth import router as auth_router

app = FastAPI(
    title="EcoLink AI API",
    version="1.0.0"
)

# Register API routers
app.include_router(donation_router, prefix="/api/v1")
app.include_router(recommendation_router, prefix="/api/v1")
app.include_router(auth_router)


@app.get("/", summary="Health Check")
def health_check() -> Dict[str, str]:
    """
    Root health check endpoint to verify that the API is running.
    """
    return {"message": "EcoLink AI API is running"}
