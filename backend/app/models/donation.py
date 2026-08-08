import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.base import Base

class Donation(Base):
    __tablename__ = "donations"

    donation_id = Column(Integer, primary_key=True, index=True)
    restaurant_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    food_type = Column(String(100), nullable=False)
    quantity = Column(String(100), nullable=False)  # e.g., "10 kg", "25 portions"
    expiry_time = Column(DateTime, nullable=False)
    pickup_location = Column(String(255), nullable=False)
    status = Column(String(50), nullable=False, default="Available")  # e.g., Available, Claimed, Delivered
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    # Relationships
    restaurant = relationship("User", back_populates="donations")
    recommendation = relationship("Recommendation", back_populates="donation", uselist=False, cascade="all, delete-orphan")
    delivery = relationship("Delivery", back_populates="donation", uselist=False, cascade="all, delete-orphan")

    @property
    def destination(self) -> str:
        if self.recommendation and self.recommendation.ngo:
            return self.recommendation.ngo.name
        return "Hope Mission"
