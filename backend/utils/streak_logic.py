# backend/utils/streak_logic.py

from datetime import date, datetime, timedelta
from typing import Tuple

from server.app import db
from models.streak import UserStreak

# XP awarded for a daily login
DAILY_LOGIN_XP = 5

# Milestone bonuses for specific streak lengths
MILESTONE_BONUSES = {
    3: 10,    # +10 XP at a 3-day streak
    7: 20,    # +20 XP at a 7-day streak
    14: 50,   # +50 XP at a 14-day streak
}


def record_user_login(user_id: int) -> Tuple[int, int, UserStreak]:
    """
    Fetches (or creates) the UserStreak record for `user_id`, updates it for today's login,
    and returns a tuple (xp_awarded, milestone_bonus, streak_record).

    - If no UserStreak exists, creates one with current_streak=1, longest_streak=1.
    - If last_login_date == today, does nothing and returns (0, 0, streak).
    - If last_login_date == yesterday, increments current_streak.
    - Otherwise, resets current_streak to 1.
    - Updates longest_streak if needed.
    - Updates last_login_date and updated_at timestamp.
    - Does NOT commit the session; caller should commit after handling XP and user updates.

    Returns:
        xp_awarded    = DAILY_LOGIN_XP (or 0 if already recorded)
        milestone_bonus = any extra XP at milestones (could be 0)
        streak_record = the updated UserStreak instance
    """
    today = date.today()
    streak = UserStreak.query.filter_by(user_id=user_id).first()

    # Create record if missing
    if not streak:
        streak = UserStreak(
            user_id=user_id,
            current_streak=1,
            longest_streak=1,
            last_login_date=today
        )
        db.session.add(streak)
        db.session.flush()
        return DAILY_LOGIN_XP, MILESTONE_BONUSES.get(1, 0), streak

    # Already recorded today
    if streak.last_login_date == today:
        return 0, 0, streak

    yesterday = today - timedelta(days=1)
    # Continue streak if yesterday
    if streak.last_login_date == yesterday:
        streak.current_streak += 1
    else:
        # Reset streak
        streak.current_streak = 1

    # Update longest streak if exceeded
    if streak.current_streak > streak.longest_streak:
        streak.longest_streak = streak.current_streak

    # Update login date and timestamp
    streak.last_login_date = today
    streak.updated_at = datetime.utcnow()

    # Flush changes so that streak is persisted before next operations
    db.session.flush()

    # Calculate XP and milestone bonus
    xp_awarded = DAILY_LOGIN_XP
    milestone_bonus = MILESTONE_BONUSES.get(streak.current_streak, 0)

    return xp_awarded, milestone_bonus, streak
