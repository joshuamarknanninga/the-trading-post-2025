# backend/run.py

#!/usr/bin/env python3
import os
from dotenv import load_dotenv

# ─── Load Environment Variables ─────────────────────────────────────────────────
# Reads backend/.env (if present) so config values like SECRET_KEY, DATABASE_URL, etc. apply.
basedir = os.path.abspath(os.path.dirname(__file__))
env_path = os.path.join(basedir, '.env')
if os.path.exists(env_path):
    load_dotenv(env_path)

# ─── Import & Configure Flask App ────────────────────────────────────────────────
from server.app import app

# Optionally override debug mode from FLASK_ENV
debug_mode = os.getenv('FLASK_ENV', 'production') == 'development'

# ─── Run the Application ─────────────────────────────────────────────────────────
if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug_mode
    )
