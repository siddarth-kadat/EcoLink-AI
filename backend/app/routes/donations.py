# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.donation import CreateDonationRequest
from app.services.donation_service import create_donation

router = APIRouter()


@router.post("/donations")
def add_donation(donation: CreateDonationRequest, db: Session = Depends(get_db)):
    return create_donation(donation, db)