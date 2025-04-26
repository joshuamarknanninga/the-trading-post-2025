# backend/routes/wallet.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.app import db
from models.wallet import Wallet, Transaction

wallet_bp = Blueprint('wallet', __name__, url_prefix='/api/wallet')


@wallet_bp.route('', methods=['GET'])
@jwt_required()
def get_wallet():
    """
    Get the current user's wallet balances.
    """
    user_id = get_jwt_identity()
    wallet = Wallet.query.filter_by(user_id=user_id).first()
    if not wallet:
        return jsonify({'message': 'Wallet not found.'}), 404

    return jsonify({
        'user_id': wallet.user_id,
        'tokens': wallet.tokens,
        'crypto_balance': wallet.crypto_balance
    }), 200


@wallet_bp.route('/transactions', methods=['GET'])
@jwt_required()
def list_transactions():
    """
    List all transactions for the current user's wallet, newest first.
    """
    user_id = get_jwt_identity()
    wallet = Wallet.query.filter_by(user_id=user_id).first()
    if not wallet:
        return jsonify({'message': 'Wallet not found.'}), 404

    txs = Transaction.query.filter_by(wallet_id=wallet.id)\
        .order_by(Transaction.timestamp.desc())\
        .all()

    result = [{
        'id': tx.id,
        'type': tx.type,
        'amount': tx.amount,
        'currency': tx.currency,
        'description': tx.description,
        'timestamp': tx.timestamp.isoformat()
    } for tx in txs]

    return jsonify(result), 200


@wallet_bp.route('/transactions', methods=['POST'])
@jwt_required()
def create_transaction():
    """
    Create a new wallet transaction (earn/spend tokens or deposit/withdraw crypto).
    Expects JSON:
      {
        "type": "earn"|"spend"|"deposit"|"withdraw",
        "amount": <number>,
        "currency": "token"|"crypto",
        "description": "optional description"
      }
    """
    user_id = get_jwt_identity()
    wallet = Wallet.query.filter_by(user_id=user_id).first()
    if not wallet:
        return jsonify({'message': 'Wallet not found.'}), 404

    data = request.get_json() or {}
    tx_type = data.get('type')
    amount = data.get('amount')
    currency = data.get('currency')
    description = data.get('description', '')

    # Validate inputs
    if tx_type not in ('earn', 'spend', 'deposit', 'withdraw'):
        return jsonify({'message': 'Invalid transaction type.'}), 400
    if currency not in ('token', 'crypto'):
        return jsonify({'message': 'Invalid currency.'}), 400
    try:
        amount = float(amount)
        if amount <= 0:
            raise ValueError()
    except (TypeError, ValueError):
        return jsonify({'message': 'Amount must be a positive number.'}), 400

    # Update wallet balances
    if currency == 'token':
        if tx_type == 'earn':
            wallet.tokens += amount
        elif tx_type == 'spend':
            if wallet.tokens < amount:
                return jsonify({'message': 'Insufficient tokens.'}), 400
            wallet.tokens -= amount
        else:
            return jsonify({'message': 'Invalid token transaction type.'}), 400
    else:  # crypto
        if tx_type == 'deposit':
            wallet.crypto_balance += amount
        elif tx_type == 'withdraw':
            if wallet.crypto_balance < amount:
                return jsonify({'message': 'Insufficient crypto balance.'}), 400
            wallet.crypto_balance -= amount
        else:
            return jsonify({'message': 'Invalid crypto transaction type.'}), 400

    # Record the transaction
    tx = Transaction(
        wallet_id=wallet.id,
        type=tx_type,
        amount=amount,
        currency=currency,
        description=description
    )
    db.session.add(tx)
    db.session.commit()

    return jsonify({
        'id': tx.id,
        'type': tx.type,
        'amount': tx.amount,
        'currency': tx.currency,
        'description': tx.description,
        'timestamp': tx.timestamp.isoformat()
    }), 201
