class AlertDB:
    def __init__(self):
        self.alerts = {}

    def add_alert(self, alert_info):
        self.alerts[alert_info.id] = alert_info
        return True

    def get_alert(self, id):
        return self.alerts.get(id)

    def get_all_alerts(self):
        return list(self.alerts.values())

    def get_active_alerts(self):
        return [
            a for a in self.alerts.values()
            if a.status == "active"
        ]

    def get_alerts_by_zone(self, zone: str, status: str = None):
        filtered = [
            a for a in self.alerts.values()
            if a.zone == zone
        ]
        if status:
            filtered = [a for a in filtered if a.status == status]
        return filtered

    def update_alert(self, alert_info):
        self.alerts[alert_info.alert_id] = alert_info
        return True