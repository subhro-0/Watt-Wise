import random
from typing import List, Dict, Any
from app.core.config import settings

def generate_hourly_telemetry() -> List[Dict[str, Any]]:
    """
    Generates authentic 24-hour household energy readings with realistic 
    morning and evening load peaks.
    """
    hours = [
        ("12 AM", 0.45), ("02 AM", 0.42), ("04 AM", 0.38),
        ("06 AM", 0.85), ("08 AM", 2.40), ("10 AM", 1.15),
        ("12 PM", 1.30), ("02 PM", 2.10), ("04 PM", 1.60),
        ("06 PM", 1.90), ("08 PM", 2.80), ("10 PM", 2.10),
    ]

    results = []
    for hr, kwh in hours:
        # Approximate unit cost based on average rate ~ ₹5.20
        cost = round(kwh * 5.20, 2)
        carbon = round(kwh * settings.CEA_GRID_EMISSION_FACTOR, 2)
        results.append({
            "hour": hr,
            "kwh": kwh,
            "cost_inr": cost,
            "carbon_kg": carbon
        })
    return results

def generate_daily_telemetry() -> List[Dict[str, Any]]:
    """
    Generates past 7 days daily household telemetry (kWh, ₹, kg CO2).
    """
    days = [
        ("16 Nov", "Mon", 17.8),
        ("17 Nov", "Tue", 18.4),
        ("18 Nov", "Wed", 16.9),
        ("19 Nov", "Thu", 17.5),
        ("20 Nov", "Fri", 19.2),
        ("21 Nov", "Sat", 21.5),
        ("22 Nov", "Sun", 22.4),
    ]

    results = []
    for dt, day_name, kwh in days:
        cost = round(kwh * 5.20, 1)
        carbon = round(kwh * settings.CEA_GRID_EMISSION_FACTOR, 1)
        results.append({
            "date": dt,
            "day": day_name,
            "kwh": kwh,
            "cost_inr": cost,
            "carbon_kg": carbon
        })
    return results

def generate_monthly_telemetry() -> List[Dict[str, Any]]:
    """
    Generates 6-month historical consumption data.
    """
    months = [
        ("Jun", 680, 4420, 30),
        ("Jul", 640, 4120, 40),
        ("Aug", 590, 3740, 50),
        ("Sep", 550, 3450, 40),
        ("Oct", 480, 2880, 70),
        ("Nov", 531, 3294, 49),
    ]

    results = []
    for mo, kwh, cost, saved in months:
        carbon = round(kwh * settings.CEA_GRID_EMISSION_FACTOR, 1)
        results.append({
            "month": mo,
            "kwh": kwh,
            "cost_inr": cost,
            "carbon_kg": carbon,
            "saved_kwh": saved
        })
    return results
