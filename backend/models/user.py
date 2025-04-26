# backend/models/user.py

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from server.app import db  # assumes your Flask app defines `db = SQLAlchemy(app)`

class User(db.Model):
    """Represents a user of The Trading Post."""
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    address = db.Column(db.String(200), nullable=True)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    role = db.Column(db.String(20), default='user', nullable=False)  # e.g., 'user', 'admin'
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # --- Relationships ---
    items = db.relationship('Item', backref='owner', lazy='dynamic')
    sent_messages = db.relationship(
        'ChatMessage',
        foreign_keys='ChatMessage.sender_id',
        backref='sender',
        lazy='dynamic'
    )
    received_messages = db.relationship(
        'ChatMessage',
        foreign_keys='ChatMessage.recipient_id',
        backref='recipient',
        lazy='dynamic'
    )
    user_badges = db.relationship('UserBadge', backref='user', lazy='dynamic')
    sales = db.relationship(
        'TradeHistory',
        foreign_keys='TradeHistory.seller_id',
        backref='seller',
        lazy='dynamic'
    )
    purchases = db.relationship(
        'TradeHistory',
        foreign_keys='TradeHistory.buyer_id',
        backref='buyer',
        lazy='dynamic'
    )
    referrals_made = db.relationship(
        'Referral',
        foreign_keys='Referral.referrer_id',
        backref='referrer',
        lazy='dynamic'
    )
    referred_by = db.relationship(
        'Referral',
        foreign_keys='Referral.referee_id',
        backref='referee',
        lazy='dynamic'
    )
    forum_posts = db.relationship('ForumPost', backref='author', lazy='dynamic')
    forum_replies = db.relationship('ForumReply', backref='author', lazy='dynamic')
    reports_made = db.relationship('Report', backref='reporter', lazy='dynamic')
    meetups = db.relationship('Meetup', backref='user', lazy='dynamic')
    wallet = db.relationship('Wallet', uselist=False, backref='user')
    wrapped_summary = db.relationship('TradingWrapped', uselist=False, backref='user')
    spirit_animal = db.relationship('SpiritAnimal', uselist=False, backref='user')

    def set_password(self, password: str):
        """Hashes and sets the user's password."""
        self.password_hash = generate_password_hash(password)

    @staticmethod
    def hash_password(password: str) -> str:
        """Utility to hash a password without setting it."""
        return generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        """Returns True if the password matches the stored hash."""
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User id={self.id} email={self.email!r}>'
