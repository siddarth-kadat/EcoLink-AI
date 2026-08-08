# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.donation import CreateDonationRequest
from app.services.donation_service import create_donation
from app.services.recommendation_service import get_recommendation
from app.middleware.auth import decode_access_token

router = APIRouter()
security_optional = HTTPBearer(auto_error=False)

def get_current_user_optional(credentials = Depends(security_optional)):
    if not credentials:
        return None
    try:
        return decode_access_token(credentials.credentials)
    except Exception:
        return None

@router.post("/recommendations/generate")
def generate_recommendation_route(
    donation_req: CreateDonationRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_optional)
):
    # 1. Persist the donation to satisfy the recommendation foreign key requirement
    restaurant_id = int(current_user["sub"]) if current_user else None
    donation = create_donation(donation_req, db, restaurant_id)

    # 2. Generate and persist the AI recommendation record
    return get_recommendation(donation, db)
