"""
Authentication API Routes for EcoLink AI.

This module exposes authentication endpoints:
- POST /api/v1/auth/login: Authenticates user credentials and returns a JWT access token.

Contains ONLY API route definitions. Business logic and database operations
are delegated to auth_service and database dependencies.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.auth import LoginRequest, LoginResponse
from app.services.auth_service import authenticate_user, generate_login_token

# Configure APIRouter for authentication endpoints
router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"]
)


@router.post(
    "/login",
    response_model=LoginResponse,
    status_code=status.HTTP_200_OK,
    summary="User Login",
    description="Authenticate user with email and password to retrieve a JWT access token."
)
def login(
    payload: LoginRequest,
    db: Session = Depends(get_db)
) -> LoginResponse:
    """
    Authenticate user credentials and return a Bearer JWT access token.

    Raises HTTP 401 Unauthorized with "Invalid email or password" if verification fails.
    """
    user = authenticate_user(db=db, email=payload.email, password=payload.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = generate_login_token(user)
    return LoginResponse(access_token=access_token, token_type="bearer")
