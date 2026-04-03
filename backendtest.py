from backend.sensor.sensor_controller import SensorController
from backend.alerts.alert_controller import AlertController

from backend.shared.db.sensor_db import SensorDB
from backend.shared.db.alert_db import AlertDB
from backend.shared.db.rule_db import RuleDB

from backend.shared.models.rule import Rule
from datetime import datetime

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
        {"rule_id": "r3", "zone": "C", "metric": "AQI", "operator": ">=", "threshold": 150},
    ]

    # Add rules to RuleDB
    for rd in rules_data:
        rule = Rule.from_dict(rd)
        rule_db.add_rule(rule)

    # Simulated incoming MQTT messages
    test_messages = [
        {"id": "1", "zone": "A", "value": 50,  "metric":"AQI", "timestamp": datetime.utcnow().isoformat()},
        {"id": "2", "zone": "A", "value": 120, "metric":"AQI", "timestamp": datetime.utcnow().isoformat()},
        {"id": "3", "zone": "B", "value": 80,  "metric":"AQI", "timestamp": datetime.utcnow().isoformat()},
        {"id": "4", "zone": "C", "value": 150, "metric":"AQI", "timestamp": datetime.utcnow().isoformat()},
    ]

    for msg in test_messages:
        sensor_controller.handle_message(msg)

    print("\n=== ACTIVE ALERTS ===")
    for alert in alert_db.get_active_alerts():
        print(alert)

if __name__ == "__main__":
    main()