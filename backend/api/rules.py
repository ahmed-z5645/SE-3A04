from uuid import uuid4

from fastapi import APIRouter, HTTPException

from backend.shared.db.rule_db import RuleDB
from backend.shared.models.rule import Rule


def create_rule_router(rule_db: RuleDB) -> APIRouter:
    router = APIRouter()

    @router.get("/")
    def list_rules():
        return [rule.to_dict() for rule in rule_db.get_rules()]

    @router.post("/")
    def create_rule(payload: dict):
        if not payload.get("name") or not payload.get("condition") or not payload.get("zone"):
            raise HTTPException(status_code=400, detail="Missing required rule fields")

        rule_data = {
            "id": str(uuid4()),
            "name": payload["name"],
            "condition": payload["condition"],
            "zone": payload["zone"],
            "status": payload.get("status", "active"),
        }
        rule = Rule.from_dict(rule_data)
        rule_db.add_rule(rule)
        return rule.to_dict()

    @router.delete("/{rule_id}", status_code=204)
    def delete_rule(rule_id: str):
        deleted = rule_db.delete_rule(rule_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Rule not found")

    return router
