from dataclasses import dataclass
import re

@dataclass
class Rule:
    id: str
    name: str
    zone: str
    metric: str
    operator: str   # ">", "<", ">=", "<=", "=="
    threshold: float
    active: bool = True

    def evaluate(self, value: float) -> bool:
        if not self.active:
            return False

        if self.operator == ">":
            return value > self.threshold
        elif self.operator == "<":
            return value < self.threshold
        elif self.operator == ">=":
            return value >= self.threshold
        elif self.operator == "<=":
            return value <= self.threshold
        elif self.operator == "==":
            return value == self.threshold

        return False

    @staticmethod
    def parse_condition(condition_str: str):
        """Parse condition string like 'AQI > 100' into components."""
        match = re.match(r"(\w+)\s*(>=|<=|>|<|==|!=)\s*([\d\.]+)", condition_str)
        if not match:
            raise ValueError(f"Invalid condition format: {condition_str}")
        metric, operator, threshold = match.groups()
        threshold = float(threshold) if '.' in threshold else int(threshold)
        return metric, operator, threshold

    @staticmethod
    def from_dict(data: dict):
        """
        Create Rule instance from JSON-style dict.
        Expects: id, zone, condition, status (optional)
        """
        id = data.get("id")
        name = data.get("name", "")
        zone = data.get("zone")
        active = data.get("status", "active") == "active"
        
        condition_str = data.get("condition")
        if not condition_str:
            raise ValueError("Missing condition field in rule data")
        
        metric, operator, threshold = Rule.parse_condition(condition_str)

        return Rule(
            id=id,
            name=name,
            zone=zone,
            metric=metric,
            operator=operator,
            threshold=threshold,
            active=active
        )

    def to_dict(self) -> dict:
        """Convert Rule instance back to dictionary including condition string."""
        return {
            "id": self.id,
            "name": self.name,
            "zone": self.zone,
            "metric": self.metric,
            "operator": self.operator,
            "threshold": self.threshold,
            "active": "active" if self.active else "inactive",
            "condition": f"{self.metric.upper()} {self.operator} {self.threshold}"
        }