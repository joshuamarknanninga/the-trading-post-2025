# backend/routes/marketplace.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.app import db
from models.item import Item
from models.user import User
from utils.map_helpers import calculate_distance  # assume this computes distance in km/miles

marketplace_bp = Blueprint('marketplace', __name__, url_prefix='/api/marketplace')


@marketplace_bp.route('', methods=['GET'])
def list_marketplace():
    """
    List marketplace items (new, resale, barter) with optional filters:
      - category: string
      - currency_type: 'usd', 'barter', 'hybrid'
      - min_price, max_price: floats
      - lat, lng, radius: for proximity filtering
    """
    query = Item.query
    # Filter by category
    category = request.args.get('category')
    if category:
        query = query.filter(Item.category.ilike(f"%{category}%"))
    # Filter by currency type
    ctype = request.args.get('currency_type')
    if ctype:
        query = query.filter_by(currency_type=ctype)
    # Filter by price range
    try:
        min_price = float(request.args.get('min_price'))
        query = query.filter(Item.price >= min_price)
    except (TypeError, ValueError):
        pass
    try:
        max_price = float(request.args.get('max_price'))
        query = query.filter(Item.price <= max_price)
    except (TypeError, ValueError):
        pass

    items = query.order_by(Item.created_at.desc()).all()

    # Proximity filter
    lat = request.args.get('lat', type=float)
    lng = request.args.get('lng', type=float)
    radius = request.args.get('radius', type=float)  # in kilometers
    result = []
    for it in items:
        if lat is not None and lng is not None and radius is not None:
            if it.latitude is None or it.longitude is None:
                continue
            dist = calculate_distance(lat, lng, it.latitude, it.longitude)
            if dist > radius:
                continue
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


@marketplace_bp.route('/<int:item_id>', methods=['GET'])
def get_listing(item_id):
    """
    Retrieve a single marketplace listing by ID.
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


@marketplace_bp.route('', methods=['POST'])
@jwt_required()
def create_listing():
    """
    Create a new listing.
    Expects JSON:
      {
        "title": "...", "description": "...",
        "latitude": float, "longitude": float,
        "category": "...", "price": float|null,
        "currency_type": "usd"|"barter"|"hybrid",
        "icon": "path_or_url"
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


@marketplace_bp.route('/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_listing(item_id):
    """
    Update an existing listing. Only owner or admin can update.
    Accepts any of the item fields in JSON body.
    """
    it = Item.query.get_or_404(item_id)
    user = User.query.get(get_jwt_identity())
    if it.owner_id != user.id and user.role != 'admin':
        return jsonify({'message': 'Permission denied.'}), 403

    data = request.get_json() or {}
    updatable = [
        'title', 'description', 'latitude', 'longitude',
        'category', 'price', 'currency_type', 'icon'
    ]
    for field in updatable:
        if field in data:
            setattr(it, field, data[field])

    db.session.commit()
    return jsonify({'message': 'Listing updated.'}), 200


@marketplace_bp.route('/<int:item_id>', methods=['DELETE'])
@jwt_required()
def delete_listing(item_id):
    """
    Delete a listing. Only owner or admin can delete.
    """
    it = Item.query.get_or_404(item_id)
    user = User.query.get(get_jwt_identity())
    if it.owner_id != user.id and user.role != 'admin':
        return jsonify({'message': 'Permission denied.'}), 403

    db.session.delete(it)
    db.session.commit()
    return jsonify({'message': 'Listing deleted.'}), 200


# Register this blueprint in server/app.py:
# from routes.marketplace import marketplace_bp
# app.register_blueprint(marketplace_bp)
