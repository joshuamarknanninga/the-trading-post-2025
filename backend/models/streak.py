# backend/models/streak.py

from datetime import datetime
from sqlalchemy import Column, Integer, ForeignKey, Date, DateTime
from sqlalchemy.orm import relationship
from server.app import db

class UserStreak(db.Model):
    __tablename__ = 'user_streaks'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), unique=True, nullable=False)
    current_streak = Column(Integer, default=0, nullable=False)  # consecutive login days
    longest_streak = Column(Integer, default=0, nullable=False)
    last_login_date = Column(Date, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship('User', backref='streak')

    def __repr__(self):
        return (
            f"<UserStreak user_id={self.user_id} "
            f"current={self.current_streak} longest={self.longest_streak}>"
        )

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "current_streak": self.current_streak,
            "longest_streak": self.longest_streak,
            "last_login_date": self.last_login_date.isoformat() if self.last_login_date else None,
            "updated_at": self.updated_at.isoformat(),
        }
