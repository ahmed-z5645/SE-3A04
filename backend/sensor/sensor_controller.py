from backend.shared.models.sensor import SensorData
from backend.shared.db.sensor_db import SensorDB
from backend.shared.logger import log
from datetime import datetime, timedelta


class SensorController:
    def __init__(self, sensor_db: SensorDB, alert_controller, zone_db):
        self.sensor_db = sensor_db
        self.alert_controller = alert_controller
        self.zone_db = zone_db

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

        # Update zone trends and current zone metrics
        self.zone_db.record_sensor_reading(sensor.zone, sensor.metric, sensor.value)

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


    # Returns a list of sensor dicts, the first index being rank 1
    def get_sensor_rankings(self, filter: str) -> list:
        rankings = []
        data = self.sensor_db.get_recent_data()
        for sensor_a in data.values():
            # if filter == sensor_a["metric"]:
            if filter == sensor_a.metric:
                if len(rankings) == 0:
                    rankings.append(sensor_a.to_dict())
                    continue
                for i in range(len(rankings)):
                    sensor_b = rankings[i]
                    # if sensor_a["value"] <= sensor_b["value"]:
                    if sensor_a.value <= sensor_b["value"]:
                        rankings.insert(i, sensor_a.to_dict())
                        break
                    elif i+1 == len(rankings):
                        rankings.append(sensor_a.to_dict())
                        break
        return rankings


    # returns a list of all the city sensors
    def get_city_sensors(self, city: str) -> list:
        sensors = []
        data = self.sensor_db.get_recent_data()
        for sensor in data.values():
            if sensor.city == city:
                sensors.append(sensor.to_dict())
        return sensors


    # Returns empty dictionary if can't find specific
    def get_city_sensor(self, city: str, filter: str) -> dict:
        data = self.sensor_db.get_recent_data()
        for sensor in data.values():
            if sensor.city == city:
                if sensor.metric == filter:
                    return sensor.to_dict()
        return {}


    # This just returns a list of city names with index 0 being the best
    def get_city_rankings(self, filter: str) -> list:
        city_ranks = []
        senor_ranks = self.get_sensor_rankings(filter)
        for sensor in senor_ranks:
            city_ranks.append(sensor["city"])
        return city_ranks


    # Returns city rank based on metric, -1 is error
    def get_city_rank(self, city: str, filter: str) -> int:
        rankings = self.get_sensor_rankings(filter)
        for i in range(len(rankings)):
            sensor = rankings[i]
            if sensor["city"] == city:
                return i + 1
        return -1 # city doesn't exist


    # Maps the frontend's sortBy vocabulary onto the metric names used in
    # ingested sensor payloads. Keep this in sync with the City type in
    # frontend/src/lib/api/types.ts.
    _FRONTEND_METRIC_TO_BACKEND = {
        "aqi": "AQI",
        "temp": "temperature",
        "noise": "noise",
        "humidity": "humidity",
    }

    # Returns data shaped for the frontend GET /rankings endpoint:
    #   City[] where City = { rank, name, aqi, temp, noise, humidity }
    # sort_by is the frontend vocabulary (aqi|temp|noise|humidity).
    # search is a case-insensitive substring match on city name.
    def get_rankings(self, sort_by: str = "aqi", search: str = "") -> list:
        if sort_by not in self._FRONTEND_METRIC_TO_BACKEND:
            sort_by = "aqi"

        # Aggregate latest reading per (city, frontend-metric-key).
        cities: dict = {}
        for sensor in self.sensor_db.get_recent_data().values():
            if not sensor.city:
                continue
            row = cities.setdefault(sensor.city, {
                "name": sensor.city,
                "aqi": 0,
                "temp": 0,
                "noise": 0,
                "humidity": 0,
            })
            for fe_key, be_key in self._FRONTEND_METRIC_TO_BACKEND.items():
                if sensor.metric == be_key:
                    row[fe_key] = sensor.value
                    break

        rows = list(cities.values())

        # Search filter on city name (case-insensitive substring).
        query = (search or "").strip().lower()
        if query:
            rows = [r for r in rows if query in r["name"].lower()]

        # Ascending sort — lower is better for AQI/noise; frontend's mock
        # sorts ascending for all four metrics, so match that.
        rows.sort(key=lambda r: r[sort_by])

        # Assign 1-based rank after sort.
        for i, row in enumerate(rows):
            row["rank"] = i + 1

        return rows
