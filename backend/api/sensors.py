from datetime import datetime
from typing import Optional

from fastapi import APIRouter, HTTPException

from backend.shared.db.sensor_db import SensorDB


def _format_last_ping(timestamp: datetime) -> str:
    if not isinstance(timestamp, datetime):
        return str(timestamp)

    delta = datetime.utcnow() - timestamp
    if delta.days > 0:
        return f"{delta.days}d ago"

    seconds = int(delta.total_seconds())
    if seconds < 60:
        return f"{seconds}s ago"
    if seconds < 3600:
        return f"{seconds // 60}m ago"
    return f"{seconds // 3600}h ago"


def _format_sensor(sensor) -> dict:
    last_ping = _format_last_ping(sensor.timestamp)
    status = "online" if (datetime.utcnow() - sensor.timestamp).total_seconds() < 300 else "offline"
    return {
        "id": sensor.id,
        "zone": sensor.zone,
        "type": sensor.metric,
        "metric": sensor.metric,
        "status": status,
        "lastPing": last_ping,
        "battery": "n/a",
    }


def create_sensor_router(sensor_db: SensorDB) -> APIRouter:
    router = APIRouter()

    @router.get("/")
    def list_sensors():
        sensors = sensor_db.get_recent_data()
        return [_format_sensor(sensor) for sensor in sensors.values()]

    @router.get("/{sensor_id}")
    def get_sensor(sensor_id: str):
        sensor = sensor_db.get_recent_data().get(sensor_id)
        if not sensor:
            raise HTTPException(status_code=404, detail="Sensor not found")
        return _format_sensor(sensor)

    return router
