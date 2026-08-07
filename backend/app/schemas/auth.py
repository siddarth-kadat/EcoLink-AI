"""
Pydantic Schemas for Authentication Data Transfer Objects (DTOs) in EcoLink AI.

This module defines request and response schemas for authentication workflows.
Contains ONLY Pydantic validation models.
"""

from pydantic import BaseModel, ConfigDict, EmailStr


class LoginRequest(BaseModel):
    """
    Schema for user login credentials request payload.
    """
    email: EmailStr
    password: str

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "email": "user@example.com",
                "password": "secretpassword123"
            }
        }
    )


class LoginResponse(BaseModel):
    """
    Schema for authentication response containing the JWT access token.
    """
    access_token: str
    token_type: str = "bearer"

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer"
            }
        }
    )
