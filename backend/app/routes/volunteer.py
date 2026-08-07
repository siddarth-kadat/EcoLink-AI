from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.middleware.auth import require_roles, ROLE_VOLUNTEER
from app.schemas.delivery import DeliveryResponse
from app.services.volunteer_service import (
    get_available_deliveries,
    get_volunteer_deliveries,
    accept_delivery_task,
    confirm_pickup,
    confirm_delivery
)

router = APIRouter(
    prefix="/api/v1/volunteer",
    tags=["Volunteer Operations"],
    dependencies=[Depends(require_roles(ROLE_VOLUNTEER))]
)

@router.get(
    "/deliveries/available",
    response_model=List[DeliveryResponse],
    status_code=status.HTTP_200_OK,
    summary="Get Available Deliveries"
)
def available_deliveries_route(db: Session = Depends(get_db)):
    """
    Retrieve all delivery tasks that are unclaimed and pending assignment.
    """
    return get_available_deliveries(db)

@router.get(
    "/deliveries/my",
    response_model=List[DeliveryResponse],
    status_code=status.HTTP_200_OK,
    summary="Get My Assigned Deliveries"
)
def my_deliveries_route(
    current_user: dict = Depends(require_roles(ROLE_VOLUNTEER)),
    db: Session = Depends(get_db)
):
    """
    Retrieve all delivery tasks currently assigned to the logged-in Volunteer.
    """
    volunteer_id = int(current_user["sub"])
    return get_volunteer_deliveries(db, volunteer_id)

@router.post(
    "/deliveries/{delivery_id}/accept",
    response_model=DeliveryResponse,
    status_code=status.HTTP_200_OK,
    summary="Claim Delivery Task"
)
def accept_task_route(
    delivery_id: int,
    current_user: dict = Depends(require_roles(ROLE_VOLUNTEER)),
    db: Session = Depends(get_db)
):
    """
    Accept/Claim an unclaimed delivery task.
    """
    volunteer_id = int(current_user["sub"])
    return accept_delivery_task(db, delivery_id, volunteer_id)

@router.post(
    "/deliveries/{delivery_id}/pickup",
    response_model=DeliveryResponse,
    status_code=status.HTTP_200_OK,
    summary="Confirm Food Pickup"
)
def pickup_confirm_route(
    delivery_id: int,
    current_user: dict = Depends(require_roles(ROLE_VOLUNTEER)),
    db: Session = Depends(get_db)
):
    """
    Record food pickup from the source restaurant. Transitions donation status to 'Picked Up'.
    """
    volunteer_id = int(current_user["sub"])
    return confirm_pickup(db, delivery_id, volunteer_id)

@router.post(
    "/deliveries/{delivery_id}/deliver",
    response_model=DeliveryResponse,
    status_code=status.HTTP_200_OK,
    summary="Confirm Food Delivery"
)
def delivery_confirm_route(
    delivery_id: int,
    current_user: dict = Depends(require_roles(ROLE_VOLUNTEER)),
    db: Session = Depends(get_db)
):
    """
    Record food delivery to the target NGO. Transitions donation status to 'Delivered'.
    """
    volunteer_id = int(current_user["sub"])
    return confirm_delivery(db, delivery_id, volunteer_id)
