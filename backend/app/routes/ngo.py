from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.middleware.auth import require_roles, ROLE_NGO
from app.schemas.recommendation import RecommendationResponse
from app.schemas.delivery import AcceptRecommendationResponse
from app.services.ngo_service import get_ngo_recommendations, accept_recommendation

router = APIRouter(
    prefix="/api/v1/ngo",
    tags=["NGO Operations"],
    dependencies=[Depends(require_roles(ROLE_NGO))]
)

@router.get(
    "/recommendations",
    response_model=List[RecommendationResponse],
    status_code=status.HTTP_200_OK,
    summary="Get NGO Recommendations"
)
def get_recommendations_route(
    current_user: dict = Depends(require_roles(ROLE_NGO)),
    db: Session = Depends(get_db)
):
    """
    Retrieve all compatibility recommendations matching the logged-in NGO's ID.
    """
    ngo_id = int(current_user["sub"])
    return get_ngo_recommendations(db, ngo_id)

@router.post(
    "/recommendations/{recommendation_id}/accept",
    response_model=AcceptRecommendationResponse,
    status_code=status.HTTP_200_OK,
    summary="Accept Recommendation"
)
def accept_recommendation_route(
    recommendation_id: int,
    current_user: dict = Depends(require_roles(ROLE_NGO)),
    db: Session = Depends(get_db)
):
    """
    Accept an AI recommendation. Updates donation status to Claimed and creates a delivery record.
    """
    ngo_id = int(current_user["sub"])
    delivery = accept_recommendation(db, recommendation_id, ngo_id)
    return AcceptRecommendationResponse(
        success=True,
        message="Recommendation accepted successfully",
        delivery_id=delivery.delivery_id,
        donation_id=delivery.donation_id
    )
