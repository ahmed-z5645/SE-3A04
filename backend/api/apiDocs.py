from fastapi import APIRouter

router = APIRouter()

endpoints = [
    {"method": "GET", "path": "/api/v1/zones", "desc": "List all zones", "example": "GET /api/v1/zones", "response": "Zone[]"},
    {"method": "GET", "path": "/api/v1/zones/{zoneId}", "desc": "Get zone details", "example": "GET /api/v1/zones/1", "response": "Zone"},
    {"method": "GET", "path": "/api/v1/zones/trends", "desc": "Get zone metric trends", "example": "GET /api/v1/zones/trends", "response": "TrendSeries"},
    {"method": "GET", "path": "/api/v1/alerts", "desc": "List all alerts", "example": "GET /api/v1/alerts", "response": "Alert[]"},
]


@router.get("/endpoints")
def get_endpoints():
    return endpoints
