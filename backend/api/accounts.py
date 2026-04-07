from fastapi import APIRouter, HTTPException
from datetime import datetime

from backend.shared.db.account_db import AccountDB
from backend.shared.models.account import Account


def create_account_router(account_db: AccountDB) -> APIRouter:
    router = APIRouter()

    @router.get("/")
    def list_accounts():
        accounts = account_db.get_all()
        return [account.to_dict() for account in accounts]

    @router.post("/")
    def create_account(payload: dict):
        email = payload.get("email", "").strip().lower()
        password = payload.get("password", "")
        role = payload.get("role", "operator")

        if not email or not password:
            raise HTTPException(status_code=400, detail="Missing email or password")

        if account_db.get(email):
            raise HTTPException(status_code=409, detail="Account already exists")

        account = Account(
            email=email,
            password=password,
            role=role,
            created=datetime.utcnow(),
            last_login=None,
        )
        if account_db.add(account):
            return account.to_dict()
        raise HTTPException(status_code=400, detail="Failed to create account")

    @router.delete("/{email}", status_code=204)
    def delete_account(email: str):
        email = email.strip().lower()
        if not account_db.delete(email):
            raise HTTPException(status_code=404, detail="Account not found")
        return None

    return router
