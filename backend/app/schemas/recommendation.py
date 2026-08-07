from datetime import datetime
from pydantic import BaseModel
from typing import Optional
from app.schemas.donation import DonationResponse

class RecommendationResponse(BaseModel):
    recommendation_id: int
    donation_id: int
    ngo_id: int
    confidence_score: float
    priority_score: float
    delivery_risk: str
    recommendation_explanation: Optional[str] = None
    created_at: datetime
    donation: DonationResponse

    class Config:
        from_attributes = True
