# backend/routes/qr.py

from flask import Blueprint, request, send_file, jsonify
from flask_jwt_extended import jwt_required
from io import BytesIO
from server.app import app, db
from models.item import Item
from models.user import User
from utils.qr_generator import generate_qr_code

qr_bp = Blueprint('qr', __name__, url_prefix='/api/qr')


@qr_bp.route('/generate', methods=['POST'])
@jwt_required()
def generate_custom_qr():
    """
    Generate a QR code for arbitrary data.
    Expects JSON:
      {
        "data": "<string to encode>"
      }
    Returns: image/png of the QR code.
    """
    data = request.get_json(silent=True) or {}
    payload = data.get('data')
    if not payload:
        return jsonify({'message': 'No data provided for QR code.'}), 400

    img = generate_qr_code(payload)
    buf = BytesIO()
    img.save(buf, format='PNG')
    buf.seek(0)
    return send_file(buf, mimetype='image/png')


@qr_bp.route('/item/<int:item_id>', methods=['GET'])
def generate_item_qr(item_id):
    """
    Generate a QR code that links to the frontend item detail page.
    """
    item = Item.query.get_or_404(item_id)
    # Construct URL to the React route
    url = request.host_url.rstrip('/') + f'/marketplace/item/{item.id}'
    img = generate_qr_code(url)
    buf = BytesIO()
    img.save(buf, format='PNG')
    buf.seek(0)
    return send_file(buf, mimetype='image/png')


@qr_bp.route('/profile/<int:user_id>', methods=['GET'])
def generate_profile_qr(user_id):
    """
    Generate a QR code that links to the frontend public profile page.
    """
    user = User.query.get_or_404(user_id)
    url = request.host_url.rstrip('/') + f'/profile/{user.id}'
    img = generate_qr_code(url)
    buf = BytesIO()
    img.save(buf, format='PNG')
    buf.seek(0)
    return send_file(buf, mimetype='image/png')


# In server/app.py, register this blueprint:
#   from routes.qr import qr_bp
#   app.register_blueprint(qr_bp)
