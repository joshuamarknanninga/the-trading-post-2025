# backend/routes/shop_items.py

from flask import Blueprint, jsonify, request, abort
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.app import db
from models.shop import Shop
from models.shop_item import ShopItem
from models.item import Item

shop_items_bp = Blueprint('shop_items', __name__, url_prefix='/api/shop_items')


@shop_items_bp.route('/<int:shop_id>', methods=['GET'])
def list_shop_items(shop_id):
    """Public: List all items in a given shop."""
    shop = Shop.query.get_or_404(shop_id)
    items = [si.to_dict() for si in shop.items]
    return jsonify(items), 200


@shop_items_bp.route('/', methods=['POST'])
@jwt_required()
def create_shop_item():
    """
    Authenticated: Add an item to the authenticated user's shop.
    JSON body must include: shop_id, item_id.
    Optional: price, token_price, barter_only, display_order.
    """
    user_id = get_jwt_identity()
    data = request.get_json() or {}

    shop_id = data.get('shop_id')
    item_id = data.get('item_id')
    if not shop_id or not item_id:
        return jsonify({"error": "shop_id and item_id are required"}), 400

    shop = Shop.query.get_or_404(shop_id)
    if shop.user_id != user_id:
        abort(403, description="Not authorized to add items to this shop")

    # Validate item exists
    item = Item.query.get_or_404(item_id)

    si = ShopItem(
        shop_id=shop_id,
        item_id=item_id,
        price=data.get('price'),
        token_price=data.get('token_price', 0),
        barter_only=data.get('barter_only', False),
        display_order=data.get('display_order', 0)
    )

    db.session.add(si)
    db.session.commit()

    return jsonify(si.to_dict()), 201


@shop_items_bp.route('/<int:shop_item_id>', methods=['PUT'])
@jwt_required()
def update_shop_item(shop_item_id):
    """
    Authenticated: Update a shop item’s details.
    Body may include: price, token_price, barter_only, display_order.
    """
    user_id = get_jwt_identity()
    si = ShopItem.query.get_or_404(shop_item_id)
    shop = si.shop

    if shop.user_id != user_id:
        abort(403, description="Not authorized to edit this shop item")

    data = request.get_json() or {}

    # Update allowed fields
    if 'price' in data:
        si.price = data['price']
    if 'token_price' in data:
        si.token_price = data['token_price']
    if 'barter_only' in data:
        si.barter_only = data['barter_only']
    if 'display_order' in data:
        si.display_order = data['display_order']

    db.session.commit()
    return jsonify(si.to_dict()), 200


@shop_items_bp.route('/<int:shop_item_id>', methods=['DELETE'])
@jwt_required()
def delete_shop_item(shop_item_id):
    """Authenticated: Remove an item from the authenticated user's shop."""
    user_id = get_jwt_identity()
    si = ShopItem.query.get_or_404(shop_item_id)
    shop = si.shop

    if shop.user_id != user_id:
        abort(403, description="Not authorized to delete this shop item")

    db.session.delete(si)
    db.session.commit()
    return jsonify({"message": "Shop item deleted"}), 200
