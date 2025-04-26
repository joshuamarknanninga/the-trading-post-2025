# backend/routes/items.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.app import db
from models.item import Item
from models.user import User

items_bp = Blueprint('items', __name__, url_prefix='/api/items')


@items_bp.route('', methods=['GET'])
def list_items():
    """
    List all items (new, resale, or barter) in the marketplace.
    Optional query params could be added for filtering (e.g., category, price).
    """
    items = Item.query.order_by(Item.created_at.desc()).all()
    result = []
    for it in items:
        owner = User.query.get(it.owner_id)
        result.append({
            'id': it.id,
            'title': it.title,
            'description': it.description,
            'owner': {
                'id': owner.id,
                'full_name': owner.full_name
            } if owner else None,
            'latitude': it.latitude,
            'longitude': it.longitude,
            'category': it.category,
            'price': it.price,
            'currency_type': it.currency_type,
            'icon': it.icon,
            'created_at': it.created_at.isoformat()
        })
    return jsonify(result), 200


@items_bp.route('/<int:item_id>', methods=['GET'])
def get_item(item_id):
    """
    Retrieve a single item by ID.
    """
    it = Item.query.get_or_404(item_id)
    owner = User.query.get(it.owner_id)
    return jsonify({
        'id': it.id,
        'title': it.title,
        'description': it.description,
        'owner': {
            'id': owner.id,
            'full_name': owner.full_name
        } if owner else None,
        'latitude': it.latitude,
        'longitude': it.longitude,
        'category': it.category,
        'price': it.price,
        'currency_type': it.currency_type,
        'icon': it.icon,
        'created_at': it.created_at.isoformat()
    }), 200


@items_bp.route('', methods=['POST'])
@jwt_required()
def create_item():
    """
    Create a new item listing.
    Expects JSON:
      {
        "title": "...",
        "description": "...",
        "latitude": <float>,
        "longitude": <float>,
        "category": "...",
        "price": <float|null>,
        "currency_type": "usd"|"barter"|"hybrid",
        "icon": "path_or_url_to_icon"
      }
    """
    data = request.get_json() or {}
    required = ['title', 'currency_type']
    for field in required:
        if not data.get(field):
            return jsonify({'message': f'{field} is required.'}), 400

    user_id = get_jwt_identity()
    it = Item(
        title=data['title'],
        description=data.get('description'),
        owner_id=user_id,
        latitude=data.get('latitude'),
        longitude=data.get('longitude'),
        category=data.get('category'),
        price=data.get('price'),
        currency_type=data['currency_type'],
        icon=data.get('icon')
    )
    db.session.add(it)
    db.session.commit()

    return jsonify({'id': it.id}), 201


@items_bp.route('/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_item(item_id):
    """
    Update an existing item.
    Only the owner or an admin can update.
    Accepts any of the item fields in JSON body.
    """
    it = Item.query.get_or_404(item_id)
    user = User.query.get(get_jwt_identity())
    if it.owner_id != user.id and user.role != 'admin':
        return jsonify({'message': 'Permission denied.'}), 403

    data = request.get_json() or {}
    updatable = ['title', 'description', 'latitude', 'longitude',
                 'category', 'price', 'currency_type', 'icon']
    for field in updatable:
        if field in data:
            setattr(it, field, data[field])

    db.session.commit()
    return jsonify({'message': 'Item updated.'}), 200


@items_bp.route('/<int:item_id>', methods=['DELETE'])
@jwt_required()
def delete_item(item_id):
    """
    Delete an item listing.
    Only the owner or an admin can delete.
    """
    it = Item.query.get_or_404(item_id)
    user = User.query.get(get_jwt_identity())
    if it.owner_id != user.id and user.role != 'admin':
        return jsonify({'message': 'Permission denied.'}), 403

    db.session.delete(it)
    db.session.commit()
    return jsonify({'message': 'Item deleted.'}), 200


# In server/app.py, register this blueprint:
# from routes.items import items_bp
# app.register_blueprint(items_bp)
