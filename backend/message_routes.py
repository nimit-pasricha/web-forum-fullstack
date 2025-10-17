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
    
    chatroom_col = select(Message).filter_by(chatroom=chatroom_name).order_by(Message.created.desc())
    pagination = db.paginate(chatroom_col, page=page, per_page=25, error_out=False)

    messages = pagination.items

    result = {
        "msg": "Successfully got the latest messages!",
        "page": page,
        "messages": [{
            "id": msg.id,
            "poster": msg.poster.username,
            "title": msg.title,
            "content": msg.content,
            "chatroom": msg.chatroom,
            "created": msg.created.isoformat()
        } for msg in messages]
    }
    return jsonify(result), 200


@messages_bp.route('/messages', methods=['POST'])
@jwt_required()
def post_message():
    current_user_id = get_jwt_identity()
    chatroom_name = request.args.get('chatroom')
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')

    if not all([chatroom_name, title, content]):
        return jsonify({"msg": "Missing chatroom, title, or content."}), 400
    
    chatroom_exists = db.session.execute(
        select(Chatroom).filter_by(name=chatroom_name)
    ).scalar_one_or_none()

    if not chatroom_exists:
        return jsonify({"msg": "The specified chatroom does not exist."}), 404
    
    new_message = Message(
        title=title,
        content=content,
        user_id=current_user_id,
        chatroom=chatroom_name
    )
    db.session.add(new_message)
    db.session.commit()

    return jsonify({"msg": "Successfully posted message!", "id": new_message.id}), 200

@messages_bp.route('/messages', methods=['DELETE'])
@jwt_required()
def delete_message():
    current_user_id = get_jwt_identity()
    message_id = request.args.get('id', type=int)

    if not message_id:
        return jsonify({"msg": "A message 'id' query parameter is required."}), 400
    
    message = db.get_or_404(Message, message_id, description="That message does not exist!")
    
    if message.user_id != current_user_id:
        return jsonify({"msg": "You may not delete another user's post!"}), 401
    
    db.session.delete(message)
    db.session.commit()
    return jsonify({"msg": "Successfully deleted message!"}), 200