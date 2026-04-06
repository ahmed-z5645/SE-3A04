from datetime import datetime
from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from backend.alerts.alert_controller import AlertController
from backend.shared.db.alert_db import AlertDB
from backend.shared.models.alert import Alert


def create_alert_router(alert_db: AlertDB, alert_controller: AlertController) -> APIRouter:
    router = APIRouter()

    @router.get("/")
    def list_alerts(status: Optional[str] = Query(None, regex="^(active|acknowledged|resolved)$")):
        alerts = alert_db.get_all_alerts()
        if status == None:
            return [alert for alert in alerts]
        filtered_alerts = []
        for alert in alerts:
            if alert.status == status:
                filtered_alerts.append(alert)
        return filtered_alerts

    @router.get("/{alert_id}")
    def get_alert(alert_id: str):
        alert = alert_db.get_alert(alert_id)
        if not alert:
            raise HTTPException(status_code=404, detail="Alert not found")
        return alert

    @router.post("/{alert_id}/acknowledge")
    def acknowledge_alert(alert_id: str):
        alert = alert_controller.acknowledge_alert(alert_id)
        if not alert:
            raise HTTPException(status_code=404, detail="Alert not found")
        return alert

    @router.post("/{alert_id}/resolve")
    def resolve_alert(alert_id: str):
        alert = alert_controller.resolve_alert(alert_id)
        if not alert:
            raise HTTPException(status_code=404, detail="Alert not found")
        return alert

    return router
