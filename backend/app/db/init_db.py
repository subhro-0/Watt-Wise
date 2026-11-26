from sqlalchemy.orm import Session
from app.db.session import engine, Base, SessionLocal
from app.models.models import Appliance, Goal, Alert, User
from app.core.config import settings

INITIAL_APPLIANCES = [
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
        "operating_schedule": "Always On (Compressor ~8 hrs)",
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
]

INITIAL_GOALS = [
    {
        "id": "goal-1",
        "title": "Cut Monthly Electricity to Under 500 kWh",
        "target_kwh": 500.0,
        "current_kwh": 531.0,
        "target_bill_inr": 3200.0,
        "current_bill_inr": 3294.0,
        "target_month": "November 2026",
        "achieved": False,
    }
]

def init_db():
    # 1. Create all tables defined in models
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    try:
        # Check if appliances table is already seeded
        existing_apps = db.query(Appliance).count()
        if existing_apps == 0:
            for item in INITIAL_APPLIANCES:
                appliance = Appliance(
                    id=item["id"],
                    name=item["name"],
                    category=item["category"],
                    watts=item["watts"],
                    quantity=item["quantity"],
                    daily_hours=item["daily_hours"],
                    operating_schedule=item["operating_schedule"],
                    monthly_kwh=item["monthly_kwh"],
                    monthly_cost_inr=item["monthly_cost_inr"],
                    monthly_co2_kg=item["monthly_co2_kg"],
                )
                db.add(appliance)
            db.commit()

        # Check if goals table is already seeded
        existing_goals = db.query(Goal).count()
        if existing_goals == 0:
            for g in INITIAL_GOALS:
                goal = Goal(
                    id=g["id"],
                    title=g["title"],
                    target_kwh=g["target_kwh"],
                    current_kwh=g["current_kwh"],
                    target_bill_inr=g["target_bill_inr"],
                    current_bill_inr=g["current_bill_inr"],
                    target_month=g["target_month"],
                    achieved=g["achieved"]
                )
                db.add(goal)
            db.commit()
            
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
    print("Database schema created and initial household data seeded successfully.")
