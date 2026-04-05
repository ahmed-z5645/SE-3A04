from dataclasses import dataclass
from datetime import datetime


@dataclass
class SensorData:
    id: str
    zone: str
    value: float
    metric: str
    timestamp: datetime
    city: str = ""

    def is_valid(self) -> bool:
        """
        Validate sensor data:
        - zone must exist
        - metric must be valid
        - timestamp must be datetime
        """
        if not self.zone:
            return False

        if not isinstance(self.value, (int, float)):
            return False

        if not isinstance(self.timestamp, datetime):
            return False

        return True

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "type": "sensor",
            "zone": self.zone,
            "city": self.city,
            "value": self.value,
            "metric": self.metric,
            "timestamp": self.timestamp.isoformat()
        }

    @staticmethod
    def from_dict(data: dict):
        """Create SensorData from dictionary"""
        return SensorData(
            id=data.get("id", ""),
            zone=data.get("zone"),
            city=data.get("city"),
            value=float(data.get("value")),
            metric=data.get("metric"),
            timestamp=data.get("timestamp") if isinstance(data.get("timestamp"), datetime)
            else datetime.fromisoformat(data.get("timestamp"))
        )
