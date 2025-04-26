# backend/routes/events.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from server.app import db
from models.event import Event

events_bp = Blueprint('events', __name__, url_prefix='/api/events')


@events_bp.route('', methods=['GET'])
def list_events():
    """
    Returns a list of all community events.
    """
    events = Event.query.order_by(Event.date.asc(), Event.time.asc()).all()
    result = [{
        'id': ev.id,
        'title': ev.title,
        'description': ev.description,
        'date': ev.date,
        'time': ev.time,
        'location_name': ev.location_name,
        'location_lat': ev.location_lat,
        'location_lng': ev.location_lng,
        'created_at': ev.created_at.isoformat()
    } for ev in events]
    return jsonify(result), 200


@events_bp.route('/<int:event_id>', methods=['GET'])
def get_event(event_id):
    """
    Returns details for a single event.
    """
    ev = Event.query.get_or_404(event_id)
    return jsonify({
        'id': ev.id,
        'title': ev.title,
        'description': ev.description,
        'date': ev.date,
        'time': ev.time,
        'location_name': ev.location_name,
        'location_lat': ev.location_lat,
        'location_lng': ev.location_lng,
        'created_at': ev.created_at.isoformat()
    }), 200


@events_bp.route('', methods=['POST'])
@jwt_required()
def create_event():
    """
    Creates a new community event.
    Expects JSON:
    {
      "title": "...",
      "description": "...",
      "date": "YYYY-MM-DD",
      "time": "HH:MM",
      "location_name": "...",
      "location_lat": <float>,
      "location_lng": <float>
    }
    """
    data = request.get_json() or {}
    title = data.get('title')
    date = data.get('date')
    if not title or not date:
        return jsonify({'message': 'Title and date are required.'}), 400

    ev = Event(
        title=title,
        description=data.get('description'),
        date=date,
        time=data.get('time'),
        location_name=data.get('location_name'),
        location_lat=data.get('location_lat'),
        location_lng=data.get('location_lng')
    )
    db.session.add(ev)
    db.session.commit()
    return jsonify({'id': ev.id}), 201


@events_bp.route('/<int:event_id>', methods=['PUT'])
@jwt_required()
def update_event(event_id):
    """
    Updates an existing event.
    Accepts any of the event fields in JSON body.
    """
    ev = Event.query.get_or_404(event_id)
    data = request.get_json() or {}

    for field in ('title', 'description', 'date', 'time', 'location_name', 'location_lat', 'location_lng'):
        if field in data:
            setattr(ev, field, data[field])

    db.session.commit()
    return jsonify({'message': 'Event updated.'}), 200


@events_bp.route('/<int:event_id>', methods=['DELETE'])
@jwt_required()
def delete_event(event_id):
    """
    Deletes the specified event.
    """
    ev = Event.query.get_or_404(event_id)
    db.session.delete(ev)
    db.session.commit()
    return jsonify({'message': 'Event deleted.'}), 200
