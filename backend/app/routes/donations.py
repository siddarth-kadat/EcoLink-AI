# pyrefly: ignore [missing-import]
from fastapi import APIRouter
from app.schemas.donation import CreateDonationRequest
from app.services.donation_service import create_donation

router = APIRouter()

@router.post("/donations")
def add_donation(donation: CreateDonationRequest):
    return create_donation(donation)