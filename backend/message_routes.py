from flask import Blueprint, request, jsonify
from models import Message, Chatroom, db
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import select

messages_bp = Blueprint('messages_bp', __name__)

@messages_bp.route('/chatrooms', methods=['GET'])
def get_chatrooms():
    chatroom_name_col = select(Chatroom.name)
    chatroom_names = db.session.execute(chatroom_name_col).scalars().all()
    return jsonify(chatroom_names), 200

@messages_bp.route('/messages', methods=['GET'])
def get_messages():
    chatroom_name = request.args.get('chatroom')
    page = request.args.get('page', 1, type=int)

    if not chatroom_name:
        return jsonify({"msg": "A 'chatroom' query parameter is required."}), 400
    if page < 1 or page > 4:
        return jsonify({"msg": "A page number must be between 1 and 4."}), 400
    
    chatroom_exists = db.session.execute(
        select(Chatroom).filter_by(name=chatroom_name)
    ).scalar_one_or_none()

    if not chatroom_exists:
        return jsonify({"msg": "The specified chatroom does not exist."}), 404