import uuid
from datetime import datetime

from backend.shared.models.alert import Alert
from backend.shared.logger import log


class AlertController:
    def __init__(self, alert_db, rule_db, zone_db):
        self.alert_db = alert_db
        self.rule_db = rule_db
        self.zone_db = zone_db

    def process_sensor_data(self, sensor_data):
        rules = self.rule_db.get_active_rules()

        for rule in rules:
            # Match zone ("All Zones" applies to every zone)
            if rule.zone != "All Zones" and rule.zone != sensor_data.zone:
                continue

            # Normalize metric names for comparison
            metric_value = None
            if self._metrics_match(rule.metric, sensor_data.metric):
                metric_value = sensor_data.value

            if metric_value is None:
                continue

            if rule.evaluate(metric_value):
                log(f"ALERT: zone={sensor_data.zone} rule={rule.id} | {metric_value} {rule.operator} {rule.threshold}")

                alert = Alert(
                    id=str(uuid.uuid4()),
                    zone=sensor_data.zone,
                    metric=rule.metric,
                    value=metric_value,
                    threshold=rule.threshold,
                    status="active",
                    timestamp=datetime.utcnow()
                )

                self.alert_db.add_alert(alert)
                self.zone_db.recalculate_zone_status(
                    sensor_data.zone,
                    [a.to_dict() for a in self.alert_db.get_alerts_by_zone(sensor_data.zone, status="active")]
                )
                
            else:
                log(f"OK: zone={sensor_data.zone} rule={rule.id} | {rule.metric}={metric_value} {rule.operator} {rule.threshold}")

    def _metrics_match(self, rule_metric: str, sensor_metric: str) -> bool:
        """Map frontend condition metric names to sensor metric names."""
        mapping = {
            "air": "aqi",
            "aqi": "aqi",
            "temperature": "temperature",
            "temp": "temperature",
            "humidity": "humidity",
            "noise": "noise",
        }
        return mapping.get(rule_metric.lower()) == mapping.get(sensor_metric.lower())

    def acknowledge_alert(self, alert_id: str):
        alert = self.alert_db.get_alert(alert_id)
        if not alert:
            return None
        alert.acknowledge()
        self.alert_db.update_alert(alert)
        self.zone_db.recalculate_zone_status(
            alert.zone,
            [a.to_dict() for a in self.alert_db.get_alerts_by_zone(alert.zone, status="active")]
        )
        return alert

    def resolve_alert(self, alert_id: str):
        alert = self.alert_db.get_alert(alert_id)
        if not alert:
            return None
        alert.resolve()
        self.alert_db.update_alert(alert)
        self.zone_db.recalculate_zone_status(
            alert.zone,
            [a.to_dict() for a in self.alert_db.get_alerts_by_zone(alert.zone, status="active")]
        )
        return alert

    def get_city_rankings(filter: str) -> list:
        return get_rankings(sensor_db)
