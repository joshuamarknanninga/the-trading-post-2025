# backend/routes/profile.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.app import db
from models.user import User
from models.spirit_animal import SpiritAnimal

profile_bp = Blueprint('profile', __name__, url_prefix='/api/profile')


@profile_bp.route('/me', methods=['GET'])
@jwt_required()
def get_my_profile():
    """
    Returns the authenticated user's full profile, including spirit animal if set.
    """
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)

    # Get spirit animal if exists
    spirit = None
    if hasattr(user, 'spirit_animal') and user.spirit_animal:
        spirit = user.spirit_animal.animal

    return jsonify({
        'id': user.id,
        'full_name': user.full_name,
        'email': user.email,
        'address': user.address,
        'latitude': user.latitude,
        'longitude': user.longitude,
        'role': user.role,
        'created_at': user.created_at.isoformat(),
        'spirit_animal': spirit
    }), 200


@profile_bp.route('/me', methods=['PUT'])
@jwt_required()
def update_my_profile():
    """
    Update the authenticated user's profile.
    Accepts any of:
      - full_name
      - address
      - latitude
      - longitude
    """
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    data = request.get_json() or {}

    # Only allow updating specific fields
    for field in ('full_name', 'address', 'latitude', 'longitude'):
        if field in data:
            setattr(user, field, data[field])

    db.session.commit()
    return jsonify({'message': 'Profile updated.'}), 200


@profile_bp.route('/<int:user_id>', methods=['GET'])
def get_user_profile(user_id):
    """
    Returns a public view of any user's profile.
    Does NOT include email or sensitive info.
    """
    user = User.query.get_or_404(user_id)

    # Get spirit animal if exists
    spirit = None
    if hasattr(user, 'spirit_animal') and user.spirit_animal:
        spirit = user.spirit_animal.animal

    return jsonify({
        'id': user.id,
        'full_name': user.full_name,
        'address': user.address,
        'latitude': user.latitude,
        'longitude': user.longitude,
        'role': user.role,
        'created_at': user.created_at.isoformat(),
        'spirit_animal': spirit
    }), 200


@profile_bp.route('/quiz', methods=['POST'])
@jwt_required()
def set_spirit_animal():
    """
    Sets or updates the current user's spirit animal.
    Expects JSON:
      {
        "animal": "Fox"
      }
    """
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    animal = data.get('animal', '').strip()
    if not animal:
        return jsonify({'message': 'Animal is required.'}), 400

    # Create or update spirit animal record
    sa = SpiritAnimal.query.filter_by(user_id=user_id).first()
    if sa:
        sa.animal = animal
    else:
        sa = SpiritAnimal(user_id=user_id, animal=animal)
        db.session.add(sa)

    db.session.commit()
    return jsonify({'message': 'Spirit animal set.', 'spirit_animal': animal}), 200


# In server/app.py, register this blueprint:
#   from routes.profile import profile_bp
#   app.register_blueprint(profile_bp)
