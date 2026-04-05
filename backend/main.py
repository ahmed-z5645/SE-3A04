from fastapi import FastAPI
from backend.alerts.alert_controller import AlertController
from backend.sensor.sensor_controller import SensorController
from backend.shared.db.sensor_db import SensorDB
from backend.shared.db.alert_db import AlertDB
from backend.shared.db.rule_db import RuleDB
from backend.shared.db.zone_db import ZoneDB
from backend.api.alerts import create_alert_router
from backend.api.sensors import create_sensor_router
from backend.api.rules import create_rule_router
from backend.api.zones import create_zone_router
from backend.api.rankings import create_rankings_router
from backend.api.auth import router as auth_router
from backend.api.accounts import router as accounts_router
from backend.api.audit import router as audit_router
from backend.api.apiDocs import router as api_docs_router

app = FastAPI()

# Initialize databases
sensor_db = SensorDB()
alert_db = AlertDB()
rule_db = RuleDB()
zone_db = ZoneDB()

# Initialize controllers
alert_controller = AlertController(alert_db, rule_db, zone_db)
sensor_controller = SensorController(sensor_db, alert_controller, zone_db)

app.include_router(create_zone_router(zone_db), prefix="/api/v1/zones")
app.include_router(create_alert_router(alert_db, alert_controller), prefix="/api/v1/alerts")
app.include_router(create_sensor_router(sensor_db), prefix="/api/v1/sensors")
app.include_router(create_rankings_router(sensor_controller), prefix="/api/v1/rankings")
app.include_router(create_rule_router(rule_db), prefix="/api/v1/rules")
app.include_router(auth_router, prefix="/api/v1/auth")
app.include_router(accounts_router, prefix="/api/v1/accounts")
app.include_router(audit_router, prefix="/api/v1/audit")
app.include_router(api_docs_router, prefix="/api/v1/meta")
