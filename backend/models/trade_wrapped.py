# backend/models/trade_wrapped.py

from datetime import datetime
from server.app import db  # assumes your Flask app defines `db = SQLAlchemy(app)`

class TradingWrapped(db.Model):
    """
    Stores the “year-in-review” summary for each user,
    similar to Spotify Wrapped but for trades.
    """
    __tablename__ = 'trading_wrapped'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    total_trades = db.Column(db.Integer, nullable=False, default=0)
    most_traded_category = db.Column(db.String(100), nullable=True)
    top_item = db.Column(db.String(200), nullable=True)
    favorite_trader = db.Column(db.String(200), nullable=True)

    # You can store multiple badge titles as a JSON-encoded string or comma-separated list
    badges_earned = db.Column(db.Text, nullable=True)
    trader_motto = db.Column(db.String(300), nullable=True)
    spirit_animal = db.Column(db.String(100), nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationship back to User
    user = db.relationship(
        'User',
        backref=db.backref('wrapped_summary', uselist=False)
    )

    def __repr__(self):
        return (
            f"<TradingWrapped user={self.user_id} trades={self.total_trades} "
            f"category={self.most_traded_category!r}>"
        )
