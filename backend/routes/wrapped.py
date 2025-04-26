# backend/routes/wrapped.py

from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.app import db
from models.trade_wrapped import TradingWrapped
from models.user import User

wrapped_bp = Blueprint('wrapped', __name__, url_prefix='/api/wrapped')


@wrapped_bp.route('/me', methods=['GET'])
@jwt_required()
def get_my_wrapped():
    """
    Returns the “Trading Wrapped” summary for the authenticated user.
    """
    user_id = get_jwt_identity()
    summary = TradingWrapped.query.filter_by(user_id=user_id).first()
    if not summary:
        return jsonify({"message": "Wrapped summary not found."}), 404

    return jsonify({
        "user_id": summary.user_id,
        "total_trades": summary.total_trades,
        "most_traded_category": summary.most_traded_category,
        "top_item": summary.top_item,
        "favorite_trader": summary.favorite_trader,
        "badges_earned": summary.badges_earned,
        "trader_motto": summary.trader_motto,
        "spirit_animal": summary.spirit_animal,
        "created_at": summary.created_at.isoformat()
    }), 200


@wrapped_bp.route('/<int:user_id>', methods=['GET'])
def get_user_wrapped(user_id):
    """
    Returns the “Trading Wrapped” summary for any user (public view).
    """
    # Ensure user exists
    User.query.get_or_404(user_id)

    summary = TradingWrapped.query.filter_by(user_id=user_id).first()
    if not summary:
        return jsonify({"message": "Wrapped summary not found for user."}), 404

    return jsonify({
        "user_id": summary.user_id,
        "total_trades": summary.total_trades,
        "most_traded_category": summary.most_traded_category,
        "top_item": summary.top_item,
        "favorite_trader": summary.favorite_trader,
        "badges_earned": summary.badges_earned,
        "trader_motto": summary.trader_motto,
        "spirit_animal": summary.spirit_animal,
        "created_at": summary.created_at.isoformat()
    }), 200


# In server/app.py, register this blueprint:
#   from routes.wrapped import wrapped_bp
#   app.register_blueprint(wrapped_bp)
