from typing import List, Optional
from fastapi import APIRouter, Depends, status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.middleware.auth import require_roles, decode_access_token, ROLE_RESTAURANT, ROLE_VOLUNTEER
from app.schemas.donation import CreateDonationRequest, DonationResponse, DonationTrackResponse
from app.services.donation_service import create_donation, get_restaurant_donations, track_donation_status

router = APIRouter()
security_optional = HTTPBearer(auto_error=False)

def get_current_user_optional(credentials = Depends(security_optional)):
    if not credentials:
        return None
    try:
        return decode_access_token(credentials.credentials)
    except Exception:
        return None

@router.post("/donations", response_model=DonationResponse, status_code=status.HTTP_201_CREATED)
def add_donation(
    donation: CreateDonationRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_optional)
):
    """
    Create a new donation. Authenticated Restaurant users are linked;
    unauthenticated requests are supported for backwards compatibility.
    """
    restaurant_id = int(current_user["sub"]) if current_user else None
    return create_donation(donation, db, restaurant_id)

@router.get("/donations/history", response_model=List[DonationResponse])
def get_history(
    current_user: dict = Depends(require_roles(ROLE_RESTAURANT, ROLE_VOLUNTEER)),
    db: Session = Depends(get_db)
):
    """
    Retrieve historical donation listings registered by Restaurant or assigned Volunteer.
    """
    user_id = int(current_user["sub"])
    role = current_user["role"]
    if role == "Volunteer":
        from app.models.delivery import Delivery
        deliveries = db.query(Delivery).filter(Delivery.volunteer_id == user_id).all()
        return [d.donation for d in deliveries if d.donation]
    return get_restaurant_donations(db, user_id)

@router.get("/donations/{donation_id}/track", response_model=DonationTrackResponse)
def get_tracking(
    donation_id: int,
    current_user: dict = Depends(require_roles(ROLE_RESTAURANT, ROLE_VOLUNTEER)),
    db: Session = Depends(get_db)
):
    """
    Track delivery dispatch operations for a specific donation.
    """
    user_id = int(current_user["sub"])
    role = current_user["role"]
    return track_donation_status(db, donation_id, user_id, role)