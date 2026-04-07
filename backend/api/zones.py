from fastapi import APIRouter, HTTPException
from backend.shared.db.zone_db import ZoneDB


def create_zone_router(zone_db: ZoneDB) -> APIRouter:
    router = APIRouter()

    @router.get("/")
    def list_zones():
        return zone_db.get_all_zones()

    @router.get("/trends")
    def zone_trends():
        return zone_db.get_trend_series()

    @router.get("/{zone_id}")
    def get_zone(zone_id: str):
        zone = zone_db.get_zone_by_id(zone_id)
        if not zone:
            raise HTTPException(status_code=404, detail="Zone not found")
        return zone

    return router
