from typing import List
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.middleware.auth import require_roles, ROLE_NGO
from app.schemas.recommendation import RecommendationResponse
from app.schemas.delivery import AcceptRecommendationResponse
from app.services.ngo_service import get_ngo_recommendations, accept_recommendation
from app.models.recommendation import Recommendation

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

@router.post(
    "/donations/{donation_id}/distribute",
    status_code=status.HTTP_200_OK,
    summary="Distribute Recovered Supplies"
)
def distribute_supplies_route(
    donation_id: int,
    current_user: dict = Depends(require_roles(ROLE_NGO)),
    db: Session = Depends(get_db)
):
    """
    Distribute recovered donation supplies to the public. Sets donation status to 'Distributed'.
    """
    ngo_id = int(current_user["sub"])
    recommendation = db.query(Recommendation).filter(
        Recommendation.donation_id == donation_id,
        Recommendation.ngo_id == ngo_id
    ).first()
    if not recommendation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donation match not found for this NGO"
        )
        
    donation = recommendation.donation
    if not donation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donation not found"
        )
        
    if donation.status != "Delivered":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Cannot distribute a donation that is {donation.status}"
        )
        
    donation.status = "Distributed"
    db.commit()
    return {"success": True, "message": "Donation supplies distributed successfully"}

@router.post(
    "/donations/{donation_id}/receive",
    status_code=status.HTTP_200_OK,
    summary="Mark Donation as Received"
)
def receive_supplies_route(
    donation_id: int,
    current_user: dict = Depends(require_roles(ROLE_NGO)),
    db: Session = Depends(get_db)
):
    """
    Mark a donation as received/delivered directly by the NGO (for simulation/testing).
    """
    ngo_id = int(current_user["sub"])
    recommendation = db.query(Recommendation).filter(
        Recommendation.donation_id == donation_id,
        Recommendation.ngo_id == ngo_id
    ).first()
    if not recommendation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donation match not found for this NGO"
        )
        
    donation = recommendation.donation
    if not donation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donation not found"
        )
        
    donation.status = "Delivered"
    if donation.delivery:
        donation.delivery.delivery_status = "Delivered"
        donation.delivery.pickup_status = "Picked Up"
        
    db.commit()
    return {"success": True, "message": "Donation marked as Delivered (Received)"}
