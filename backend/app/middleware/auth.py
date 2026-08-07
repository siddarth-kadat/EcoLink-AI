"""
JWT Authentication Middleware & Security Dependencies for EcoLink AI.

This module provides reusable FastAPI dependencies and utilities for:
1. Creating JWT access tokens using python-jose.
2. Verifying and decoding JWT tokens.
3. Extracting the current user's token payload via HTTPBearer.
4. Enforcing role-based authorization (RBAC) for API routes.
"""

from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional, Sequence, Union

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

from app.config.settings import settings

# Supported Application Roles
ROLE_RESTAURANT = "Restaurant"
ROLE_NGO = "NGO"
ROLE_VOLUNTEER = "Volunteer"
ROLE_ADMIN = "Admin"

SUPPORTED_ROLES = {ROLE_RESTAURANT, ROLE_NGO, ROLE_VOLUNTEER, ROLE_ADMIN}

# Reusable HTTPBearer security scheme instance
security = HTTPBearer()


def create_access_token(
    user_id: Union[str, int],
    role: str,
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create a signed JWT access token using python-jose.

    Claims included:
    - sub: user_id
    - role: user role
    - exp: expiration timestamp
    """
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    payload: Dict[str, Any] = {
        "sub": str(user_id),
        "role": role,
        "exp": expire,
    }

    encoded_jwt: str = jwt.encode(
        payload,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM
    )
    return encoded_jwt


def decode_access_token(token: str) -> Dict[str, Any]:
    """
    Verify token signature, validate expiration, and decode the payload.

    Raises HTTP 401 Unauthorized for invalid or expired tokens.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload: Dict[str, Any] = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )
        user_id: Optional[str] = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        return payload
    except JWTError as exc:
        raise credentials_exception from exc


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> Dict[str, Any]:
    """
    FastAPI dependency that extracts the Bearer token from the Authorization header,
    verifies it, and returns the decoded token payload dictionary.

    Does NOT perform any database queries.
    """
    token = credentials.credentials
    return decode_access_token(token)


class RoleChecker:
    """
    Reusable role authorization dependency class.
    Checks whether the authenticated user has one of the allowed roles.
    Raises HTTP 403 Forbidden if the user lacks authorization.
    """
    def __init__(self, allowed_roles: Sequence[str]) -> None:
        invalid_roles = [role for role in allowed_roles if role not in SUPPORTED_ROLES]
        if invalid_roles:
            raise ValueError(
                f"Invalid role(s) requested: {', '.join(invalid_roles)}. "
                f"Supported roles are: {', '.join(sorted(SUPPORTED_ROLES))}"
            )
        self.allowed_roles = list(allowed_roles)

    def __call__(
        self,
        payload: Dict[str, Any] = Depends(get_current_user)
    ) -> Dict[str, Any]:
        user_role: Optional[str] = payload.get("role")
        if not user_role or user_role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted. Required role: {', '.join(self.allowed_roles)}"
            )
        return payload


def require_roles(*allowed_roles: str) -> RoleChecker:
    """
    Helper function to construct a RoleChecker dependency.

    Supported roles:
    - Restaurant
    - NGO
    - Volunteer
    - Admin

    Usage:
        @app.get("/admin-only", dependencies=[Depends(require_roles(ROLE_ADMIN))])
    """
    invalid_roles = [role for role in allowed_roles if role not in SUPPORTED_ROLES]
    if invalid_roles:
        raise ValueError(
            f"Invalid role(s) requested: {', '.join(invalid_roles)}. "
            f"Supported roles are: {', '.join(sorted(SUPPORTED_ROLES))}"
        )
    return RoleChecker(allowed_roles)
