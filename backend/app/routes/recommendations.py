# pyrefly: ignore [missing-import]
from fastapi import APIRouter
from app.schemas.donation import CreateDonationRequest
from app.services.recommendation_service import get_recommendation

router = APIRouter()


@router.post("/recommendations/generate")
def generate_recommendation_route(donation: CreateDonationRequest):
    return get_recommendation(donation)
