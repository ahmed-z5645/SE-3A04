from fastapi import APIRouter, HTTPException
from datetime import datetime

router = APIRouter()

accounts = [
    {"email": "admin@scemas.ca", "role": "Administrator", "created": "Jan 15, 2026", "lastLogin": "Today 10:42 AM"},
    {"email": "operator1@scemas.ca", "role": "Operator", "created": "Jan 20, 2026", "lastLogin": "Today 09:12 AM"},
]


@router.get("/")
def list_accounts():
    return accounts


@router.post("/")
def create_account(payload: dict):
    email = payload.get("email", "").strip().lower()
    role = payload.get("role", "Operator")
    if not email:
        raise HTTPException(status_code=400, detail="Missing email")
    if any(account["email"] == email for account in accounts):
        raise HTTPException(status_code=409, detail="Account already exists")

    account = {
        "email": email,
        "role": role,
        "created": datetime.utcnow().strftime("%b %d, %Y"),
        "lastLogin": "—",
    }
    accounts.append(account)
    return account


@router.delete("/{email}", status_code=204)
def delete_account(email: str):
    idx = next((i for i, account in enumerate(accounts) if account["email"] == email), None)
    if idx is None:
        raise HTTPException(status_code=404, detail="Account not found")
    accounts.pop(idx)
    return None
