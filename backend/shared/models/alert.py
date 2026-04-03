from dataclasses import dataclass
from datetime import datetime


@dataclass
class Alert:
    alert_id: str
    zone: str
    metric: str
    value: float
    threshold: float
    status: str  # active, acknowledged, resolved
    timestamp: datetime

    def is_active(self) -> bool:
        return self.status == "active"

    def acknowledge(self):
        self.status = "acknowledged"

    def resolve(self):
        self.status = "resolved"

    def to_dict(self) -> dict:
        return {
            "id": self.alert_id,
            "type": "alert",
            "zone": self.zone,
            "metric": self.metric,
            "value": self.value,
            "threshold": self.threshold,
            "status": self.status,
            "timestamp": self.timestamp.isoformat()
        }

    @staticmethod
    def from_dict(data: dict):
        """Create an Alert from a dictionary."""
        return Alert(
            alert_id=data.get("id"),
            zone=data.get("zone"),
            metric=data.get("metric"),
            value=float(data.get("value")),
            threshold=float(data.get("threshold")),
            status=data.get("status"),
            timestamp=datetime.fromisoformat(data.get("timestamp"))
        )