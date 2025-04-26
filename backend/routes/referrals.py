# backend/routes/referrals.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.app import db
from models.referral import Referral
from models.user import User
from models.wallet import Wallet, Transaction

referrals_bp = Blueprint('referrals', __name__, url_prefix='/api/referrals')


@referrals_bp.route('', methods=['GET'])
@jwt_required()
def list_referrals():
    """
    List all users referred by the current user.
    """
    user_id = get_jwt_identity()
    refs = Referral.query.filter_by(referrer_id=user_id).all()
    result = []
    for r in refs:
        referee = User.query.get(r.referee_id)
        result.append({
            'id': r.id,
            'referee': {
                'id': referee.id,
                'full_name': referee.full_name,
                'email': referee.email
            },
            'tokens_awarded': r.tokens_awarded,
            'created_at': r.created_at.isoformat()
        })
    return jsonify(result), 200


@referrals_bp.route('/received', methods=['GET'])
@jwt_required()
def list_received_referrals():
    """
    List all users who referred the current user.
    """
    user_id = get_jwt_identity()
    refs = Referral.query.filter_by(referee_id=user_id).all()
    result = []
    for r in refs:
        referrer = User.query.get(r.referrer_id)
        result.append({
            'id': r.id,
            'referrer': {
                'id': referrer.id,
                'full_name': referrer.full_name,
                'email': referrer.email
            },
            'tokens_awarded': r.tokens_awarded,
            'created_at': r.created_at.isoformat()
        })
    return jsonify(result), 200


@referrals_bp.route('', methods=['POST'])
@jwt_required()
def create_referral():
    """
    Create a referral for another user and award tokens.
    Expects JSON:
      {
        "referee_id": <int>
      }
    Awards 10 tokens to both referrer and referee.
    """
    data = request.get_json() or {}
    referee_id = data.get('referee_id')
    if not referee_id:
        return jsonify({'message': 'referee_id is required.'}), 400

    user_id = get_jwt_identity()
    if user_id == referee_id:
        return jsonify({'message': 'You cannot refer yourself.'}), 400

    # Prevent duplicate referrals
    if Referral.query.filter_by(referrer_id=user_id, referee_id=referee_id).first():
        return jsonify({'message': 'You have already referred this user.'}), 409

    # Ensure referee exists
    User.query.get_or_404(referee_id)

    # Award tokens
    tokens_awarded = 10
    referral = Referral(
        referrer_id=user_id,
        referee_id=referee_id,
        tokens_awarded=tokens_awarded
    )
    db.session.add(referral)

    # Update wallets
    referrer_wallet = Wallet.query.filter_by(user_id=user_id).first()
    referee_wallet = Wallet.query.filter_by(user_id=referee_id).first()
    referrer_wallet.tokens += tokens_awarded
    referee_wallet.tokens += tokens_awarded

    # Record transactions
    tx1 = Transaction(
        wallet_id=referrer_wallet.id,
        type='earn',
        amount=tokens_awarded,
        currency='token',
        description='Referral bonus'
    )
    tx2 = Transaction(
        wallet_id=referee_wallet.id,
        type='earn',
        amount=tokens_awarded,
        currency='token',
        description='Referral signup bonus'
    )
    db.session.add_all([tx1, tx2])
    db.session.commit()

    return jsonify({
        'id': referral.id,
        'referrer_id': user_id,
        'referee_id': referee_id,
        'tokens_awarded': tokens_awarded
    }), 201


# In server/app.py, register this blueprint:
#   from routes.referrals import referrals_bp
#   app.register_blueprint(referrals_bp)
