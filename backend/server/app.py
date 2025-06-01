# backend/server/app.py

import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from flask_cors import CORS
from flask_jwt_extended import JWTManager

# -----------------------------------------------------------------------------
# Load environment variables
# -----------------------------------------------------------------------------
load_dotenv()

# -----------------------------------------------------------------------------
# App & Config
# -----------------------------------------------------------------------------
app = Flask(__name__)

# Secret Keys
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'fallback-secret')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'change-this-jwt-secret')

# Database Configuration
try:
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
        'DATABASE_URL', 'sqlite:///trading_post.db'
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db = SQLAlchemy(app)
except Exception as e:
    print(f"Database initialization failed: {e}")
    db = None

# -----------------------------------------------------------------------------
# Extensions Initialization
# -----------------------------------------------------------------------------
CORS(app)
jwt = JWTManager(app)

# -----------------------------------------------------------------------------
# Import Models (Only if DB is initialized)
# -----------------------------------------------------------------------------
if db:
    from models.user import User
    from models.item import Item
    from models.trade_history import TradeHistory
    from models.badges import Badge, UserBadge
    from models.chat import ChatMessage
    from models.event import Event
    from models.meetup import Meetup
    from models.referral import Referral
    from models.forum import ForumPost, ForumReply
    from models.reports import Report
    from models.wallet import Wallet, Transaction
    from models.spirit_animal import SpiritAnimal
    from models.trade_wrapped import TradingWrapped
else:
    print("[ERROR] Models not imported due to DB failure")

# -----------------------------------------------------------------------------
# Register Blueprints (API Routes)
# -----------------------------------------------------------------------------
from routes.auth import auth_bp
from routes.admin import admin_bp
from routes.chat import chat_bp
from routes.events import events_bp
from routes.forum import forum_bp
from routes.items import items_bp
from routes.map import map_bp
from routes.marketplace import marketplace_bp
from routes.profile import profile_bp
from routes.qr import qr_bp
from routes.referrals import referrals_bp
from routes.follow import follow_bp
from routes.wrapped import wrapped_bp
from routes.wallet import wallet_bp

app.register_blueprint(auth_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(chat_bp)
app.register_blueprint(events_bp)
app.register_blueprint(forum_bp)
app.register_blueprint(items_bp)
app.register_blueprint(map_bp)
app.register_blueprint(marketplace_bp)
app.register_blueprint(profile_bp)
app.register_blueprint(qr_bp)
app.register_blueprint(referrals_bp)
app.register_blueprint(follow_bp)
app.register_blueprint(wrapped_bp)
app.register_blueprint(wallet_bp)

# -----------------------------------------------------------------------------
# Serve Frontend (optional) – enables single-page app routing
# -----------------------------------------------------------------------------
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    return app.send_static_file('index.html')

# -----------------------------------------------------------------------------
# Create DB Tables If Needed
# -----------------------------------------------------------------------------
if db:
    with app.app_context():
        db.create_all()

# -----------------------------------------------------------------------------
# Run the App
# -----------------------------------------------------------------------------
if __name__ == '__main__':
    is_debug = os.getenv('FLASK_ENV', 'production') == 'development'
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=is_debug)


required_vars = ['SECRET_KEY', 'JWT_SECRET_KEY', 'DATABASE_URL']
for var in required_vars:
    if not os.getenv(var):
        raise EnvironmentError(f"Required environment variable {var} is not set.")