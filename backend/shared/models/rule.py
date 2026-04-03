from dataclasses import dataclass


@dataclass
class Rule:
    rule_id: str
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
    def from_dict(data: dict):
        """Create a Rule instance from a dictionary."""
        return Rule(
            rule_id=data.get("rule_id"),
            zone=data.get("zone"),
            metric=data.get("metric"),
            operator=data.get("operator"),
            threshold=float(data.get("threshold")),
            active=data.get("active", True)
        )