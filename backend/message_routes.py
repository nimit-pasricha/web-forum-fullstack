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

