# backend/routes/shop.py

from flask import Blueprint, jsonify, request, abort
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.app import db
from models.shop import Shop
from utils.shop_helpers import generate_slug

shop_bp = Blueprint('shop', __name__, url_prefix='/api/shop')


@shop_bp.route('/<string:slug>', methods=['GET'])
def get_shop(public_slug):
    """
    Public: Fetch a shop by its slug if it is public.
    """
    shop = Shop.query.filter_by(slug=public_slug, is_public=True).first_or_404()
    return jsonify(shop.to_dict()), 200


@shop_bp.route('/me', methods=['GET'])
@jwt_required()
def get_my_shop():
    """
    Authenticated: Fetch the current user's own shop.
    """
    user_id = get_jwt_identity()
    shop = Shop.query.filter_by(user_id=user_id).first()
    if not shop:
        return jsonify({"message": "No shop found for this user."}), 404
    return jsonify(shop.to_dict()), 200


@shop_bp.route('/', methods=['POST'])
@jwt_required()
def create_shop():
    """
    Authenticated: Create a new shop for the current user.
    Body JSON must include: name
    Optional: description, theme, logo_url, banner_url, is_public
    """
    user_id = get_jwt_identity()
    if Shop.query.filter_by(user_id=user_id).first():
        return jsonify({"error": "User already has a shop."}), 400

    data = request.get_json() or {}
    name = data.get('name')
    if not name:
        return jsonify({"error": "Shop name is required."}), 400

    # Generate a unique slug
    slug = generate_slug(name)
    base = slug
    counter = 2
    while Shop.query.filter_by(slug=slug).first():
        slug = f"{base}-{counter}"
        counter += 1

    shop = Shop(
        user_id=user_id,
        name=name,
        slug=slug,
        description=data.get('description'),
        theme=data.get('theme', 'default'),
        logo_url=data.get('logo_url'),
        banner_url=data.get('banner_url'),
        is_public=data.get('is_public', True)
    )
    db.session.add(shop)
    db.session.commit()
    return jsonify(shop.to_dict()), 201


@shop_bp.route('/', methods=['PUT'])
@jwt_required()
def update_shop():
    """
    Authenticated: Update fields of the current user's shop.
    Allowed fields: name, description, theme, logo_url, banner_url, is_public
    """
    user_id = get_jwt_identity()
    shop = Shop.query.filter_by(user_id=user_id).first_or_404()

    data = request.get_json() or {}

    if 'name' in data:
        new_name = data['name']
        shop.name = new_name
        # Regenerate slug if name changed
        slug = generate_slug(new_name)
        base = slug
        counter = 2
        while True:
            existing = Shop.query.filter_by(slug=slug).first()
            if not existing or existing.id == shop.id:
                break
            slug = f"{base}-{counter}"
            counter += 1
        shop.slug = slug

    if 'description' in data:
        shop.description = data['description']
    if 'theme' in data:
        shop.theme = data['theme']
    if 'logo_url' in data:
        shop.logo_url = data['logo_url']
    if 'banner_url' in data:
        shop.banner_url = data['banner_url']
    if 'is_public' in data:
        shop.is_public = data['is_public']

    db.session.commit()
    return jsonify(shop.to_dict()), 200
