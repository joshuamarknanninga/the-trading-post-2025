# backend/routes/admin.py

from flask import Blueprint, jsonify
from server.app import db
from models.user import User
from models.trade_history import TradeHistory
from models.badges import UserBadge
from models.reports import Report
from models.event import Event
from models.forum import ForumReply

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')


@admin_bp.route('/stats', methods=['GET'])
def get_stats():
    """
    Returns high-level site statistics for admin dashboard:
    - totalUsers
    - activeTrades
    - badgesAwarded
    - totalReports
    - pendingReviews (reports on reviews)
    - scheduledEvents
    """
    total_users = User.query.count()
    active_trades = TradeHistory.query.count()
    badges_awarded = UserBadge.query.count()
    total_reports = Report.query.count()
    pending_reviews = Report.query.filter(Report.review_id.isnot(None)).count()
    scheduled_events = Event.query.count()

    return jsonify({
        'totalUsers': total_users,
        'activeTrades': active_trades,
        'badgesAwarded': badges_awarded,
        'totalReports': total_reports,
        'pendingReviews': pending_reviews,
        'scheduledEvents': scheduled_events
    })


@admin_bp.route('/reports/reviews', methods=['GET'])
def get_reported_reviews():
    """
    Returns all reports that reference a forum reply (review),
    including reporter and reviewee names, review content, and reason.
    """
    reports = Report.query.filter(Report.review_id.isnot(None)).all()
    result = []
    for r in reports:
        review = ForumReply.query.get(r.review_id)
        if not review:
            continue
        reporter = User.query.get(r.reporter_id)
        reviewee = User.query.get(review.author_id)
        result.append({
            'id': r.id,
            'review_id': r.review_id,
            'review_content': review.content,
            'reviewer_name': reporter.full_name if reporter else None,
            'reviewee_name': reviewee.full_name if reviewee else None,
            'reason': r.reason
        })
    return jsonify(result)


@admin_bp.route('/reports/<int:report_id>/dismiss', methods=['POST'])
def dismiss_report(report_id):
    """
    Deletes a report by its ID (i.e., dismisses the report).
    """
    report = Report.query.get_or_404(report_id)
    db.session.delete(report)
    db.session.commit()
    return jsonify({'message': 'Report dismissed.'})


@admin_bp.route('/reviews/<int:review_id>', methods=['DELETE'])
def delete_review(review_id):
    """
    Deletes a forum reply (review) and any associated reports.
    """
    # Remove any reports tied to this review
    Report.query.filter_by(review_id=review_id).delete()
    # Remove the review itself
    review = ForumReply.query.get_or_404(review_id)
    db.session.delete(review)
    db.session.commit()
    return jsonify({'message': 'Review deleted.'})
