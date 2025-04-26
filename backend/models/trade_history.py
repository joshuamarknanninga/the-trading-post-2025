# backend/models/trade_history.py

from datetime import datetime
from server.app import db  # Assumes your Flask app defines `db = SQLAlchemy(app)`

class TradeHistory(db.Model):
    """Records a completed trade or sale of an item between users."""
    __tablename__ = 'trade_history'

    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=False)
    seller_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    buyer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    price = db.Column(db.Float, nullable=True)               # NULL if barter-only
    currency_type = db.Column(db.String(20), nullable=False) # e.g. 'usd', 'barter', 'hybrid'
    date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationships for convenient access
    item = db.relationship(
        'Item',
        backref=db.backref('trade_history', lazy='dynamic')
    )
    seller = db.relationship(
        'User',
        foreign_keys=[seller_id],
        backref=db.backref('sales', lazy='dynamic')
    )
    buyer = db.relationship(
        'User',
        foreign_keys=[buyer_id],
        backref=db.backref('purchases', lazy='dynamic')
    )

    def __repr__(self):
        return (f"<TradeHistory id={self.id} item={self.item_id} "
                f"seller={self.seller_id} buyer={self.buyer_id} "
                f"price={self.price} {self.currency_type}>")
