import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.session import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    appliances = relationship("Appliance", back_populates="owner", cascade="all, delete-orphan")
    goals = relationship("Goal", back_populates="owner", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="owner", cascade="all, delete-orphan")

class Appliance(Base):
    __tablename__ = "appliances"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    name = Column(String, nullable=False)
    category = Column(String, default="climate")
    watts = Column(Float, nullable=False)
    quantity = Column(Integer, default=1)
    daily_hours = Column(Float, nullable=False)
    operating_schedule = Column(String, nullable=True)
    monthly_kwh = Column(Float, default=0.0)
    monthly_cost_inr = Column(Float, default=0.0)
    monthly_co2_kg = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="appliances")

class EnergyReading(Base):
    __tablename__ = "energy_readings"

    id = Column(String, primary_key=True, default=generate_uuid)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    hour_slot = Column(String, nullable=False)
    kwh = Column(Float, nullable=False)
    cost_inr = Column(Float, nullable=False)
    carbon_kg = Column(Float, nullable=False)

class Goal(Base):
    __tablename__ = "goals"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    title = Column(String, nullable=False)
    target_kwh = Column(Float, nullable=False)
    current_kwh = Column(Float, default=0.0)
    target_bill_inr = Column(Float, nullable=False)
    current_bill_inr = Column(Float, default=0.0)
    target_month = Column(String, nullable=False)
    achieved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="goals")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    type = Column(String, nullable=False) # threshold, appliance, projection, achievement
    severity = Column(String, default="medium") # high, medium, low, success
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    timestamp = Column(String, nullable=False)
    read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="alerts")
