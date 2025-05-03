# backend/models/shop_item.py

from datetime import datetime
from sqlalchemy import Column, Integer, ForeignKey, Numeric, Boolean, DateTime
from sqlalchemy.orm import relationship
from server.app import db


class ShopItem(db.Model):
    __tablename__ = 'shop_items'

    id = Column(Integer, primary_key=True)
    shop_id = Column(Integer, ForeignKey('shops.id'), nullable=False)
    item_id = Column(Integer, ForeignKey('items.id'), nullable=False)
    price = Column(Numeric(10, 2), nullable=True)   # real‐money price
    token_price = Column(Integer, default=0)        # internal token cost
    barter_only = Column(Boolean, default=False)    # if True, cannot purchase with money/tokens
    display_order = Column(Integer, default=0)      # ordering in the shop UI
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow,
                        onupdate=datetime.utcnow, nullable=False)

    # Relationships
    shop = relationship('Shop', backref='items')
    item = relationship('Item')

    def __repr__(self):
        return (f"<ShopItem id={self.id} shop_id={self.shop_id} "
                f"item_id={self.item_id} price={self.price}>")

    def to_dict(self):
        return {
            "id": self.id,
            "shop_id": self.shop_id,
            "item": self.item.to_dict() if self.item else None,
            "price": float(self.price) if self.price is not None else None,
            "token_price": self.token_price,
            "barter_only": self.barter_only,
            "display_order": self.display_order,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
