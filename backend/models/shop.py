# backend/models/shop.py

from datetime import datetime
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from server.app import db


class Shop(db.Model):
    __tablename__ = 'shops'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), unique=True, nullable=False)
    name = Column(String(150), nullable=False)
    slug = Column(String(150), unique=True, nullable=False)  # URL‐friendly identifier
    description = Column(String(500), nullable=True)
    theme = Column(String(100), default='default', nullable=False)  # e.g. 'default', 'dark', 'retro'
    logo_url = Column(String(255), nullable=True)
    banner_url = Column(String(255), nullable=True)
    is_public = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # relationships
    owner = relationship('User', backref='shop', uselist=False)
    items = relationship('ShopItem', backref='shop', cascade='all, delete-orphan')

    def __repr__(self):
        return f"<Shop id={self.id} name={self.name!r} owner={self.user_id}>"

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "slug": self.slug,
            "description": self.description,
            "theme": self.theme,
            "logo_url": self.logo_url,
            "banner_url": self.banner_url,
            "is_public": self.is_public,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "items": [item.to_dict() for item in self.items],
        }
