from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class DeliveryResponse(BaseModel):
    delivery_id: int
    donation_id: int
    volunteer_id: Optional[int] = None
    pickup_status: str
    delivery_status: str
    pickup_time: Optional[datetime] = None
    delivery_time: Optional[datetime] = None

    class Config:
        from_attributes = True

class AcceptRecommendationResponse(BaseModel):
    success: bool
    message: str
    delivery_id: int
    donation_id: int
