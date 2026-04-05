from datetime import datetime
from backend.shared.models.account import Account


class AccountDB:
    def __init__(self):
        self.accounts = {
            "admin": Account(email="admin", password="admin", role="admin", created=datetime.utcnow()),
            "operator": Account(email="operator", password="operator", role="operator", created=datetime.utcnow()),
        }

    def add(self, account):
        if account.email in self.accounts:
            return False
        self.accounts[account.email] = account
        return True

    def get(self, email):
        return self.accounts.get(email)

    def get_all(self):
        return list(self.accounts.values())

    def update(self, account):
        if account.email not in self.accounts:
            return False
        self.accounts[account.email] = account
        return True

    def delete(self, email):
        if email not in self.accounts:
            return False
        del self.accounts[email]
        return True
