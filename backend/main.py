from fastapi import FastAPI
import asyncio
import uuid

from fastapi.middleware.cors import CORSMiddleware
from backend.alerts.alert_controller import AlertController
from backend.sensor.sensor_controller import SensorController
from backend.sensor.simulator import run_sensor_simulation
from backend.shared.db.sensor_db import SensorDB
from backend.shared.db.alert_db import AlertDB
from backend.shared.db.rule_db import RuleDB
from backend.shared.db.zone_db import ZoneDB
from backend.shared.db.account_db import AccountDB
from backend.shared.models.rule import Rule
from backend.api.alerts import create_alert_router
from backend.api.sensors import create_sensor_router
from backend.api.rules import create_rule_router
from backend.api.zones import create_zone_router
from backend.api.rankings import create_rankings_router
from backend.api.auth import create_auth_router
from backend.api.accounts import create_account_router
from backend.api.audit import router as audit_router
from backend.api.apiDocs import router as api_docs_router

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize databases
sensor_db = SensorDB()
alert_db = AlertDB()
rule_db = RuleDB()
zone_db = ZoneDB()
account_db = AccountDB()


RULES = [
    {"id": str(uuid.uuid4()), "name": "High AQI Downtown", "zone": "Downtown Core", "condition": "AQI > 100", "status": "active"},
    {"id": str(uuid.uuid4()), "name": "High AQI Toronto", "zone": "Toronto", "condition": "AQI > 120", "status": "active"},
    {"id": str(uuid.uuid4()), "name": "High Temp Hamilton", "zone": "Hamilton", "condition": "Temp > 35", "status": "active"},
    {"id": str(uuid.uuid4()), "name": "High Temp Downtown", "zone": "Downtown Core", "condition": "Temp > 33", "status": "active"},
    {"id": str(uuid.uuid4()), "name": "Low Humidity Harbour", "zone": "Harbour District", "condition": "Humidity < 25", "status": "active"},
    {"id": str(uuid.uuid4()), "name": "Low Humidity Mountain", "zone": "Mountain", "condition": "Humidity < 20", "status": "active"},
    {"id": str(uuid.uuid4()), "name": "High Noise Downtown", "zone": "Downtown Core", "condition": "Noise > 85", "status": "active"},
    {"id": str(uuid.uuid4()), "name": "High Noise Brampton", "zone": "Brampton", "condition": "Noise > 90", "status": "active"},
    {"id": str(uuid.uuid4()), "name": "High AQI Westdale", "zone": "Westdale", "condition": "AQI > 80", "status": "active"},
    {"id": str(uuid.uuid4()), "name": "Low Humidity Mississauga", "zone": "Mississauga", "condition": "Humidity < 30", "status": "active"},
    {"id": str(uuid.uuid4()), "name": "High Temp Oakville", "zone": "Oakville", "condition": "Temp > 30", "status": "active"},
    {"id": str(uuid.uuid4()), "name": "High Noise Harbour", "zone": "Harbour District", "condition": "Noise > 88", "status": "active"},
]

for rule in RULES:
    rule_db.add_rule(Rule.from_dict(rule))

# Initialize controllers
alert_controller = AlertController(alert_db, rule_db, zone_db)
sensor_controller = SensorController(sensor_db, alert_controller, zone_db)

@app.on_event("startup")
async def start_sensor_simulation():
    app.state.sensor_simulator_task = asyncio.create_task(
        run_sensor_simulation(sensor_controller, interval_seconds=0.5)
    )

@app.on_event("shutdown")
async def stop_sensor_simulation():
    task = getattr(app.state, "sensor_simulator_task", None)
    if task:
        task.cancel()
        try:
            await task
        except asyncio.CancelledError:
            pass

app.include_router(create_zone_router(zone_db), prefix="/api/v1/zones")
app.include_router(create_alert_router(alert_db, alert_controller), prefix="/api/v1/alerts")
app.include_router(create_sensor_router(sensor_db), prefix="/api/v1/sensors")
app.include_router(create_rankings_router(sensor_controller), prefix="/api/v1/rankings")
app.include_router(create_rule_router(rule_db), prefix="/api/v1/rules")
app.include_router(create_auth_router(account_db), prefix="/api/v1/auth")
app.include_router(create_account_router(account_db), prefix="/api/v1/accounts")
app.include_router(audit_router, prefix="/api/v1/audit")
app.include_router(api_docs_router, prefix="/api/v1/meta")
