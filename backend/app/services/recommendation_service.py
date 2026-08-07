from sqlalchemy.orm import Session
from app.models.user import User
from app.models.donation import Donation
from app.models.recommendation import Recommendation
from app.ai.recommendation_engine import generate_recommendation


def get_recommendation(donation: Donation, db: Session):
    """
    Generates an AI recommendation for a food donation and persists the result into PostgreSQL.
    """
    # 1. Query NGOs from PostgreSQL database
    ngos = db.query(User).filter(User.role == "NGO").all()
    if not ngos:
        default_ngo = User(
            name="Default Food Rescue NGO",
            email="ngo@ecolink.ai",
            password="hashedpassword123",
            role="NGO"
        )
        db.add(default_ngo)
        db.commit()
        db.refresh(default_ngo)
        ngos = [default_ngo]

    # 2. Query Volunteers from PostgreSQL database
    volunteers = db.query(User).filter(User.role == "Volunteer").all()
    if not volunteers:
        default_volunteer = User(
            name="Default Volunteer",
            email="volunteer@ecolink.ai",
            password="hashedpassword123",
            role="Volunteer"
        )
        db.add(default_volunteer)
        db.commit()
        db.refresh(default_volunteer)
        volunteers = [default_volunteer]

    selected_ngo = ngos[0]

    # 3. Call AI recommendation engine
    ai_result = generate_recommendation(
        donation=donation,
        ngos=ngos,
        volunteers=volunteers
    )

    # Convert explanation list to text format for database storage if needed
    explanation = ai_result.get("recommendation_explanation")
    if isinstance(explanation, list):
        explanation_text = "; ".join(explanation)
    else:
        explanation_text = str(explanation)

    # 4. Create Recommendation SQLAlchemy model instance
    db_recommendation = Recommendation(
        donation_id=donation.donation_id,
        ngo_id=selected_ngo.user_id,
        confidence_score=float(ai_result.get("confidence_score", 0.85)),
        priority_score=float(ai_result.get("priority_score", 0.90)),
        delivery_risk=str(ai_result.get("delivery_risk", "Low")),
        recommendation_explanation=explanation_text
    )

    # 5. Save recommendation record into PostgreSQL
    db.add(db_recommendation)
    db.commit()
    db.refresh(db_recommendation)

    return db_recommendation
