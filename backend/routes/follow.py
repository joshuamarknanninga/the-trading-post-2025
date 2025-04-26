# backend/routes/follow.py

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.app import db
from models.user import User
from models.follow import Follow  # assumes you have a Follow model defined

follow_bp = Blueprint('follow', __name__, url_prefix='/api/follow')


@follow_bp.route('/<int:user_id>', methods=['POST'])
@jwt_required()
def follow_user(user_id):
    """
    Follow another user.
    POST /api/follow/<user_id>
    """
    current_user_id = get_jwt_identity()
    if current_user_id == user_id:
        return jsonify({'message': "You cannot follow yourself."}), 400

    target = User.query.get_or_404(user_id)
    existing = Follow.query.filter_by(
        follower_id=current_user_id,
        followed_id=user_id
    ).first()
    if existing:
        return jsonify({'message': "Already following this user."}), 409

    f = Follow(follower_id=current_user_id, followed_id=user_id)
    db.session.add(f)
    db.session.commit()
    return jsonify({'message': "Now following user.", 'followed_id': user_id}), 201


@follow_bp.route('/<int:user_id>', methods=['DELETE'])
@jwt_required()
def unfollow_user(user_id):
    """
    Unfollow a user.
    DELETE /api/follow/<user_id>
    """
    current_user_id = get_jwt_identity()
    f = Follow.query.filter_by(
        follower_id=current_user_id,
        followed_id=user_id
    ).first()
    if not f:
        return jsonify({'message': "You are not following this user."}), 404

    db.session.delete(f)
    db.session.commit()
    return jsonify({'message': "Unfollowed user."}), 200


@follow_bp.route('/following', methods=['GET'])
@jwt_required()
def list_following():
    """
    List users the current user is following.
    GET /api/follow/following
    """
    current_user_id = get_jwt_identity()
    follows = Follow.query.filter_by(follower_id=current_user_id).all()
    result = [
        {
            'id': f.followed.id,
            'full_name': f.followed.full_name,
            'email': f.followed.email
        }
        for f in follows
    ]
    return jsonify(result), 200


@follow_bp.route('/followers', methods=['GET'])
@jwt_required()
def list_followers():
    """
    List users who are following the current user.
    GET /api/follow/followers
    """
    current_user_id = get_jwt_identity()
    followers = Follow.query.filter_by(followed_id=current_user_id).all()
    result = [
        {
            'id': f.follower.id,
            'full_name': f.follower.full_name,
            'email': f.follower.email
        }
        for f in followers
    ]
    return jsonify(result), 200


# In server/app.py, register this blueprint:
# from routes.follow import follow_bp
# app.register_blueprint(follow_bp)
