from datetime import datetime

from backend.shared.models.account import Account
from backend.shared.db.account_db import AccountDB
from backend.shared.logger import log


class AccountController:
    def __init__(self, account_db: AccountDB):
        self.account_db = account_db

    def login(self, email: str, password: str):
        account = self.account_db.get(email)
        if account is None:
            log(f"Login failed: account '{email}' not found")
            return None
        if not account.check_password(password):
            log(f"Login failed: wrong password for '{email}'")
            return None
        account.last_login = datetime.utcnow()
        self.account_db.update(account)
        log(f"Login success: '{email}' (role={account.role})")
        return account

    def create_account(self, email: str, password: str, role: str = "operator"):
        if self.account_db.get(email) is not None:
            log(f"Create account failed: '{email}' already exists")
            return None
        account = Account(
            email=email,
            password=password,
            role=role,
            created=datetime.utcnow(),
        )
        self.account_db.add(account)
        log(f"Account created: '{email}' (role={role})")
        return account

    def get_account(self, email: str):
        return self.account_db.get(email)

    def get_all_accounts(self):
        return [a.to_dict() for a in self.account_db.get_all()]

    def delete_account(self, email: str):
        result = self.account_db.delete(email)
        if result:
            log(f"Account deleted: '{email}'")
        return result
