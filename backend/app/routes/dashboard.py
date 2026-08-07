from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.middleware.auth import get_current_user
from app.schemas.dashboard import DashboardStatsResponse
from app.services.dashboard_service import get_dashboard_stats

router = APIRouter(
    prefix="/api/v1/dashboard",
    tags=["Dashboard Operations"]
)

@router.get(
    "/stats",
    response_model=DashboardStatsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Dashboard Statistics"
)
def dashboard_stats_route(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve statistics, metrics, and activity logs suitable for frontend charts.
    """
    user_id = int(current_user["sub"])
    role = current_user["role"]
    return get_dashboard_stats(db, user_id, role)
