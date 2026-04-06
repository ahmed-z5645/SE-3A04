import uuid
from fastapi import APIRouter, HTTPException
from backend.shared.models.account import Account


def create_auth_router(account_db):
    router = APIRouter()

    @router.post("/login")
    def login(payload: dict):
        email = payload.get("email", "").strip().lower()
        password = payload.get("password", "")
        if not email or not password:
            raise HTTPException(status_code=400, detail="Invalid credentials")

        account = account_db.get(email)
        if account and account.check_password(password):
            return {
                "token": f"real-{uuid.uuid4()}",
                "role": account.role,
                "email": account.email,
            }

        raise HTTPException(status_code=401, detail="Invalid email or password")

    @router.post("/register")
    def register(payload: dict):
        email = payload.get("email", "").strip().lower()
        password = payload.get("password", "")
        
        if not email or len(password) < 8:
            raise HTTPException(status_code=400, detail="Invalid registration payload")

        if account_db.get(email):
            raise HTTPException(status_code=409, detail="User already exists")
        
        # Determine role based on email prefix
        role = "admin" if email.startswith("admin") else "operator"

        new_account = Account.from_dict({ "email": email, "password": password, "role": role })
        account_db.add(new_account)
        
        return {
            "token": f"real-{uuid.uuid4()}",
            "role": role,
            "email": email,
        }

    @router.post("/public-session")
    def public_session():
        return {"token": f"real-public-{uuid.uuid4()}", "role": "public", "email": ""}

    return router
