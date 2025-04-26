# backend/models/badges.py

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from server.app import db  # assumes your Flask app defines `db = SQLAlchemy(app)`

class Badge(db.Model):
    """Defines a badge that can be earned by users for achievements."""
    __tablename__ = 'badges'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    icon = db.Column(db.String(100), nullable=True)      # e.g. emoji or icon class
    color = db.Column(db.String(20), nullable=True)      # e.g. Tailwind color class
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Badge {self.title!r}>'


class UserBadge(db.Model):
    """Associates a Badge with a User and tracks when it was awarded."""
    __tablename__ = 'user_badges'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    badge_id = db.Column(db.Integer, db.ForeignKey('badges.id'), nullable=False)
    awarded_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships for convenient access
    user = db.relationship('User', backref=db.backref('user_badges', lazy='dynamic'))
    badge = db.relationship('Badge', backref=db.backref('user_badges', lazy='dynamic'))

    def __repr__(self):
        return f'<UserBadge user={self.user_id} badge={self.badge_id}>'
