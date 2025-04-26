# backend/config.py

import os
from datetime import timedelta

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    """Base configuration with default settings."""
    # Flask settings
    SECRET_KEY = os.environ.get('SECRET_KEY', 'change-this-secret-key')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'change-this-jwt-secret')
    FLASK_ENV = os.environ.get('FLASK_ENV', 'production')
    DEBUG = FLASK_ENV == 'development'

    # Database settings
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL',
        f"sqlite:///{os.path.join(basedir, '..', 'trading_post.db')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT settings
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)

    # SMTP / email settings
    SMTP_HOST = os.environ.get('SMTP_HOST', 'smtp.example.com')
    SMTP_PORT = int(os.environ.get('SMTP_PORT', 587))
    SMTP_USERNAME = os.environ.get('SMTP_USERNAME', '')
    SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD', '')
    SMTP_USE_TLS = os.environ.get('SMTP_USE_TLS', 'True').lower() in ('true', '1', 'yes')
    DEFAULT_SENDER = os.environ.get('DEFAULT_SENDER', SMTP_USERNAME or 'no-reply@tradingpost.com')

    # Any other third-party service keys can go here
    # STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY')
    # AWS_S3_BUCKET    = os.environ.get('AWS_S3_BUCKET')
    # ...

class DevelopmentConfig(Config):
    """Development configuration."""
    FLASK_ENV = 'development'
    DEBUG = True
    # You can override DB for development if desired
    # SQLALCHEMY_DATABASE_URI = 'sqlite:///dev_trading_post.db'

class ProductionConfig(Config):
    """Production configuration."""
    FLASK_ENV = 'production'
    DEBUG = False

# Dictionary for easy lookup
config_by_name = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': ProductionConfig
}
