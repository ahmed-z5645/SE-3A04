import uuid
from fastapi import APIRouter, HTTPException

router = APIRouter()

users = {
    "admin@scemas.ca": {"email": "admin@scemas.ca", "role": "admin", "password": "admin123"},
    "operator@scemas.ca": {"email": "operator@scemas.ca", "role": "operator", "password": "operator123"},
}


@router.post("/login")
def login(payload: dict):
    email = payload.get("email", "").strip().lower()
    password = payload.get("password", "")
    if not email or not password:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    user = users.get(email)
    if user and user["password"] == password:
        return {
            "token": f"real-{uuid.uuid4()}",
            "role": user["role"],
            "email": user["email"],
        }

    raise HTTPException(status_code=401, detail="Invalid email or password")


@router.post("/register")
def register(payload: dict):
    email = payload.get("email", "").strip().lower()
    password = payload.get("password", "")
    if not email or len(password) < 8:
        raise HTTPException(status_code=400, detail="Invalid registration payload")

    if email in users:
        raise HTTPException(status_code=409, detail="User already exists")

    users[email] = {"email": email, "role": "operator", "password": password}
    return {
        "token": f"real-{uuid.uuid4()}",
        "role": "operator",
        "email": email,
    }


@router.post("/public-session")
def public_session():
    return {"token": f"real-public-{uuid.uuid4()}", "role": "public", "email": ""}
