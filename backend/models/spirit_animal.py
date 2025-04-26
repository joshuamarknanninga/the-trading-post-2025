# backend/models/spirit_animal.py

from datetime import datetime
from server.app import db  # assumes your Flask app defines `db = SQLAlchemy(app)`

class SpiritAnimal(db.Model):
    """Stores each user's chosen spirit animal for profile and badge gamification."""
    __tablename__ = 'spirit_animals'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    animal = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationship back to the User
    user = db.relationship(
        'User',
        backref=db.backref('spirit_animal', uselist=False)
    )

    def __repr__(self):
        return f'<SpiritAnimal user_id={self.user_id} animal={self.animal!r}>'
