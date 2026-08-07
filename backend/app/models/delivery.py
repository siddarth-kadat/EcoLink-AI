from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.base import Base

class Delivery(Base):
    __tablename__ = "deliveries"

    delivery_id = Column(Integer, primary_key=True, index=True)
    donation_id = Column(Integer, ForeignKey("donations.donation_id", ondelete="CASCADE"), nullable=False)
    volunteer_id = Column(Integer, ForeignKey("users.user_id", ondelete="SET NULL"), nullable=True)  # Nullable if not assigned yet
    pickup_status = Column(String(50), nullable=False, default="Pending")  # e.g., Pending, Picked Up
    delivery_status = Column(String(50), nullable=False, default="Pending")  # e.g., Pending, Delivered, Cancelled
    pickup_time = Column(DateTime, nullable=True)
    delivery_time = Column(DateTime, nullable=True)

    # Relationships
    donation = relationship("Donation", back_populates="delivery")
    volunteer = relationship("User", back_populates="deliveries")
