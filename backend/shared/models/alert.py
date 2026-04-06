from dataclasses import dataclass
from datetime import datetime


@dataclass
class Alert:
    id: str
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
        # Derive severity from how far value exceeds threshold
        if self.value >= self.threshold * 1.5:
            severity = "critical"
        elif self.value >= self.threshold:
            severity = "warning"
        else:
            severity = "info"

        return {
            "id": self.id,
            "zone": self.zone,
            "type": self.metric,
            "severity": severity,
            "value": f"{self.metric}: {self.value}",
            "rule": f"{self.metric} > {self.threshold}",
            "time": self.timestamp.strftime("%I:%M %p"),
            "status": self.status,
        }

    @staticmethod
    def from_dict(data: dict):
        """Create an Alert from a dictionary."""
        return Alert(
            id=data.get("id"),
            zone=data.get("zone"),
            metric=data.get("metric"),
            value=float(data.get("value")),
            threshold=float(data.get("threshold")),
            status=data.get("status"),
            timestamp=datetime.fromisoformat(data.get("timestamp"))
        )
