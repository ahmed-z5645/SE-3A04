from backend.shared.models.sensor import SensorData
from backend.shared.db.sensor_db import SensorDB
from backend.shared.logger import log


class SensorController:
    def __init__(self, sensor_db: SensorDB, alert_controller):
        self.sensor_db = sensor_db
        self.alert_controller = alert_controller

    def handle_message(self, raw_data: dict):
        """
        Simulates MQTT ingestion
        """

        log("Received sensor message")

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
        log("Sensor data stored")

        # Forward to alert system
        self.alert_controller.process_sensor_data(sensor)

        return True