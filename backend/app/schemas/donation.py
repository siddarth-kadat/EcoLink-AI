from datetime import datetime
from pydantic import BaseModel

class CreateDonationRequest(BaseModel):
    food_type: str
    quantity: int
    expiry_time: datetime
    pickup_location: str

class DonationResponse(BaseModel):
    id: int
    food_type: str
    quantity: int
    expiry_time: datetime
    pickup_location: str
    status: str