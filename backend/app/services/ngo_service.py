from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.recommendation import Recommendation
from app.models.donation import Donation
from app.models.delivery import Delivery

def get_ngo_recommendations(db: Session, ngo_id: int):
    """
    Retrieve all recommendation records for a specific NGO.
    """
    return db.query(Recommendation).filter(Recommendation.ngo_id == ngo_id).all()

def accept_recommendation(db: Session, recommendation_id: int, ngo_id: int):
    """
    Accepts an AI recommendation:
    - Verifies the recommendation exists and belongs to the NGO.
    - Verifies the associated donation is 'Available'.
    - Updates donation status to 'Claimed'.
    - Creates a new Delivery record.
    - Commits and returns the Delivery.
    """
    # 1. Fetch recommendation
    recommendation = db.query(Recommendation).filter(
        Recommendation.recommendation_id == recommendation_id
    ).first()
    
    if not recommendation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recommendation not found"
        )
        
    if recommendation.ngo_id != ngo_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This recommendation belongs to another NGO"
        )

    # 2. Fetch and check donation status
    donation = recommendation.donation
    if not donation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donation not found"
        )
        
    if donation.status != "Available":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Donation is already {donation.status}"
        )

    # 3. Update donation status
    donation.status = "Claimed"

    # 4. Create delivery record
    delivery = Delivery(
        donation_id=donation.donation_id,
        volunteer_id=None,
        pickup_status="Pending",
        delivery_status="Pending"
    )
    
    db.add(delivery)
    db.commit()
    db.refresh(delivery)
    
    return delivery
