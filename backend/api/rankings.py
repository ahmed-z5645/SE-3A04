from fastapi import APIRouter, Query
from backend.sensor.sensor_controller import SensorController


def create_rankings_router(sensor_controller: SensorController) -> APIRouter:
    router = APIRouter()

    @router.get("/")
    def list_rankings(
        sort_by: str = Query("aqi", alias="sortBy", regex="^(aqi|temp|noise|humidity)$"),
        search: str = Query("", alias="search"),
    ):
        return sensor_controller.get_rankings(sort_by=sort_by, search=search)

    return router
