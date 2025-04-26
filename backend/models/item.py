# backend/models/item.py

from datetime import datetime
from server.app import db  # Assumes your Flask app defines `db = SQLAlchemy(app)`

class Item(db.Model):
    """Represents an item listed for sale or barter."""
    __tablename__ = 'items'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    category = db.Column(db.String(100), nullable=True)      # e.g., 'electronics', 'furniture'
    price = db.Column(db.Float, nullable=True)               # e.g., 49.99; NULL if barter-only
    currency_type = db.Column(db.String(20), nullable=False) # 'usd', 'barter', or 'hybrid'
    icon = db.Column(db.String(200), nullable=True)          # path or URL to category icon
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationship to the user who owns this item
    owner = db.relationship(
        'User',
        backref=db.backref('items', lazy='dynamic')
    )

    def __repr__(self):
        return f'<Item id={self.id} title={self.title!r} owner={self.owner_id}>'
