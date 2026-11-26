import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ENV_FILE_PATH = os.path.join(BASE_DIR, ".env")

class Settings(BaseSettings):
    PROJECT_NAME: str = "Watt Wise"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "*",
    ]
    
    # Environmental & Grid Constants (CEA India 2024 Baseline)
    CEA_GRID_EMISSION_FACTOR: float = 0.82  # kg CO2 / kWh
    ANNUAL_TREE_ABSORPTION_KG: float = 21.7  # kg CO2 / year / tree
    VEHICLE_EMISSION_FACTOR_KG: float = 0.404  # kg CO2 / mile
    
    # Indian Domestic Tariff Configuration (Defaults)
    FIXED_MONTHLY_CHARGE_INR: float = 120.0
    ELECTRICITY_DUTY_PCT: float = 5.0
    
    # Domestic Slab Rates (INR/kWh)
    SLAB_1_MAX: int = 100
    SLAB_1_RATE: float = 3.50
    SLAB_2_MAX: int = 200
    SLAB_2_RATE: float = 5.20
    SLAB_3_MAX: int = 400
    SLAB_3_RATE: float = 7.40
    SLAB_4_RATE: float = 8.80
    
    # Security & AI
    SECRET_KEY: str = "watt-wise-super-secret-key-2026"
    GEMINI_API_KEY: str = ""

    model_config = SettingsConfigDict(
        env_file=ENV_FILE_PATH,
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
