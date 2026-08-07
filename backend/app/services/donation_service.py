from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.donation import Donation
from app.models.user import User
from app.schemas.donation import CreateDonationRequest


def create_donation(donation: CreateDonationRequest, db: Session, restaurant_id: Optional[int] = None):
    """
    Creates and persists a new Donation record into PostgreSQL using SQLAlchemy.
    If no restaurant_id is provided, it fallbacks to retrieve/seed a default one.
    """
    if not restaurant_id:
        # Retrieve an existing Restaurant user or seed a default one for the foreign key
        restaurant = db.query(User).filter(User.role == "Restaurant").first()
        if not restaurant:
            restaurant = User(
                name="EcoLink Partner Restaurant",
                email="restaurant@ecolink.ai",
                password="hashedpassword123",
                role="Restaurant"
            )
            db.add(restaurant)
            db.commit()
            db.refresh(restaurant)
        restaurant_id = restaurant.user_id

    # Create the SQLAlchemy Donation object
    db_donation = Donation(
        restaurant_id=restaurant_id,
        food_type=donation.food_type,
        quantity=str(donation.quantity),
        expiry_time=donation.expiry_time,
        pickup_location=donation.pickup_location,
        status="Available"
    )

    # Persist the object into PostgreSQL
    db.add(db_donation)
    db.commit()
    db.refresh(db_donation)

    return db_donation


def get_restaurant_donations(db: Session, restaurant_id: int):
    """
    Retrieve all donations created by a specific restaurant user.
    """
    return db.query(Donation).filter(Donation.restaurant_id == restaurant_id).all()


def track_donation_status(db: Session, donation_id: int, restaurant_id: int):
    """
    Retrieves the donation and its nested delivery tracking details.
    """
    donation = db.query(Donation).filter(
        Donation.donation_id == donation_id,
        Donation.restaurant_id == restaurant_id
    ).first()

    if not donation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donation not found or access denied"
        )
    return donation
