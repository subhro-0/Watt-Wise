from pydantic import BaseModel
from typing import List, Optional

class HourlyTelemetry(BaseModel):
    hour: str
    kwh: float
    cost_inr: float
    carbon_kg: float

class DailyTelemetry(BaseModel):
    date: str
    day: str
    kwh: float
    cost_inr: float
    carbon_kg: float

class MonthlyTelemetry(BaseModel):
    month: str
    kwh: float
    cost_inr: float
    carbon_kg: float
    saved_kwh: float

class DashboardSummary(BaseModel):
    total_kwh: float
    estimated_bill_inr: float
    total_co2_kg: float
    energy_saved_pct: float
    trees_equivalent: int
    car_miles_equivalent: int
    primary_goal_progress_pct: float
    top_appliance_name: Optional[str] = None
    top_appliance_kwh: Optional[float] = None
    top_appliance_cost_inr: Optional[float] = None
