# backend/routes/map.py

from flask import Blueprint, jsonify
from server.app import db
from models.item import Item
from models.user import User

map_bp = Blueprint('map', __name__, url_prefix='/api/map')


@map_bp.route('/pins', methods=['GET'])
def get_map_pins():
    """
    Returns pin data for all marketplace items.
    Each pin includes:
      - id
      - title
      - description
      - latitude, longitude
      - category
      - price (or null for barter-only)
      - currency_type ('usd', 'barter', 'hybrid')
      - icon (URL/path to icon image)
      - badges: list of owner's badges (title, color, icon)
    """
    items = Item.query.all()
    pins = []

    for item in items:
        owner = User.query.get(item.owner_id)
        # Collect any badges the owner has earned
        badges = [
            {
                "title": ub.badge.title,
                "color": ub.badge.color,
                "icon": ub.badge.icon
            }
            for ub in owner.user_badges
        ] if owner and hasattr(owner, 'user_badges') else []

        pins.append({
            "id": item.id,
            "title": item.title,
            "description": item.description,
            "latitude": item.latitude,
            "longitude": item.longitude,
            "category": item.category,
            "price": item.price,
            "currency_type": item.currency_type,
            "icon": item.icon,
            "badges": badges
        })

    return jsonify(pins), 200


# In your server/app.py, register this blueprint:
# from routes.map import map_bp
# app.register_blueprint(map_bp)
