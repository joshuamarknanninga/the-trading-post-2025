# backend/models/reports.py

from datetime import datetime
from server.app import db  # assumes your Flask app defines `db = SQLAlchemy(app)`

class Report(db.Model):
    """
    Generic report model for flagging inappropriate content:
    - review_id: report a user review (forum reply)
    - item_id: report a marketplace item
    """
    __tablename__ = 'reports'

    id = db.Column(db.Integer, primary_key=True)
    reporter_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    review_id = db.Column(db.Integer, db.ForeignKey('forum_replies.id'), nullable=True)
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=True)
    reason = db.Column(db.String(255), nullable=True)   # optional text describing why
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    reporter = db.relationship(
        'User',
        foreign_keys=[reporter_id],
        backref=db.backref('reports_made', lazy='dynamic')
    )
    review = db.relationship(
        'ForumReply',
        foreign_keys=[review_id],
        backref=db.backref('reports', lazy='dynamic')
    )
    item = db.relationship(
        'Item',
        foreign_keys=[item_id],
        backref=db.backref('reports', lazy='dynamic')
    )

    def __repr__(self):
        target = f"review_id={self.review_id}" if self.review_id else f"item_id={self.item_id}"
        return f'<Report id={self.id} reporter={self.reporter_id} {target}>'
