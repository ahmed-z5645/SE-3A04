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

        for rule in rules:
            # Match zone + metric
            if rule.zone != sensor_data.zone:
                continue

            metric_value = None
            if rule.metric == sensor_data.metric:
                metric_value = sensor_data.value

            if metric_value is None:
                continue

            if rule.evaluate(metric_value):
                log(f"ALERT: zone={sensor_data.zone} rule={rule.rule_id} | {metric_value} {rule.operator} {rule.threshold}")

                alert = Alert(
                    alert_id=str(uuid.uuid4()),
                    zone=sensor_data.zone,
                    metric=rule.metric,
                    value=metric_value,
                    threshold=rule.threshold,
                    status="active",
                    timestamp=datetime.utcnow()
                )

                self.alert_db.add_alert(alert)
            else:
                log(f"OK: zone={sensor_data.zone} rule={rule.rule_id} | {rule.metric}={metric_value} {rule.operator} {rule.threshold}")