"""
Authentication Business Logic Service for EcoLink AI.

This module handles:
1. User retrieval by email identifier from the database.
2. Plain-text password verification against bcrypt hashes.
3. User authentication (credential verification).
4. Generating JWT login access tokens using the auth middleware helper.

Contains ONLY business logic. No API routes or middleware definitions.
"""

from datetime import timedelta
from typing import Optional, Union

from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.middleware.auth import create_access_token
from app.models.user import User

# Passlib CryptContext configured for bcrypt password verification
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """
    Retrieve a User object from the database by email address.

    Returns the User object if found, or None if the user does not exist.
    """
    return db.query(User).filter(User.email == email).first()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain-text password against a stored bcrypt hashed password.

    Returns True if the password matches, False otherwise.
    Does NOT generate password hashes.
    """
    return pwd_context.verify(plain_password, hashed_password)


def authenticate_user(
    db: Session,
    email: str,
    password: str
) -> Optional[User]:
    """
    Authenticate a user by verifying email and password credentials.

    1. Retrieves the user by email.
    2. Verifies the provided plain-text password against the stored hash.
    
    Returns the authenticated User object if successful, or None if authentication fails.
    """
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.password):
        return None
    return user


def generate_login_token(
    user: Union[User, str, int],
    role: Optional[str] = None,
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Generate a JWT login access token using create_access_token from app.middleware.auth.

    Includes user_id and role claims in the JWT payload.
    Accepts either a User model instance or explicit user_id and role arguments.
    """
    if isinstance(user, User):
        user_id = user.user_id
        user_role = user.role
    else:
        user_id = user
        user_role = role

    if not user_role:
        raise ValueError("User role must be provided to generate login token.")

    return create_access_token(
        user_id=user_id,
        role=user_role,
        expires_delta=expires_delta
    )
