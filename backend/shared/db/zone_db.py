from collections import defaultdict
from typing import Dict, List, Optional

from backend.shared.models.zone import Zone


class ZoneDB:
    def __init__(self):
        self.zones: Dict[str, Zone] = {
            "1": Zone(id="1", name="West End", aqi=45, temp=22.5, humidity=65.0, noise=55.0, status="good", lat=40.7128, lng=-74.0060),
            "2": Zone(id="2", name="Industrial Park", aqi=85, temp=25.0, humidity=70.0, noise=75.0, status="moderate", lat=40.7589, lng=-73.9851),
            "3": Zone(id="3", name="Downtown Core", aqi=120, temp=28.0, humidity=60.0, noise=85.0, status="warning", lat=40.7505, lng=-73.9934),
            "4": Zone(id="4", name="Harbour District", aqi=150, temp=30.0, humidity=75.0, noise=90.0, status="alert", lat=40.6892, lng=-74.0445),
        }
        self.trends: Dict[str, List[float]] = defaultdict(list)

    def get_all_zones(self):
        return [zone.to_dict() for zone in self.zones.values()]

    def get_zone_by_id(self, zone_id: str) -> Optional[dict]:
        zone = self.zones.get(zone_id)
        return zone.to_dict() if zone else None

    def get_zone_by_name(self, zone_name: str) -> Optional[Zone]:
        normalized = zone_name.strip().lower()
        for zone in self.zones.values():
            if zone.name.strip().lower() == normalized:
                return zone
        return None

    def record_sensor_reading(self, zone_name: str, metric: str, value: float):
        zone = self.get_zone_by_name(zone_name)
        if not zone:
            zone_id = str(len(self.zones) + 1)
            zone = Zone(
                id=zone_id,
                name=zone_name,
                aqi=0.0,
                temp=0.0,
                humidity=0.0,
                noise=0.0,
                status="good",
                lat=0.0,
                lng=0.0,
            )
            self.zones[zone_id] = zone

        zone.update_metric(metric, value)
        frontend_metric = self._normalize_metric(metric)
        if frontend_metric:
            self.trends[frontend_metric].append(value)
            if len(self.trends[frontend_metric]) > 24:
                self.trends[frontend_metric].pop(0)
        return True

    def get_trend_series(self) -> dict:
        return {
            "aqi": list(self.trends.get("aqi", [])),
            "temp": list(self.trends.get("temp", [])),
            "humidity": list(self.trends.get("humidity", [])),
            "noise": list(self.trends.get("noise", [])),
        }

    def recalculate_zone_status(self, zone_name: str, alerts: Optional[List[dict]] = None):
        zone = self.get_zone_by_name(zone_name)
        if not zone:
            return False

        if alerts is None:
            zone.set_status("good")
            return True

        active_severities = [a.get("severity") for a in alerts if a.get("status") == "active"]
        if not active_severities:
            zone.set_status("good")
            return True

        new_status = "good"
        for severity in active_severities:
            if severity == "critical":
                new_status = "alert"
                break
            if severity == "warning" and new_status != "alert":
                new_status = "warning"
            elif severity == "info" and new_status not in ["alert", "warning"]:
                new_status = "moderate"

        zone.set_status(new_status)
        return True

    def _normalize_metric(self, metric: str) -> Optional[str]:
        normalized = metric.strip().lower()
        if normalized == "aqi":
            return "aqi"
        if normalized in ["temp", "temperature"]:
            return "temp"
        if normalized == "noise":
            return "noise"
        if normalized == "humidity":
            return "humidity"
        return None