from fastapi import APIRouter

router = APIRouter()

audit_log = [
    {"time": "10:42 AM", "user": "admin@scemas.ca", "action": "Created alert rule", "detail": "AQI > 100 for West End"},
    {"time": "10:15 AM", "user": "operator1@scemas.ca", "action": "Acknowledged alert", "detail": "ALT-003 — Temperature"},
    {"time": "09:58 AM", "user": "admin@scemas.ca", "action": "Updated account", "detail": "operator2@scemas.ca role changed"},
    {"time": "09:30 AM", "user": "system", "action": "Sensor offline", "detail": "Sensor SN-042 in Industrial Park"},
    {"time": "09:12 AM", "user": "operator1@scemas.ca", "action": "Resolved alert", "detail": "ALT-004 — Air Quality"},
]


@router.get("/")
def list_audit_log():
    return audit_log
