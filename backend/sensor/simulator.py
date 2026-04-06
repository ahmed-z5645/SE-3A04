import asyncio
import random
from datetime import datetime
from backend.shared.models.sensor import SensorData

# ---------------- Sensor Profiles ----------------
ZONES = ["Westdale", "Mountain", "Downtown Core", "Harbour District"]
METRICS = ["AQI", "Temp", "Humidity", "Noise"]
# CITY = "Hamilton"
CITIES = ["Toronto", "Oakville", "Brampton", "Mississauga"]

# Sensible ranges for each metric
METRIC_RANGES = {
    "AQI": (50, 150),
    "Temp": (20, 40),
    "Humidity": (10, 70),
    "Noise": (50, 100)
}

# Generate profiles for all combinations of zones and metrics
SENSOR_PROFILES = []
profile_id = 1
for city in CITIES:
    for metric in METRICS:
        min_val, max_val = METRIC_RANGES[metric]
        SENSOR_PROFILES.append({
            "id": f"S-{profile_id:03d}",
            "zone": city,
            "city": city,
            "metric": metric,
            "min": min_val,
            "max": max_val
        })
        profile_id += 1
for zone in ZONES:
    for metric in METRICS:
        min_val, max_val = METRIC_RANGES[metric]
        SENSOR_PROFILES.append({
            "id": f"S-{profile_id:03d}",
            "zone": zone,
            "city": "Hamilton",
            "metric": metric,
            "min": min_val,
            "max": max_val
        })
        profile_id += 1

# ---------------- Helper to generate values ----------------
def _next_value(profile: dict) -> float:
    """Generate a random value within the profile's min/max range."""
    return round(random.uniform(profile["min"], profile["max"]), 1)

# ---------------- Sensor Simulation ----------------
async def run_sensor_simulation(sensor_controller, interval_seconds: float = 2.0):
    """
    Simulate sensor readings continuously for all profiles.
    Each reading is sent to the sensor_controller as a SensorData dictionary.
    """
    while True:
        for profile in SENSOR_PROFILES:
            value = _next_value(profile)
            sensor_data = SensorData(
                id=profile["id"],
                zone=profile["zone"],
                city=profile["city"],
                metric=profile["metric"],
                value=value,
                timestamp=datetime.utcnow()
            )
            if sensor_data.is_valid():
                sensor_controller.handle_message(sensor_data.to_dict())
        await asyncio.sleep(interval_seconds)
