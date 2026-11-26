from typing import List, Dict, Any
from app.core.config import settings

def calculate_slab_bill(kwh_units: float, fixed_charge: float = None, tax_pct: float = None) -> Dict[str, Any]:
    fixed = fixed_charge if fixed_charge is not None else settings.FIXED_MONTHLY_CHARGE_INR
    tax = tax_pct if tax_pct is not None else settings.ELECTRICITY_DUTY_PCT

    slabs = [
        {"min": 0, "max": settings.SLAB_1_MAX, "rate": settings.SLAB_1_RATE, "label": f"0 – {settings.SLAB_1_MAX} units"},
        {"min": settings.SLAB_1_MAX + 1, "max": settings.SLAB_2_MAX, "rate": settings.SLAB_2_RATE, "label": f"{settings.SLAB_1_MAX + 1} – {settings.SLAB_2_MAX} units"},
        {"min": settings.SLAB_2_MAX + 1, "max": settings.SLAB_3_MAX, "rate": settings.SLAB_3_RATE, "label": f"{settings.SLAB_2_MAX + 1} – {settings.SLAB_3_MAX} units"},
        {"min": settings.SLAB_3_MAX + 1, "max": None, "rate": settings.SLAB_4_RATE, "label": f"> {settings.SLAB_3_MAX} units"},
    ]

    units_left = max(0.0, kwh_units)
    energy_charges = 0.0
    slab_details = []

    for s in slabs:
        if units_left <= 0:
            break
        
        if s["max"] is None:
            slab_capacity = float("inf")
        elif s["min"] == 0:
            slab_capacity = s["max"]
        else:
            slab_capacity = s["max"] - s["min"] + 1

        units_in_slab = min(units_left, slab_capacity)
        amount = round(units_in_slab * s["rate"], 2)

        slab_details.append({
            "slab": s["label"],
            "units": round(units_in_slab, 1),
            "rate": s["rate"],
            "amount": amount
        })

        energy_charges += amount
        units_left -= units_in_slab

    electricity_duty = round((energy_charges * tax) / 100.0, 2)
    total_bill = round(energy_charges + fixed + electricity_duty, 2)
    effective_rate = round(total_bill / kwh_units, 2) if kwh_units > 0 else 0.0

    return {
        "kwh_units": round(kwh_units, 1),
        "energy_charges_inr": round(energy_charges, 2),
        "fixed_charges_inr": round(fixed, 2),
        "electricity_duty_inr": round(electricity_duty, 2),
        "total_bill_inr": round(total_bill, 2),
        "effective_rate_per_unit_inr": effective_rate,
        "slab_breakdown": slab_details
    }
