from pydantic import BaseModel

class GoalCreate(BaseModel):
    title: str
    target_kwh: float
    target_bill_inr: float
    target_month: str

class GoalResponse(GoalCreate):
    id: str
    current_kwh: float
    current_bill_inr: float
    achieved: bool

    class Config:
        from_attributes = True

class AlertResponse(BaseModel):
    id: str
    type: str
    severity: str
    title: str
    message: str
    timestamp: str
    read: bool

    class Config:
        from_attributes = True

class AIChatRequest(BaseModel):
    query: str

class AIChatResponse(BaseModel):
    reply: str
    grounded_kwh: float
    grounded_bill_inr: float
    grounded_co2_kg: float
