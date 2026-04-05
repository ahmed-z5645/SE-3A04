from dataclasses import dataclass
from datetime import datetime


@dataclass
class Account:
    email: str
    password: str
    role: str
    created: datetime
    last_login: datetime = None

    def check_password(self, password: str) -> bool:
        return self.password == password

    def to_dict(self) -> dict:
        return {
            "email": self.email,
            "role": self.role,
            "created": self.created.isoformat(),
            "lastLogin": self.last_login.isoformat() if self.last_login else None,
        }

    @staticmethod
    def from_dict(data: dict):
        return Account(
            email=data.get("email"),
            password=data.get("password"),
            role=data.get("role", "operator"),
            created=data.get("created") if isinstance(data.get("created"), datetime)
            else datetime.fromisoformat(data.get("created")),
            last_login=data.get("last_login") if isinstance(data.get("last_login"), datetime)
            else datetime.fromisoformat(data["last_login"]) if data.get("last_login")
            else None,
        )
