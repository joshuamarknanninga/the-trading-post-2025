# backend/models/meetup.py

from datetime import datetime
from server.app import db  # Assumes your Flask app defines `db = SQLAlchemy(app)`

class Meetup(db.Model):
    """Represents a user's RSVP or status for a community Event."""
    __tablename__ = 'meetups'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    status = db.Column(
        db.String(50),
        nullable=False,
        default='interested'
    )  # e.g., 'attending', 'interested', 'not attending'
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationships for easy access
    user = db.relationship(
        'User',
        backref=db.backref('meetups', lazy='dynamic')
    )
    event = db.relationship(
        'Event',
        backref=db.backref('meetups', lazy='dynamic')
    )

    def __repr__(self):
        return (f"<Meetup id={self.id} user_id={self.user_id} "
                f"event_id={self.event_id} status={self.status!r}>")
