# backend/models/forum.py

from datetime import datetime
from server.app import db  # assumes your Flask app defines `db = SQLAlchemy(app)`

class ForumPost(db.Model):
    """A top-level discussion thread in the community forum."""
    __tablename__ = 'forum_posts'

    id = db.Column(db.Integer, primary_key=True)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationship to access replies
    replies = db.relationship(
        'ForumReply',
        backref='post',
        lazy='dynamic',
        cascade='all, delete-orphan'
    )

    def __repr__(self):
        return f'<ForumPost {self.id} "{self.title}">'

class ForumReply(db.Model):
    """A reply to a ForumPost."""
    __tablename__ = 'forum_replies'

    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('forum_posts.id'), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f'<ForumReply {self.id} to post {self.post_id}>'
