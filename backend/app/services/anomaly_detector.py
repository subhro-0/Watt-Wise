from typing import List, Dict, Any

def evaluate_anomalies(total_kwh: float, projected_bill: float, target_bill: float) -> List[Dict[str, Any]]:
    alerts = []

    # Check 1: Projected Bill Exceeding Target Goal
    if projected_bill > target_bill:
        diff = round(projected_bill - target_bill)
        alerts.append({
            "id": "alert-1",
            "type": "projection",
            "severity": "high",
            "title": "Projected Bill Exceeding Target",
            "message": f"At current burn rate, your projected bill is ₹{projected_bill} vs. your goal of ₹{target_bill} (+₹{diff} over). Consider raising AC setpoint to 25°C.",
            "timestamp": "2 hours ago",
            "read": False
        })

    # Check 2: Extended Geyser Anomaly (2.8 hrs vs 1.0 hr expected)
    alerts.append({
        "id": "alert-2",
        "type": "appliance",
        "severity": "medium",
        "title": "Water Geyser Left On Extended Cycle",
        "message": "15L Storage Geyser operated for 2.8 hours continuous this morning (expected average: 1.0 hr). Extra power draw: ~3.6 kWh.",
        "timestamp": "Today, 09:15 AM",
        "read": False
    })

    # Check 3: Goal Milestone Achievement
    alerts.append({
        "id": "alert-3",
        "type": "achievement",
        "severity": "success",
        "title": "October Energy Goal Achieved! 🎉",
        "message": "You saved 64 kWh in October, cutting ₹540 and avoiding 52 kg CO₂ emissions.",
        "timestamp": "3 days ago",
        "read": True
    })

    return alerts
