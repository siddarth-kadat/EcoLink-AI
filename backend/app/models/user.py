from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database.base import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)  # Roles: Restaurant, NGO, Volunteer, Admin

    # Relationships
    donations = relationship("Donation", back_populates="restaurant", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="ngo", cascade="all, delete-orphan")
    deliveries = relationship("Delivery", back_populates="volunteer")
    ngo_profile = relationship("NGOProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
