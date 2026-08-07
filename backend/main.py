"""
Main application entry point for EcoLink AI API.

This module initializes the FastAPI application, registers API routes,
and exposes the primary health check endpoint.
"""

from typing import Dict

from fastapi import FastAPI

from app.routes.auth import router as auth_router

# Create and configure the FastAPI application instance
app = FastAPI(
    title="EcoLink AI API",
    version="1.0.0"
)

# Register API routers
app.include_router(auth_router)


@app.get("/", summary="Health Check")
def health_check() -> Dict[str, str]:
    """
    Root health check endpoint to verify that the API is running.
    """
    return {"message": "EcoLink AI API is running"}
