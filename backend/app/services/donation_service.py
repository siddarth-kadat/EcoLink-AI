from sqlalchemy.orm import Session
from app.models.donation import Donation
from app.models.user import User
from app.schemas.donation import CreateDonationRequest


def create_donation(donation: CreateDonationRequest, db: Session):
    """
    Creates and persists a new Donation record into PostgreSQL using SQLAlchemy.
    """
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

    # Create the SQLAlchemy Donation object
    db_donation = Donation(
        restaurant_id=restaurant.user_id,
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
