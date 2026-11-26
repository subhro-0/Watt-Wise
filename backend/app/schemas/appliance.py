from pydantic import BaseModel, Field
from typing import Optional

class ApplianceBase(BaseModel):
    name: str
    category: str = "climate"
    watts: float
    quantity: int = 1
    daily_hours: float
    operating_schedule: Optional[str] = None

class ApplianceCreate(ApplianceBase):
    pass

class ApplianceUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    watts: Optional[float] = None
    quantity: Optional[int] = None
    daily_hours: Optional[float] = None
    operating_schedule: Optional[str] = None

class ApplianceResponse(ApplianceBase):
    id: str
    monthly_kwh: float
    monthly_cost_inr: float
    monthly_co2_kg: float

    class Config:
        from_attributes = True
