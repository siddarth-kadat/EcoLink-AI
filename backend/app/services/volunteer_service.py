import datetime
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.delivery import Delivery
from app.models.donation import Donation

def get_available_deliveries(db: Session):
    """
    Retrieve all delivery tasks that are pending and have no volunteer assigned yet.
    """
    return db.query(Delivery).filter(
        Delivery.volunteer_id == None,
        Delivery.delivery_status == "Pending"
    ).all()

def get_volunteer_deliveries(db: Session, volunteer_id: int):
    """
    Retrieve all delivery tasks assigned to a specific volunteer.
    """
    return db.query(Delivery).filter(Delivery.volunteer_id == volunteer_id).all()

def accept_delivery_task(db: Session, delivery_id: int, volunteer_id: int):
    """
    Claims a delivery task for the logged-in volunteer.
    """
    delivery = db.query(Delivery).filter(Delivery.delivery_id == delivery_id).first()
    if not delivery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Delivery task not found"
        )
        
    if delivery.volunteer_id is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Delivery task has already been claimed by another volunteer"
        )
        
    delivery.volunteer_id = volunteer_id
    db.commit()
    db.refresh(delivery)
    return delivery

def confirm_pickup(db: Session, delivery_id: int, volunteer_id: int):
    """
    Confirms that the volunteer has picked up the food from the restaurant.
    """
    delivery = db.query(Delivery).filter(
        Delivery.delivery_id == delivery_id,
        Delivery.volunteer_id == volunteer_id
    ).first()
    
    if not delivery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Delivery task not found or not assigned to you"
        )
        
    if delivery.pickup_status == "Picked Up":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Donation has already been picked up"
        )
        
    delivery.pickup_status = "Picked Up"
    delivery.pickup_time = datetime.datetime.utcnow()
    
    # Update associated donation status
    if delivery.donation:
        delivery.donation.status = "Picked Up"
        
    db.commit()
    db.refresh(delivery)
    return delivery

def confirm_delivery(db: Session, delivery_id: int, volunteer_id: int):
    """
    Confirms that the volunteer has delivered the food to the NGO.
    """
    delivery = db.query(Delivery).filter(
        Delivery.delivery_id == delivery_id,
        Delivery.volunteer_id == volunteer_id
    ).first()
    
    if not delivery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Delivery task not found or not assigned to you"
        )
        
    if delivery.pickup_status != "Picked Up":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot confirm delivery before pickup has been completed"
        )
        
    if delivery.delivery_status == "Delivered":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Donation has already been delivered"
        )
        
    delivery.delivery_status = "Delivered"
    delivery.delivery_time = datetime.datetime.utcnow()
    
    # Update associated donation status
    if delivery.donation:
        delivery.donation.status = "Delivered"
        
    db.commit()
    db.refresh(delivery)
    return delivery
