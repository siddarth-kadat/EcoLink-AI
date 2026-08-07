from pydantic import BaseModel
from typing import List

class TrendItem(BaseModel):
    name: str
    pounds: int

class ActivityItem(BaseModel):
    id: str
    type: str
    title: str
    desc: str
    time: str

class DashboardStatsResponse(BaseModel):
    mealsDonated: str
    activeDonations: str
    deliverySuccess: str
    matchSuccess: str
    trend: List[TrendItem]
    activities: List[ActivityItem]
