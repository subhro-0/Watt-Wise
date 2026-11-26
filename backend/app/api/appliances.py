from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.appliance import ApplianceCreate, ApplianceUpdate, ApplianceResponse
from app.core.config import settings

router = APIRouter(prefix="/appliances", tags=["Appliances"])

# Initial in-memory storage (connected to DB in Part 5)
_APPLIANCES_DB = [
    {
        "id": "app-1",
        "name": "1.5 Ton Inverter AC (Living Room)",
        "category": "climate",
        "watts": 1450.0,
        "quantity": 1,
        "daily_hours": 6.0,
        "operating_schedule": "01:00 PM - 04:00 PM, 10:00 PM - 01:00 AM",
        "monthly_kwh": 261.0,
        "monthly_cost_inr": 1618.0,
        "monthly_co2_kg": 214.0,
    },
    {
        "id": "app-2",
        "name": "Double Door Frost-Free Refrigerator (340L)",
        "category": "cooling",
        "watts": 180.0,
        "quantity": 1,
        "daily_hours": 24.0,
        "operating_schedule": "Always On (~8 hrs compressor run)",
        "monthly_kwh": 43.2,
        "monthly_cost_inr": 268.0,
        "monthly_co2_kg": 35.4,
    },
    {
        "id": "app-3",
        "name": "BLDC Energy-Saving Ceiling Fans",
        "category": "cooling",
        "watts": 32.0,
        "quantity": 4,
        "daily_hours": 14.0,
        "operating_schedule": "Morning & Night",
        "monthly_kwh": 53.8,
        "monthly_cost_inr": 334.0,
        "monthly_co2_kg": 44.1,
    },
    {
        "id": "app-4",
        "name": "Storage Water Geyser (15 Litres)",
        "category": "utility",
        "watts": 2000.0,
        "quantity": 1,
        "daily_hours": 1.5,
        "operating_schedule": "06:30 AM - 08:00 AM",
        "monthly_kwh": 90.0,
        "monthly_cost_inr": 558.0,
        "monthly_co2_kg": 73.8,
    },
    {
        "id": "app-5",
        "name": "LED Lights (9W & 12W Array)",
        "category": "lighting",
        "watts": 120.0,
        "quantity": 1,
        "daily_hours": 7.0,
        "operating_schedule": "06:00 PM - 01:00 AM",
        "monthly_kwh": 25.2,
        "monthly_cost_inr": 156.0,
        "monthly_co2_kg": 20.7,
    },
    {
        "id": "app-6",
        "name": "55-inch 4K Smart TV",
        "category": "entertainment",
        "watts": 110.0,
        "quantity": 1,
        "daily_hours": 4.5,
        "operating_schedule": "07:30 PM - 12:00 AM",
        "monthly_kwh": 14.8,
        "monthly_cost_inr": 92.0,
        "monthly_co2_kg": 12.1,
    },
    {
        "id": "app-7",
        "name": "7kg Front Load Washing Machine",
        "category": "utility",
        "watts": 1800.0,
        "quantity": 1,
        "daily_hours": 0.8,
        "operating_schedule": "Alternate Days",
        "monthly_kwh": 21.6,
        "monthly_cost_inr": 134.0,
        "monthly_co2_kg": 17.7,
    },
    {
        "id": "app-8",
        "name": "Microwave Oven & Kitchen Mixer",
        "category": "kitchen",
        "watts": 1200.0,
        "quantity": 1,
        "daily_hours": 0.6,
        "operating_schedule": "Meal Prep",
        "monthly_kwh": 21.6,
        "monthly_cost_inr": 134.0,
        "monthly_co2_kg": 17.7,
    },
]

@router.get("", response_model=List[ApplianceResponse])
def get_all_appliances():
    return _APPLIANCES_DB

@router.post("", response_model=ApplianceResponse, status_code=201)
def create_appliance(app: ApplianceCreate):
    daily_kwh = (app.watts * app.quantity * app.daily_hours) / 1000.0
    monthly_kwh = round(daily_kwh * 30, 1)
    monthly_cost = round(monthly_kwh * 6.20, 1)
    monthly_co2 = round(monthly_kwh * settings.CEA_GRID_EMISSION_FACTOR, 1)

    new_item = {
        "id": f"app-{len(_APPLIANCES_DB) + 1}",
        "name": app.name,
        "category": app.category,
        "watts": app.watts,
        "quantity": app.quantity,
        "daily_hours": app.daily_hours,
        "operating_schedule": app.operating_schedule,
        "monthly_kwh": monthly_kwh,
        "monthly_cost_inr": monthly_cost,
        "monthly_co2_kg": monthly_co2,
    }
    _APPLIANCES_DB.append(new_item)
    return new_item

@router.put("/{app_id}", response_model=ApplianceResponse)
def update_appliance(app_id: str, app: ApplianceUpdate):
    for item in _APPLIANCES_DB:
        if item["id"] == app_id:
            if app.name is not None: item["name"] = app.name
            if app.category is not None: item["category"] = app.category
            if app.watts is not None: item["watts"] = app.watts
            if app.quantity is not None: item["quantity"] = app.quantity
            if app.daily_hours is not None: item["daily_hours"] = app.daily_hours
            if app.operating_schedule is not None: item["operating_schedule"] = app.operating_schedule

            # Recalculate metrics
            daily_kwh = (item["watts"] * item["quantity"] * item["daily_hours"]) / 1000.0
            item["monthly_kwh"] = round(daily_kwh * 30, 1)
            item["monthly_cost_inr"] = round(item["monthly_kwh"] * 6.20, 1)
            item["monthly_co2_kg"] = round(item["monthly_kwh"] * settings.CEA_GRID_EMISSION_FACTOR, 1)
            return item

    raise HTTPException(status_code=404, detail="Appliance not found")

@router.delete("/{app_id}", status_code=204)
def delete_appliance(app_id: str):
    global _APPLIANCES_DB
    _APPLIANCES_DB = [a for a in _APPLIANCES_DB if a["id"] != app_id]
    return None
