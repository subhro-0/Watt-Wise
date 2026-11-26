import os
from typing import List, Dict, Any, Optional
from app.core.config import settings

def query_gemini_energy_assistant(
    user_query: str,
    total_kwh: float,
    total_bill_inr: float,
    total_co2_kg: float,
    appliances: List[Dict[str, Any]]
) -> Optional[str]:
    """
    Invokes Google Gemini with strict data grounding based on the user's
    actual database appliances and telemetry. Returns None if API key is not configured.
    """
    api_key = os.getenv("GEMINI_API_KEY") or settings.GEMINI_API_KEY
    if not api_key:
        return None

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)
        
        # Build strict household grounding inventory
        inventory_text = "\n".join([
            f"- {a['name']}: {a['watts']}W, {a['daily_hours']} hrs/day, {a['monthly_kwh']} kWh/month, ₹{a['monthly_cost_inr']}/month"
            for a in appliances
        ])

        system_instruction = (
            "You are Watt Wise AI, an expert household energy consultant and carbon footprint auditor. "
            "You must strictly base your responses on the user's actual registered household appliances and telemetry provided below. "
            "Never invent fictitious electricity readings or claim an appliance is wasting energy without supporting data. "
            "Always reference costs in Indian Rupees (₹) and carbon using the Central Electricity Authority (CEA) India baseline of 0.82 kg CO2/kWh. "
            "Keep recommendations practical, specific, and concise.\n\n"
            f"Active Household Telemetry:\n"
            f"• Monthly Electricity Consumption: {total_kwh} kWh\n"
            f"• Monthly Estimated Bill: ₹{total_bill_inr}\n"
            f"• Carbon Footprint: {total_co2_kg} kg CO2\n"
            f"• Registered Appliances:\n{inventory_text}"
        )

        candidate_models = ["gemini-3.5-flash-lite", "gemini-flash-latest", "gemini-3.8-flash"]
        for m in candidate_models:
            try:
                response = client.models.generate_content(
                    model=m,
                    contents=user_query,
                    config=types.GenerateContentConfig(
                        system_instruction=system_instruction,
                        temperature=0.3,
                    )
                )
                if response and response.text:
                    return response.text
            except Exception as model_err:
                continue

        return None
    except Exception as e:
        print(f"Gemini API warning, using grounded telemetry fallback: {e}")
        return None
