import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.base import Base

class Recommendation(Base):
    __tablename__ = "recommendations"

    recommendation_id = Column(Integer, primary_key=True, index=True)
    donation_id = Column(Integer, ForeignKey("donations.donation_id", ondelete="CASCADE"), nullable=False)
    ngo_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    confidence_score = Column(Float, nullable=False)
    priority_score = Column(Float, nullable=False)
    delivery_risk = Column(String(100), nullable=False)  # e.g., "Low", "Medium", "High" or score
    recommendation_explanation = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    # Relationships
    donation = relationship("Donation", back_populates="recommendation")
    ngo = relationship("User", back_populates="recommendations")
