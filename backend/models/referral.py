# backend/models/referral.py

from datetime import datetime
from server.app import db  # assumes your Flask app defines `db = SQLAlchemy(app)`

class Referral(db.Model):
    """Tracks when a user refers another user and any tokens awarded."""
    __tablename__ = 'referrals'

    id = db.Column(db.Integer, primary_key=True)
    referrer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    referee_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    tokens_awarded = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationships for convenient access
    referrer = db.relationship(
        'User',
        foreign_keys=[referrer_id],
        backref=db.backref('referrals_made', lazy='dynamic')
    )
    referee = db.relationship(
        'User',
        foreign_keys=[referee_id],
        backref=db.backref('referred_by', lazy='dynamic')
    )

    def __repr__(self):
        return (
            f"<Referral id={self.id} referrer={self.referrer_id} "
            f"referee={self.referee_id} tokens={self.tokens_awarded}>"
        )
