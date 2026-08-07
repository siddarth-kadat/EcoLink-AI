# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.donation import CreateDonationRequest
from app.services.donation_service import create_donation
from app.services.recommendation_service import get_recommendation

router = APIRouter()


@router.post("/recommendations/generate")
def generate_recommendation_route(donation_req: CreateDonationRequest, db: Session = Depends(get_db)):
    # 1. Persist the donation to satisfy the recommendation foreign key requirement
    donation = create_donation(donation_req, db)

    # 2. Generate and persist the AI recommendation record
    return get_recommendation(donation, db)
