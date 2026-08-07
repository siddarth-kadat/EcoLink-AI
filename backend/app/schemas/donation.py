from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from app.schemas.delivery import DeliveryResponse

class CreateDonationRequest(BaseModel):
    food_type: str
    quantity: int
    expiry_time: datetime
    pickup_location: str

class DonationResponse(BaseModel):
    donation_id: int = Field(alias="id")
    food_type: str
    quantity: int
    expiry_time: datetime
    pickup_location: str
    status: str

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True
    )

class DonationTrackResponse(BaseModel):
    donation_id: int = Field(alias="id")
    food_type: str
    quantity: int
    expiry_time: datetime
    pickup_location: str
    status: str
    delivery: Optional[DeliveryResponse] = None

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True
    )