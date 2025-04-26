# backend/models/wallet.py

from datetime import datetime
from server.app import db  # Assumes your Flask app defines `db = SQLAlchemy(app)`

class Wallet(db.Model):
    """Represents a user's wallet holding tokens and cryptocurrency balance."""
    __tablename__ = 'wallets'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    tokens = db.Column(db.Integer, default=0, nullable=False)
    crypto_balance = db.Column(db.Float, default=0.0, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # One-to-many: a wallet can have many transactions
    transactions = db.relationship(
        'Transaction',
        backref='wallet',
        lazy='dynamic',
        cascade='all, delete-orphan'
    )

    def __repr__(self):
        return (
            f'<Wallet id={self.id} user_id={self.user_id} '
            f'tokens={self.tokens} crypto_balance={self.crypto_balance}>'
        )


class Transaction(db.Model):
    """Records a token or cryptocurrency operation on a user's wallet."""
    __tablename__ = 'transactions'

    id = db.Column(db.Integer, primary_key=True)
    wallet_id = db.Column(db.Integer, db.ForeignKey('wallets.id'), nullable=False)
    type = db.Column(db.String(50), nullable=False)      # e.g., 'earn', 'spend', 'transfer'
    amount = db.Column(db.Float, nullable=False)         # positive for credit, negative for debit
    currency = db.Column(db.String(20), nullable=False)  # e.g., 'token' or 'crypto'
    description = db.Column(db.String(200), nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return (
            f'<Transaction id={self.id} wallet_id={self.wallet_id} '
            f'type={self.type!r} amount={self.amount} currency={self.currency!r}>'
        )
