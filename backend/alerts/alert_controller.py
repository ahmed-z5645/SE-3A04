import uuid
from datetime import datetime

from backend.shared.models.alert import Alert
from backend.shared.logger import log


class AlertController:
    def __init__(self, alert_db, rule_db):
        self.alert_db = alert_db
        self.rule_db = rule_db

    def process_sensor_data(self, sensor_data):
        rules = self.rule_db.get_active_rules()

        triggered = False

        for rule in rules:
            # Match zone + metric
            if rule.zone != sensor_data.zone:
                continue

            if rule.metric != sensor_data.metric:
                continue

            if rule.evaluate(sensor_data.value):
                triggered = True

                log(f"Rule triggered: {rule.rule_id}")

                alert = Alert(
                    alert_id=str(uuid.uuid4()),
                    zone=sensor_data.zone,
                    metric=rule.metric,
                    value=sensor_data.value,
                    threshold=rule.threshold,
                    status="active",
                    timestamp=datetime.utcnow()
                )

                self.alert_db.add_alert(alert)

        if not triggered:
            log("No rules triggered")