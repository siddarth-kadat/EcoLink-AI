from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional

class DonationBasicResponse(BaseModel):
    donation_id: int = Field(alias="id")
    food_type: str
    quantity: int
    expiry_time: datetime
    pickup_location: str
    status: str
    destination: Optional[str] = None

    class Config:
        from_attributes = True
        populate_by_name = True

class DeliveryResponse(BaseModel):
    delivery_id: int
    donation_id: int
    volunteer_id: Optional[int] = None
    pickup_status: str
    delivery_status: str
    pickup_time: Optional[datetime] = None
    delivery_time: Optional[datetime] = None
    donation: Optional[DonationBasicResponse] = None

    class Config:
        from_attributes = True

class AcceptRecommendationResponse(BaseModel):
    success: bool
    message: str
    delivery_id: int
    donation_id: int
