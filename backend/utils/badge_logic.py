# backend/utils/badge_logic.py

from datetime import datetime
from server.app import db
from models.user import User
from models.trade_history import TradeHistory
from models.referral import Referral
from models.badges import Badge, UserBadge

def award_badge(user, badge):
    """
    Awards the given Badge object to the user if not already awarded.
    """
    existing = UserBadge.query.filter_by(user_id=user.id, badge_id=badge.id).first()
    if not existing:
        user_badge = UserBadge(user_id=user.id, badge_id=badge.id)
        db.session.add(user_badge)
        db.session.commit()
        return True
    return False

def get_or_create_badge(title, description, icon=None, color=None):
    """
    Retrieves a Badge by title or creates it if not present.
    """
    badge = Badge.query.filter_by(title=title).first()
    if not badge:
        badge = Badge(
            title=title,
            description=description,
            icon=icon,
            color=color
        )
        db.session.add(badge)
        db.session.commit()
    return badge

def evaluate_user_badges(user_id):
    """
    Checks various criteria for the user and awards badges accordingly.
    Returns a list of newly awarded badges (titles).
    """
    user = User.query.get(user_id)
    if not user:
        return []

    awarded = []

    # 1) First Trade badge: complete at least one trade
    first_trade_badge = get_or_create_badge(
        title="First Trade",
        description="Complete your first trade.",
        icon="⭐",
        color="bg-yellow-400"
    )
    trade_count = TradeHistory.query.filter(
        (TradeHistory.seller_id == user.id) | (TradeHistory.buyer_id == user.id)
    ).count()
    if trade_count >= 1 and award_badge(user, first_trade_badge):
        awarded.append(first_trade_badge.title)

    # 2) Barter Master badge: complete 10 barter trades
    barter_master_badge = get_or_create_badge(
        title="Barter Master",
        description="Complete 10 barter-only trades.",
        icon="🔄",
        color="bg-green-400"
    )
    barter_trades = TradeHistory.query.filter_by(currency_type="barter").filter(
        (TradeHistory.seller_id == user.id) | (TradeHistory.buyer_id == user.id)
    ).count()
    if barter_trades >= 10 and award_badge(user, barter_master_badge):
        awarded.append(barter_master_badge.title)

    # 3) Super Referrer badge: refer 5 users
    super_referrer_badge = get_or_create_badge(
        title="Super Referrer",
        description="Refer 5 new users.",
        icon="🏅",
        color="bg-blue-400"
    )
    referral_count = Referral.query.filter_by(referrer_id=user.id).count()
    if referral_count >= 5 and award_badge(user, super_referrer_badge):
        awarded.append(super_referrer_badge.title)

    # 4) Loyal Trader badge: 50 total trades
    loyal_trader_badge = get_or_create_badge(
        title="Loyal Trader",
        description="Complete 50 trades.",
        icon="❤️",
        color="bg-pink-400"
    )
    if trade_count >= 50 and award_badge(user, loyal_trader_badge):
        awarded.append(loyal_trader_badge.title)

    return awarded

def badge_summary_for_user(user_id):
    """
    Returns a summary of all badges earned by the user.
    """
    user_badges = UserBadge.query.filter_by(user_id=user_id).all()
    return [{
        "title": ub.badge.title,
        "description": ub.badge.description,
        "icon": ub.badge.icon,
        "color": ub.badge.color,
        "awarded_at": ub.awarded_at.isoformat()
    } for ub in user_badges]

if __name__ == "__main__":
    # Example usage: evaluate badges for all users
    with db.app.app_context():
        users = User.query.all()
        for u in users:
            new_awards = evaluate_user_badges(u.id)
            if new_awards:
                print(f"User {u.full_name} awarded: {new_awards}")
