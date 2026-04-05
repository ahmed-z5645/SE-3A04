from backend.sensor.sensor_controller import SensorController
from backend.alerts.alert_controller import AlertController

from backend.shared.db.sensor_db import SensorDB
from backend.shared.db.alert_db import AlertDB
from backend.shared.db.rule_db import RuleDB

from backend.shared.models.rule import Rule
from datetime import datetime, timedelta
import time

def main():
    # Initialize DBs
    sensor_db = SensorDB()
    alert_db = AlertDB()
    rule_db = RuleDB()

    # Controllers
    alert_controller = AlertController(alert_db, rule_db)
    sensor_controller = SensorController(sensor_db, alert_controller)

    # User-defined threshold rules
    rules_data = [
        {"rule_id": "r1", "zone": "A", "metric": "AQI", "operator": ">", "threshold": 100},
        {"rule_id": "r2", "zone": "B", "metric": "AQI", "operator": "<", "threshold": 70},
        {"rule_id": "r3", "zone": "C", "metric": "temperature", "operator": ">", "threshold": 32},
    ]

    # Add rules to RuleDB
    for rd in rules_data:
        rule = Rule.from_dict(rd)
        rule_db.add_rule(rule)

    # Comprehensive test: multiple zones, extended time frame
    base_time = datetime.utcnow()
    # test_messages = [
    #     # Zone A: AQI readings over 5+ minutes (50, 60, 70, 80, 90, 100, 110, 120)
    #     {"id": "A_AQI_0", "zone": "A", "city": "New York", "value": 50, "metric": "AQI", "timestamp": (base_time + timedelta(seconds=0)).isoformat()},
    #     {"id": "A_AQI_1", "zone": "A", "city": "New York", "value": 60, "metric": "AQI", "timestamp": (base_time + timedelta(seconds=40)).isoformat()},
    #     {"id": "A_AQI_2", "zone": "A", "city": "New York", "value": 70, "metric": "AQI", "timestamp": (base_time + timedelta(seconds=80)).isoformat()},
    #     {"id": "A_AQI_3", "zone": "A", "city": "New York", "value": 80, "metric": "AQI", "timestamp": (base_time + timedelta(seconds=120)).isoformat()},
    #     {"id": "A_AQI_4", "zone": "A", "city": "New York", "value": 90, "metric": "AQI", "timestamp": (base_time + timedelta(seconds=160)).isoformat()},
    #     {"id": "A_AQI_5", "zone": "A", "city": "New York", "value": 100, "metric": "AQI", "timestamp": (base_time + timedelta(seconds=200)).isoformat()},
    #     {"id": "A_AQI_6", "zone": "A", "city": "New York", "value": 110, "metric": "AQI", "timestamp": (base_time + timedelta(seconds=240)).isoformat()},
    #     {"id": "A_AQI_7", "zone": "A", "city": "New York", "value": 120, "metric": "AQI", "timestamp": (base_time + timedelta(seconds=280)).isoformat()},
    #
    #     # Zone B: AQI readings (65, 70, 75, 80, 85, 90) - should trigger r2 when < 70
    #     {"id": "B_AQI_0", "zone": "B", "city": "Los Angeles", "value": 65, "metric": "AQI", "timestamp": (base_time + timedelta(seconds=0)).isoformat()},
    #     {"id": "B_AQI_1", "zone": "B", "city": "Los Angeles", "value": 70, "metric": "AQI", "timestamp": (base_time + timedelta(seconds=50)).isoformat()},
    #     {"id": "B_AQI_2", "zone": "B", "city": "Los Angeles", "value": 75, "metric": "AQI", "timestamp": (base_time + timedelta(seconds=100)).isoformat()},
    #     {"id": "B_AQI_3", "zone": "B", "city": "Los Angeles", "value": 80, "metric": "AQI", "timestamp": (base_time + timedelta(seconds=150)).isoformat()},
    #     {"id": "B_AQI_4", "zone": "B", "city": "Los Angeles", "value": 85, "metric": "AQI", "timestamp": (base_time + timedelta(seconds=200)).isoformat()},
    #     {"id": "B_AQI_5", "zone": "B", "city": "Los Angeles", "value": 90, "metric": "AQI", "timestamp": (base_time + timedelta(seconds=250)).isoformat()},
    #
    #     # Zone C: Temperature readings (28, 29.5, 31, 32.5, 34, 35.5, 37) - should trigger r3 when > 32
    #     {"id": "C_TEMP_0", "zone": "C", "city": "Chicago", "value": 28.0, "metric": "temperature", "timestamp": (base_time + timedelta(seconds=0)).isoformat()},
    #     {"id": "C_TEMP_1", "zone": "C", "city": "Chicago", "value": 29.5, "metric": "temperature", "timestamp": (base_time + timedelta(seconds=45)).isoformat()},
    #     {"id": "C_TEMP_2", "zone": "C", "city": "Chicago", "value": 31.0, "metric": "temperature", "timestamp": (base_time + timedelta(seconds=90)).isoformat()},
    #     {"id": "C_TEMP_3", "zone": "C", "city": "Chicago", "value": 32.5, "metric": "temperature", "timestamp": (base_time + timedelta(seconds=135)).isoformat()},
    #     {"id": "C_TEMP_4", "zone": "C", "city": "Chicago", "value": 34.0, "metric": "temperature", "timestamp": (base_time + timedelta(seconds=180)).isoformat()},
    #     {"id": "C_TEMP_5", "zone": "C", "city": "Chicago", "value": 35.5, "metric": "temperature", "timestamp": (base_time + timedelta(seconds=225)).isoformat()},
    #     {"id": "C_TEMP_6", "zone": "C", "city": "Chicago", "value": 37.0, "metric": "temperature", "timestamp": (base_time + timedelta(seconds=270)).isoformat()},
    #
    #     # Zone A: Humidity readings (50, 55, 60, 65, 70)
    #     {"id": "A_HUM_0", "zone": "A", "city": "New York", "value": 50, "metric": "humidity", "timestamp": (base_time + timedelta(seconds=0)).isoformat()},
    #     {"id": "A_HUM_1", "zone": "A", "city": "New York", "value": 55, "metric": "humidity", "timestamp": (base_time + timedelta(seconds=35)).isoformat()},
    #     {"id": "A_HUM_2", "zone": "A", "city": "New York", "value": 60, "metric": "humidity", "timestamp": (base_time + timedelta(seconds=70)).isoformat()},
    #     {"id": "A_HUM_3", "zone": "A", "city": "New York", "value": 65, "metric": "humidity", "timestamp": (base_time + timedelta(seconds=105)).isoformat()},
    #     {"id": "A_HUM_4", "zone": "A", "city": "New York", "value": 70, "metric": "humidity", "timestamp": (base_time + timedelta(seconds=140)).isoformat()},
    # ]
    test_messages = [
        # NEW YORK - AQI readings
        {"id": "NEW_YORK_AQI", "zone": "A", "city": "New York", "value": 50, "metric": "AQI", "timestamp": (base_time + timedelta(seconds=0)).isoformat()},
        {"id": "NEW_YORK_AQI", "zone": "A", "city": "New York", "value": 60, "metric": "AQI", "timestamp": (base_time + timedelta(seconds=40)).isoformat()},
        {"id": "NEW_YORK_AQI", "zone": "A", "city": "New York", "value": 70, "metric": "AQI", "timestamp": (base_time + timedelta(seconds=80)).isoformat()},
        {"id": "NEW_YORK_AQI", "zone": "A", "city": "New York", "value": 80, "metric": "AQI", "timestamp": (base_time + timedelta(seconds=120)).isoformat()},
        {"id": "NEW_YORK_AQI", "zone": "A", "city": "New York", "value": 90, "metric": "AQI", "timestamp": (base_time + timedelta(seconds=160)).isoformat()},
        {"id": "NEW_YORK_AQI", "zone": "A", "city": "New York", "value": 100, "metric": "AQI", "timestamp": (base_time + timedelta(seconds=200)).isoformat()},
        {"id": "NEW_YORK_AQI", "zone": "A", "city": "New York", "value": 110, "metric": "AQI", "timestamp": (base_time + timedelta(seconds=240)).isoformat()},
        {"id": "NEW_YORK_AQI", "zone": "A", "city": "New York", "value": 120, "metric": "AQI", "timestamp": (base_time + timedelta(seconds=280)).isoformat()},

        # NEW YORK - Temperature readings
        {"id": "NEW_YORK_TEMP", "zone": "A", "city": "New York", "value": 22.0, "metric": "temperature", "timestamp": (base_time + timedelta(seconds=0)).isoformat()},
        {"id": "NEW_YORK_TEMP", "zone": "A", "city": "New York", "value": 23.5, "metric": "temperature", "timestamp": (base_time + timedelta(seconds=45)).isoformat()},
        {"id": "NEW_YORK_TEMP", "zone": "A", "city": "New York", "value": 24.0, "metric": "temperature", "timestamp": (base_time + timedelta(seconds=90)).isoformat()},
        {"id": "NEW_YORK_TEMP", "zone": "A", "city": "New York", "value": 25.5, "metric": "temperature", "timestamp": (base_time + timedelta(seconds=135)).isoformat()},
        {"id": "NEW_YORK_TEMP", "zone": "A", "city": "New York", "value": 26.0, "metric": "temperature", "timestamp": (base_time + timedelta(seconds=180)).isoformat()},
        {"id": "NEW_YORK_TEMP", "zone": "A", "city": "New York", "value": 27.5, "metric": "temperature", "timestamp": (base_time + timedelta(seconds=225)).isoformat()},

        # NEW YORK - Humidity readings
        {"id": "NEW_YORK_HUM", "zone": "A", "city": "New York", "value": 50, "metric": "humidity", "timestamp": (base_time + timedelta(seconds=0)).isoformat()},
        {"id": "NEW_YORK_HUM", "zone": "A", "city": "New York", "value": 55, "metric": "humidity", "timestamp": (base_time + timedelta(seconds=35)).isoformat()},
        {"id": "NEW_YORK_HUM", "zone": "A", "city": "New York", "value": 60, "metric": "humidity", "timestamp": (base_time + timedelta(seconds=70)).isoformat()},
        {"id": "NEW_YORK_HUM", "zone": "A", "city": "New York", "value": 65, "metric": "humidity", "timestamp": (base_time + timedelta(seconds=105)).isoformat()},
        {"id": "NEW_YORK_HUM", "zone": "A", "city": "New York", "value": 70, "metric": "humidity", "timestamp": (base_time + timedelta(seconds=140)).isoformat()},

        # LOS ANGELES - AQI readings
        {"id": "LA_AQI", "zone": "B", "city": "Los Angeles", "value": 65, "metric": "AQI", "timestamp": (base_time + timedelta(seconds=0)).isoformat()},
        {"id": "LA_AQI", "zone": "B", "city": "Los Angeles", "value": 70, "metric": "AQI", "timestamp": (base_time + timedelta(seconds=50)).isoformat()},
        {"id": "LA_AQI", "zone": "B", "city": "Los Angeles", "value": 75, "metric": "AQI", "timestamp": (base_time + timedelta(seconds=100)).isoformat()},
        {"id": "LA_AQI", "zone": "B", "city": "Los Angeles", "value": 80, "metric": "AQI", "timestamp": (base_time + timedelta(seconds=150)).isoformat()},
        {"id": "LA_AQI", "zone": "B", "city": "Los Angeles", "value": 85, "metric": "AQI", "timestamp": (base_time + timedelta(seconds=200)).isoformat()},
        {"id": "LA_AQI", "zone": "B", "city": "Los Angeles", "value": 90, "metric": "AQI", "timestamp": (base_time + timedelta(seconds=250)).isoformat()},

        # LOS ANGELES - Temperature readings
        {"id": "LA_TEMP", "zone": "B", "city": "Los Angeles", "value": 24.0, "metric": "temperature", "timestamp": (base_time + timedelta(seconds=0)).isoformat()},
        {"id": "LA_TEMP", "zone": "B", "city": "Los Angeles", "value": 25.5, "metric": "temperature", "timestamp": (base_time + timedelta(seconds=45)).isoformat()},
        {"id": "LA_TEMP", "zone": "B", "city": "Los Angeles", "value": 27.0, "metric": "temperature", "timestamp": (base_time + timedelta(seconds=90)).isoformat()},
        {"id": "LA_TEMP", "zone": "B", "city": "Los Angeles", "value": 28.5, "metric": "temperature", "timestamp": (base_time + timedelta(seconds=135)).isoformat()},
        {"id": "LA_TEMP", "zone": "B", "city": "Los Angeles", "value": 30.0, "metric": "temperature", "timestamp": (base_time + timedelta(seconds=180)).isoformat()},
        {"id": "LA_TEMP", "zone": "B", "city": "Los Angeles", "value": 31.5, "metric": "temperature", "timestamp": (base_time + timedelta(seconds=225)).isoformat()},

        # LOS ANGELES - Humidity readings
        {"id": "LA_HUM", "zone": "B", "city": "Los Angeles", "value": 45, "metric": "humidity", "timestamp": (base_time + timedelta(seconds=0)).isoformat()},
        {"id": "LA_HUM", "zone": "B", "city": "Los Angeles", "value": 48, "metric": "humidity", "timestamp": (base_time + timedelta(seconds=35)).isoformat()},
        {"id": "LA_HUM", "zone": "B", "city": "Los Angeles", "value": 52, "metric": "humidity", "timestamp": (base_time + timedelta(seconds=70)).isoformat()},
        {"id": "LA_HUM", "zone": "B", "city": "Los Angeles", "value": 55, "metric": "humidity", "timestamp": (base_time + timedelta(seconds=105)).isoformat()},
        {"id": "LA_HUM", "zone": "B", "city": "Los Angeles", "value": 58, "metric": "humidity", "timestamp": (base_time + timedelta(seconds=140)).isoformat()},

        # CHICAGO - AQI readings
        {"id": "CHICAGO_AQI", "zone": "C", "city": "Chicago", "value": 55, "metric": "AQI", "timestamp": (base_time + timedelta(seconds=0)).isoformat()},
        {"id": "CHICAGO_AQI", "zone": "C", "city": "Chicago", "value": 60, "metric": "AQI", "timestamp": (base_time + timedelta(seconds=40)).isoformat()},
        {"id": "CHICAGO_AQI", "zone": "C", "city": "Chicago", "value": 65, "metric": "AQI", "timestamp": (base_time + timedelta(seconds=80)).isoformat()},
        {"id": "CHICAGO_AQI", "zone": "C", "city": "Chicago", "value": 70, "metric": "AQI", "timestamp": (base_time + timedelta(seconds=120)).isoformat()},
        {"id": "CHICAGO_AQI", "zone": "C", "city": "Chicago", "value": 75, "metric": "AQI", "timestamp": (base_time + timedelta(seconds=160)).isoformat()},
        {"id": "CHICAGO_AQI", "zone": "C", "city": "Chicago", "value": 80, "metric": "AQI", "timestamp": (base_time + timedelta(seconds=200)).isoformat()},

        # CHICAGO - Temperature readings (original data - triggers alert when >32)
        {"id": "CHICAGO_TEMP", "zone": "C", "city": "Chicago", "value": 28.0, "metric": "temperature", "timestamp": (base_time + timedelta(seconds=0)).isoformat()},
        {"id": "CHICAGO_TEMP", "zone": "C", "city": "Chicago", "value": 29.5, "metric": "temperature", "timestamp": (base_time + timedelta(seconds=45)).isoformat()},
        {"id": "CHICAGO_TEMP", "zone": "C", "city": "Chicago", "value": 31.0, "metric": "temperature", "timestamp": (base_time + timedelta(seconds=90)).isoformat()},
        {"id": "CHICAGO_TEMP", "zone": "C", "city": "Chicago", "value": 32.5, "metric": "temperature", "timestamp": (base_time + timedelta(seconds=135)).isoformat()},
        {"id": "CHICAGO_TEMP", "zone": "C", "city": "Chicago", "value": 34.0, "metric": "temperature", "timestamp": (base_time + timedelta(seconds=180)).isoformat()},
        {"id": "CHICAGO_TEMP", "zone": "C", "city": "Chicago", "value": 35.5, "metric": "temperature", "timestamp": (base_time + timedelta(seconds=225)).isoformat()},
        {"id": "CHICAGO_TEMP", "zone": "C", "city": "Chicago", "value": 37.0, "metric": "temperature", "timestamp": (base_time + timedelta(seconds=270)).isoformat()},

        # CHICAGO - Humidity readings
        {"id": "CHICAGO_HUM", "zone": "C", "city": "Chicago", "value": 60, "metric": "humidity", "timestamp": (base_time + timedelta(seconds=0)).isoformat()},
        {"id": "CHICAGO_HUM", "zone": "C", "city": "Chicago", "value": 63, "metric": "humidity", "timestamp": (base_time + timedelta(seconds=35)).isoformat()},
        {"id": "CHICAGO_HUM", "zone": "C", "city": "Chicago", "value": 67, "metric": "humidity", "timestamp": (base_time + timedelta(seconds=70)).isoformat()},
        {"id": "CHICAGO_HUM", "zone": "C", "city": "Chicago", "value": 70, "metric": "humidity", "timestamp": (base_time + timedelta(seconds=105)).isoformat()},
        {"id": "CHICAGO_HUM", "zone": "C", "city": "Chicago", "value": 73, "metric": "humidity", "timestamp": (base_time + timedelta(seconds=140)).isoformat()},
    ]
    print(f"Processing {len(test_messages)} messages across 3 zones...")
    for msg in test_messages:
        sensor_controller.handle_message(msg)
        time.sleep(0.01)  # Small delay to simulate stream

    print("\n=== ACTIVE ALERTS ===")
    if alert_db.get_active_alerts():
        for alert in alert_db.get_active_alerts():
            print(f"Zone {alert.zone}/{alert.metric}: value={alert.value}, threshold={alert.threshold}")
    else:
        print("No active alerts")

    print("\n=== 5-MIN ROLLING AVERAGES ===")
    zones = ["A", "B", "C"]
    metrics = ["AQI", "temperature", "humidity"]
    for zone in zones:
        print(f"\nZone {zone}:")
        for metric in metrics:
            avg = sensor_controller.get_5min_average(zone, metric)
            if avg is not None:
                print(f"  {metric} 5min avg: {avg:.2f}")

    print("\n=== HOURLY HIGHS ===")
    for zone in zones:
        print(f"\nZone {zone}:")
        for metric in metrics:
            high = sensor_controller.get_hourly_high(zone, metric)
            if high is not None:
                print(f"  {metric} hourly high: {high:.2f}")

    print("\n=== HOURLY LOWS ===")
    for zone in zones:
        print(f"\nZone {zone}:")
        for metric in metrics:
            low = sensor_controller.get_hourly_low(zone, metric)
            if low is not None:
                print(f"  {metric} hourly low: {low:.2f}")

    print("\n=== SENSOR DATA SUMMARY ===")
    print(f"Total records stored: {len(sensor_db.get_all())}")
    print(f"Active alerts: {len(alert_db.get_active_alerts())}")
    print(f"Alert history: {len(alert_db.get_all_alerts())}")


    # ==================== Rankings Test =====================
    print("\n=== RANK TESTS ===")
    print("==ALL CITIES SENSOR RANKED FOR AQI==")
    print(sensor_controller.get_sensor_rankings("AQI"))
    print("==GET ALL SENSORS FOR NEW YORK==")
    print(sensor_controller.get_city_sensors("New York"))
    print("==GET A SPECIFIC CITY (Chicago) SENSOR (temperature)==")
    print(sensor_controller.get_city_sensor("Chicago", "temperature"))
    print("==GET LIST OF CITY RANKINGS FOR humidity==")
    print(sensor_controller.get_city_rankings("humidity"))
    print("==GET A SPECIFIC CITY (Los Angeles) RANK (AQI)==")
    print(sensor_controller.get_city_rank("Los Angeles", "AQI"))
    print("==================================")

    # Frontend-shaped endpoint: GET /rankings?sortBy=...&search=...
    print("\n=== GET /rankings (frontend shape) ===")
    print("-- sortBy=aqi, no search --")
    for row in sensor_controller.get_rankings("aqi"):
        print(row)
    print("-- sortBy=temp, search='los' --")
    for row in sensor_controller.get_rankings("temp", "los"):
        print(row)
    print("-- sortBy=humidity --")
    for row in sensor_controller.get_rankings("humidity"):
        print(row)


if __name__ == "__main__":
    main()
