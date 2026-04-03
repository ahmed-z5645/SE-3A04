class AlertDB:
    def __init__(self):
        self.alerts = {}

    def add_alert(self, alert_info):
        self.alerts[alert_info.alert_id] = alert_info
        return True

    def get_alert(self, alert_id):
        return self.alerts.get(alert_id)

    def get_all_alerts(self):
        return list(self.alerts.values())

    def get_active_alerts(self):
        return [
            a for a in self.alerts.values()
            if a.status == "active"
        ]

    def update_alert(self, alert_info):
        self.alerts[alert_info.alert_id] = alert_info
        return True