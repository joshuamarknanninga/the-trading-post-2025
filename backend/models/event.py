# backend/models/event.py

from datetime import datetime
from server.app import db  # assumes your Flask app defines `db = SQLAlchemy(app)`

class Event(db.Model):
    """Represents a community trading event (e.g., swap meet)."""
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    date = db.Column(db.String(10), nullable=False)         # format 'YYYY-MM-DD'
    time = db.Column(db.String(5), nullable=True)           # format 'HH:MM'
    location_name = db.Column(db.String(200), nullable=True)
    location_lat = db.Column(db.Float, nullable=True)
    location_lng = db.Column(db.Float, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f'<Event {self.title!r} on {self.date}>'
