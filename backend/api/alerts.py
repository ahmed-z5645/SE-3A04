from datetime import datetime
from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from backend.alerts.alert_controller import AlertController
from backend.shared.db.alert_db import AlertDB
from backend.shared.models.alert import Alert


def _serialize_alert(alert: Alert) -> dict:
    return {
        "id": alert.alert_id,
        "zone": alert.zone,
        "metric": alert.metric,
        "type": alert.metric,
        "severity": alert.severity,
        "value": str(alert.value),
        "rule": alert.rule,
        "time": alert.timestamp.isoformat() if isinstance(alert.timestamp, datetime) else str(alert.timestamp),
        "status": alert.status,
    }


def create_alert_router(alert_db: AlertDB, alert_controller: AlertController) -> APIRouter:
    router = APIRouter()

    @router.get("/")
    def list_alerts(status: Optional[str] = Query(None, regex="^(active|acknowledged|resolved)$")):
        alerts = alert_db.get_alerts(status) if status else alert_db.get_all_alerts()
        return [_serialize_alert(alert) for alert in alerts]

    @router.get("/{alert_id}")
    def get_alert(alert_id: str):
        alert = alert_db.get_alert(alert_id)
        if not alert:
            raise HTTPException(status_code=404, detail="Alert not found")
        return _serialize_alert(alert)

    @router.post("/{alert_id}/acknowledge")
    def acknowledge_alert(alert_id: str):
        alert = alert_controller.acknowledge_alert(alert_id)
        if not alert:
            raise HTTPException(status_code=404, detail="Alert not found")
        return _serialize_alert(alert)

    @router.post("/{alert_id}/resolve")
    def resolve_alert(alert_id: str):
        alert = alert_controller.resolve_alert(alert_id)
        if not alert:
            raise HTTPException(status_code=404, detail="Alert not found")
        return _serialize_alert(alert)

    return router
