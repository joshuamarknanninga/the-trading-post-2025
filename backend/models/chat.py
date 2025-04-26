# backend/models/chat.py

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from server.app import db  # Assumes your Flask app defines `db = SQLAlchemy(app)`

class ChatMessage(db.Model):
    """Represents a one-to-one or group chat message between users."""
    __tablename__ = 'chat_messages'

    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    recipient_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    read = db.Column(db.Boolean, default=False, nullable=False)

    # Relationships for convenient access
    sender = db.relationship(
        'User',
        foreign_keys=[sender_id],
        backref=db.backref('sent_messages', lazy='dynamic')
    )
    recipient = db.relationship(
        'User',
        foreign_keys=[recipient_id],
        backref=db.backref('received_messages', lazy='dynamic')
    )

    def __repr__(self):
        return f'<ChatMessage {self.id} from {self.sender_id} to {self.recipient_id}>'
