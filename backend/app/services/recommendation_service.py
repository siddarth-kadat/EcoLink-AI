from sqlalchemy.orm import Session, joinedload
from app.models.user import User
from app.models.donation import Donation
from app.models.recommendation import Recommendation
from app.ai.recommendation_engine import generate_recommendation


def get_recommendation(donation: Donation, db: Session):
    """
    Retrieves AI recommendations for a food donation:
    - Queries all NGOs with NGOProfile eagerly loaded.
    - Queries volunteers.
    - Calls recommendation_engine to compute Top 2 recommendations.
    - Persists ONLY the highest-ranked (best) recommendation into PostgreSQL.
    - Returns the Top 2 recommendations payload.
    """
    # 1. Fetch all NGOs with NGOProfile loaded
    ngos = db.query(User).options(joinedload(User.ngo_profile)).filter(User.role == "NGO").all()

    # 2. Fetch volunteers
    volunteers = db.query(User).filter(User.role == "Volunteer").all()

    # 3. Pass donation, NGOs, and volunteers to AI engine
    ai_result = generate_recommendation(
        donation=donation,
        ngos=ngos,
        volunteers=volunteers
    )

    recommendations_list = ai_result.get("recommendations", [])

    if recommendations_list:
        # STEP 6: Persist all matching recommendations into PostgreSQL
        for rec in recommendations_list:
            top_ngo = rec.get("_ngo_obj")
            ngo_id = getattr(top_ngo, "user_id", None) if top_ngo else (ngos[0].user_id if ngos else 1)

            explanations = rec.get("recommendation_explanation", [])
            explanation_text = "; ".join(explanations) if isinstance(explanations, list) else str(explanations)

            db_recommendation = Recommendation(
                donation_id=donation.donation_id,
                ngo_id=ngo_id,
                confidence_score=float(rec["confidence_score"]),
                priority_score=float(rec["priority_score"]),
                delivery_risk=str(rec["delivery_risk"]),
                recommendation_explanation=explanation_text
            )
            db.add(db_recommendation)
        db.commit()

    # Clean up internal metadata fields before returning API response
    for rec in recommendations_list:
        rec.pop("_ngo_obj", None)

    return ai_result
