from backend.shared.models.sensor import SensorData
from backend.shared.db.sensor_db import SensorDB
from backend.shared.logger import log
from datetime import datetime, timedelta


class SensorController:
    def __init__(self, sensor_db: SensorDB, alert_controller):
        self.sensor_db = sensor_db
        self.alert_controller = alert_controller

    def handle_message(self, raw_data: dict):
        """
        Simulates MQTT ingestion
        """

        log(f"Received: zone={raw_data.get('zone')} metric={raw_data.get('metric')} value={raw_data.get('value')}")

        try:
            sensor = SensorData.from_dict(raw_data)
        except Exception as e:
            log(f"Invalid payload: {e}")
            return False

        if not sensor.is_valid():
            log("Validation failed")
            return False

        # Store data
        self.sensor_db.store(sensor)
        log(f"Stored: zone={sensor.zone} metric={sensor.metric}")

        # Forward to alert system with aggregated context
        self.alert_controller.process_sensor_data(sensor)

        return True


    def _compute_average(self, zone: str, metric: str, time: int):
        now = datetime.utcnow()
        cutoff = now - timedelta(minutes=time)
        records = [
            sensor.value for sensor in self.sensor_db.get_all()
            if sensor.zone == zone and sensor.metric == metric and sensor.timestamp > cutoff
        ]
        return sum(records) / len(records) if records else None
    

    def _compute_high(self, zone: str, metric: str, time: int):
        now = datetime.utcnow()
        cutoff = now - timedelta(minutes=time)
        records = [
            sensor.value for sensor in self.sensor_db.get_all()
            if sensor.zone == zone and sensor.metric == metric and sensor.timestamp > cutoff
        ]
        return max(records) if records else None

    def _compute_low(self, zone: str, metric: str, time: int):
        now = datetime.utcnow()
        cutoff = now - timedelta(minutes=time)
        records = [
            sensor.value for sensor in self.sensor_db.get_all()
            if sensor.zone == zone and sensor.metric == metric and sensor.timestamp > cutoff
        ]
        return min(records) if records else None

    def get_5min_average(self, zone: str, metric: str):
        return self._compute_average(zone, metric, time=5)

    def get_hourly_high(self, zone: str, metric: str):
        return self._compute_high(zone, metric, time=60)

    def get_hourly_low(self, zone: str, metric: str):
        return self._compute_low(zone, metric, time=60)