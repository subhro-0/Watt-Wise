from typing import Dict, Any
from app.core.config import settings

def calculate_carbon_footprint(kwh_units: float, custom_factor: float = None) -> Dict[str, Any]:
    factor = custom_factor if custom_factor is not None else settings.CEA_GRID_EMISSION_FACTOR
    
    total_co2_kg = round(max(0.0, kwh_units) * factor, 1)
    trees_required = round(total_co2_kg / settings.ANNUAL_TREE_ABSORPTION_KG)
    car_miles = round(total_co2_kg / settings.VEHICLE_EMISSION_FACTOR_KG)
    car_km = round(car_miles * 1.609)

    return {
        "kwh_units": round(kwh_units, 1),
        "grid_emission_factor_kg_per_kwh": factor,
        "total_co2_kg": total_co2_kg,
        "trees_required_to_offset": trees_required,
        "vehicle_miles_equivalent": car_miles,
        "vehicle_km_equivalent": car_km,
        "source": "Central Electricity Authority (CEA) India 2024 Baseline"
    }
