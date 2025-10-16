# auth_routes.py
from flask import Blueprint, request, jsonify
from models import User, db
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
    unset_jwt_cookies,
    set_access_cookies,
)
from datetime import timedelta
from sqlalchemy import select

auth_bp = Blueprint("auth_bp", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    pin = data.get("pin")

    if not username or not pin:
        return jsonify({"msg": "A request must contain a 'username' and 'pin'"}), 400
    if not (isinstance(pin, str) and len(pin) == 7 and pin.isdigit()):
        return jsonify({"msg": "A pin must exactly be a 7-digit PIN code passed as a string."}), 400

    user_exists = db.session.execute(select(User).filter_by(username=username)).scalar_one_or_none()

    if user_exists:
        return jsonify({"msg": "The user already exists!"}), 409

    new_user = User(username=username, pin=pin)
    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=new_user.id, expires_delta=timedelta(hours=1))
    response = jsonify(
        {"msg": "Successfully authenticated.", "user": {"id": new_user.id, "username": new_user.username}}
    )
    set_access_cookies(response, access_token)
    return response, 200



