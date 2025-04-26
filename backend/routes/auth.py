# backend/routes/auth.py

from flask import Blueprint, request, jsonify
from server.app import app, db
from models.user import User
from models.wallet import Wallet
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)

# Initialize JWT (in case it's not already in app.py)
jwt = JWTManager(app)

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Registers a new user and creates an associated wallet.
    Expects JSON:
      {
        "full_name": "...",
        "email": "...",
        "password": "...",
        "address": "...",
        "latitude": <float>,
        "longitude": <float>
      }
    Returns a JWT access token and basic user info.
    """
    data = request.get_json() or {}
    full_name = data.get('full_name')
    email = data.get('email')
    password = data.get('password')
    address = data.get('address')
    latitude = data.get('latitude')
    longitude = data.get('longitude')

    if not full_name or not email or not password:
        return jsonify({"message": "Name, email, and password are required."}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User with that email already exists."}), 409

    # Create and save user
    user = User(
        full_name=full_name,
        email=email,
        address=address,
        latitude=latitude,
        longitude=longitude,
        role='user'
    )
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    # Create an empty wallet for the new user
    wallet = Wallet(user_id=user.id)
    db.session.add(wallet)
    db.session.commit()

    # Generate JWT
    access_token = create_access_token(identity=user.id)
    return jsonify({
        "access_token": access_token,
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email
        }
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Authenticates a user and returns a JWT.
    Expects JSON:
      {
        "email": "...",
        "password": "..."
      }
    """
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Email and password required."}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"message": "Invalid email or password."}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({
        "access_token": access_token,
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email
        }
    }), 200


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """
    Returns the current user's profile information.
    Requires Authorization: Bearer <JWT>
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found."}), 404

    return jsonify({
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "address": user.address,
        "latitude": user.latitude,
        "longitude": user.longitude,
        "role": user.role
    }), 200


# Register blueprint in server/app.py:
#   from routes.auth import auth_bp
#   app.register_blueprint(auth_bp)
