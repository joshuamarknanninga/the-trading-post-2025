# backend/routes/chat.py

from flask import Blueprint, request, jsonify
from server.app import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.chat import ChatMessage
from models.user import User

chat_bp = Blueprint('chat', __name__, url_prefix='/api/chat')


@chat_bp.route('/conversations', methods=['GET'])
@jwt_required()
def list_conversations():
    """
    Returns a list of user IDs (and basic info) with whom the current user has exchanged messages.
    """
    current_user_id = get_jwt_identity()

    # find distinct partner IDs
    sent = db.session.query(ChatMessage.recipient_id).filter_by(sender_id=current_user_id)
    received = db.session.query(ChatMessage.sender_id).filter_by(recipient_id=current_user_id)
    partner_ids = {row[0] for row in sent.union(received).all()}

    partners = User.query.filter(User.id.in_(partner_ids)).all()
    result = [{
        'id': u.id,
        'full_name': u.full_name,
        'email': u.email
    } for u in partners]

    return jsonify(result), 200


@chat_bp.route('/<int:other_user_id>', methods=['GET'])
@jwt_required()
def get_conversation(other_user_id):
    """
    Retrieves the full chat history between the current user and another user.
    """
    current_user_id = get_jwt_identity()

    msgs = ChatMessage.query.filter(
        ((ChatMessage.sender_id == current_user_id) & (ChatMessage.recipient_id == other_user_id)) |
        ((ChatMessage.sender_id == other_user_id) & (ChatMessage.recipient_id == current_user_id))
    ).order_by(ChatMessage.timestamp.asc()).all()

    result = [{
        'id': m.id,
        'sender_id': m.sender_id,
        'recipient_id': m.recipient_id,
        'content': m.content,
        'timestamp': m.timestamp.isoformat(),
        'read': m.read
    } for m in msgs]

    return jsonify(result), 200


@chat_bp.route('/<int:other_user_id>', methods=['POST'])
@jwt_required()
def send_message(other_user_id):
    """
    Sends a new chat message from the current user to another user.
    Expects JSON: { "content": "..." }
    """
    current_user_id = get_jwt_identity()
    data = request.get_json() or {}
    content = data.get('content', '').strip()

    if not content:
        return jsonify({'message': 'Message content is required.'}), 400

    # Verify recipient exists
    recipient = User.query.get(other_user_id)
    if not recipient:
        return jsonify({'message': 'Recipient not found.'}), 404

    msg = ChatMessage(
        sender_id=current_user_id,
        recipient_id=other_user_id,
        content=content
    )
    db.session.add(msg)
    db.session.commit()

    return jsonify({
        'id': msg.id,
        'sender_id': msg.sender_id,
        'recipient_id': msg.recipient_id,
        'content': msg.content,
        'timestamp': msg.timestamp.isoformat(),
        'read': msg.read
    }), 201


@chat_bp.route('/<int:other_user_id>/read', methods=['PUT'])
@jwt_required()
def mark_read(other_user_id):
    """
    Marks all messages sent from other_user_id to the current user as read.
    """
    current_user_id = get_jwt_identity()

    updated = ChatMessage.query.filter_by(
        sender_id=other_user_id,
        recipient_id=current_user_id,
        read=False
    ).update({ 'read': True }, synchronize_session=False)
    db.session.commit()

    return jsonify({'updated': updated}), 200
