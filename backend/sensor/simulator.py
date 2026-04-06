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
    "AQI": (0, 50),
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

# ---------------- Severity Bias ----------------
# Higher = worse conditions (pushes values toward max)
ZONE_SEVERITY = {
    "Westdale": 0.2,
    "Mountain": 0.4,
    "Downtown Core": 0.7,
    "Harbour District": 0.6
}

CITY_SEVERITY = {
    "Hamilton": 0.6,
    "Toronto": 0.8,
    "Mississauga": 0.5,
    "Brampton": 0.7,
    "Oakville": 0.3
}

# ---------------- Helper to generate biased values ----------------
def _next_value(profile: dict) -> float:
    min_val = profile["min"]
    max_val = profile["max"]

    # Get severity (default mild if missing)
    zone_sev = ZONE_SEVERITY.get(profile["zone"], 0.3)
    city_sev = CITY_SEVERITY.get(profile["city"], 0.3)

    # Combine severity (weighted average)
    severity = (0.6 * city_sev) + (0.4 * zone_sev)

    # Mode determines where values cluster (closer to max if worse)
    mode = min_val + (max_val - min_val) * (0.3 + 0.6 * severity)

    # Triangular distribution → most values near mode, extremes rare
    value = random.triangular(min_val, max_val, mode)

    return round(value, 1)

# ---------------- Sensor Simulation ----------------
async def run_sensor_simulation(sensor_controller, interval_seconds: float = 1.0):
    """
    Every second:
    - Pick 5–10 random sensors
    - Generate biased values
    - Send to controller
    """
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

        sensor_controller.handle_message(sensor_data.to_dict())

    while True:
        # Pick random subset of sensors
        num_sensors = random.randint(1, 10)
        selected_profiles = random.sample(SENSOR_PROFILES, num_sensors)

        for profile in selected_profiles:
            value = _next_value(profile)

            sensor_data = SensorData(
                id=profile["id"],
                zone=profile["zone"],
                city=profile["city"],
                metric=profile["metric"],
                value=value,
                timestamp=datetime.utcnow()
            )

            sensor_controller.handle_message(sensor_data.to_dict())

        await asyncio.sleep(interval_seconds)
