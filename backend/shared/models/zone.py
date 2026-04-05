from dataclasses import dataclass, field
from typing import Dict, List


@dataclass
class Zone:
    id: str
    name: str
    aqi: float
    temp: float
    humidity: float
    noise: float
    status: str
    lat: float
    lng: float
    trends: Dict[str, List[float]] = field(default_factory=lambda: {
        "aqi": [],
        "temp": [],
        "humidity": [],
        "noise": [],
    })

    def to_dict(self, include_trends: bool = False) -> dict:
        payload = {
            "id": self.id,
            "name": self.name,
            "aqi": self.aqi,
            "temp": self.temp,
            "humidity": self.humidity,
            "noise": self.noise,
            "status": self.status,
            "lat": self.lat,
            "lng": self.lng,
        }
        if include_trends:
            payload["trends"] = self.trends
        return payload

    def update_metric(self, metric: str, value: float):
        normalized = metric.lower()
        if normalized == "aqi":
            self.aqi = value
            key = "aqi"
        elif normalized in ["temp", "temperature"]:
            self.temp = value
            key = "temp"
        elif normalized == "humidity":
            self.humidity = value
            key = "humidity"
        elif normalized == "noise":
            self.noise = value
            key = "noise"
        else:
            return

        series = self.trends.get(key)
        if series is None:
            return

        series.append(value)
        if len(series) > 24:
            series.pop(0)

    def set_status(self, status: str):
        self.status = status
