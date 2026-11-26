from pydantic import BaseModel
from typing import List, Optional

class SlabDetail(BaseModel):
    slab: str
    units: float
    rate: float
    amount: float

class BillEstimateRequest(BaseModel):
    kwh_units: float
    fixed_charge_inr: Optional[float] = None
    tax_pct: Optional[float] = None

class BillEstimateResponse(BaseModel):
    kwh_units: float
    energy_charges_inr: float
    fixed_charges_inr: float
    electricity_duty_inr: float
    total_bill_inr: float
    effective_rate_per_unit_inr: float
    slab_breakdown: List[SlabDetail]
