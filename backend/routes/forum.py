# backend/routes/forum.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from server.app import db
from models.forum import ForumPost, ForumReply
from models.user import User
from models.reports import Report

forum_bp = Blueprint('forum', __name__, url_prefix='/api/forum')


@forum_bp.route('', methods=['GET'])
def list_posts():
    """
    Returns a list of all forum posts (threads), sorted by creation date descending.
    Each post includes id, title, author name, excerpt of content, and reply count.
    """
    posts = ForumPost.query.order_by(ForumPost.created_at.desc()).all()
    result = []
    for post in posts:
        author = User.query.get(post.author_id)
        reply_count = post.replies.count()
        result.append({
            'id': post.id,
            'title': post.title,
            'author': author.full_name if author else None,
            'excerpt': (post.content[:100] + '...') if len(post.content) > 100 else post.content,
            'reply_count': reply_count,
            'created_at': post.created_at.isoformat()
        })
    return jsonify(result), 200


@forum_bp.route('', methods=['POST'])
@jwt_required()
def create_post():
    """
    Create a new forum post (thread).
    Expects JSON:
      {
        "title": "...",
        "content": "..."
      }
    """
    data = request.get_json() or {}
    title = data.get('title', '').strip()
    content = data.get('content', '').strip()

    if not title or not content:
        return jsonify({'message': 'Title and content are required.'}), 400

    user_id = get_jwt_identity()
    post = ForumPost(author_id=user_id, title=title, content=content)
    db.session.add(post)
    db.session.commit()

    return jsonify({
        'id': post.id,
        'title': post.title,
        'content': post.content,
        'author_id': post.author_id,
        'created_at': post.created_at.isoformat()
    }), 201


@forum_bp.route('/<int:post_id>', methods=['GET'])
def get_post(post_id):
    """
    Retrieve a single post and all its replies.
    """
    post = ForumPost.query.get_or_404(post_id)
    author = User.query.get(post.author_id)
    replies = []
    for r in post.replies.order_by(ForumReply.created_at.asc()):
        repl_author = User.query.get(r.author_id)
        replies.append({
            'id': r.id,
            'author': repl_author.full_name if repl_author else None,
            'content': r.content,
            'created_at': r.created_at.isoformat()
        })

    return jsonify({
        'id': post.id,
        'title': post.title,
        'content': post.content,
        'author': author.full_name if author else None,
        'created_at': post.created_at.isoformat(),
        'replies': replies
    }), 200


@forum_bp.route('/<int:post_id>/replies', methods=['POST'])
@jwt_required()
def add_reply(post_id):
    """
    Add a reply to a forum post.
    Expects JSON:
      {
        "content": "..."
      }
    """
    post = ForumPost.query.get_or_404(post_id)
    data = request.get_json() or {}
    content = data.get('content', '').strip()
    if not content:
        return jsonify({'message': 'Reply content is required.'}), 400

    user_id = get_jwt_identity()
    reply = ForumReply(post_id=post.id, author_id=user_id, content=content)
    db.session.add(reply)
    db.session.commit()

    repl_author = User.query.get(user_id)
    return jsonify({
        'id': reply.id,
        'post_id': post.id,
        'author': repl_author.full_name if repl_author else None,
        'content': reply.content,
        'created_at': reply.created_at.isoformat()
    }), 201


@forum_bp.route('/<int:post_id>/report', methods=['POST'])
@jwt_required()
def report_post(post_id):
    """
    Report a forum post for abuse/inappropriate content.
    Expects JSON:
      {
        "reason": "..."
      }
    """
    ForumPost.query.get_or_404(post_id)
    data = request.get_json() or {}
    reason = data.get('reason', '').strip()
    if not reason:
        return jsonify({'message': 'Report reason is required.'}), 400

    reporter_id = get_jwt_identity()
    report = Report(reporter_id=reporter_id, review_id=None, item_id=None)
    # We use review_id to report replies; for posts we can associate via ForumReply=None and store post_id in reason or extend model
    report.reason = f"Post {post_id}: {reason}"
    db.session.add(report)
    db.session.commit()

    return jsonify({'message': 'Post reported.'}), 201


@forum_bp.route('/replies/<int:reply_id>/report', methods=['POST'])
@jwt_required()
def report_reply(reply_id):
    """
    Report a specific reply.
    Expects JSON:
      {
        "reason": "..."
      }
    """
    ForumReply.query.get_or_404(reply_id)
    data = request.get_json() or {}
    reason = data.get('reason', '').strip()
    if not reason:
        return jsonify({'message': 'Report reason is required.'}), 400

    reporter_id = get_jwt_identity()
    report = Report(reporter_id=reporter_id, review_id=reply_id, item_id=None, reason=reason)
    db.session.add(report)
    db.session.commit()

    return jsonify({'message': 'Reply reported.'}), 201


@forum_bp.route('/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_post(post_id):
    """
    Delete a forum post and all its replies. Admin or post author only.
    """
    post = ForumPost.query.get_or_404(post_id)
    user_id = get_jwt_identity()
    # Only allow post author or admin to delete
    if post.author_id != user_id and User.query.get(user_id).role != 'admin':
        return jsonify({'message': 'Permission denied.'}), 403

    # Delete any reports associated with replies of this post
    for r in post.replies:
        Report.query.filter_by(review_id=r.id).delete()

    # Delete replies and the post
    db.session.delete(post)
    db.session.commit()
    return jsonify({'message': 'Post and its replies deleted.'}), 200
