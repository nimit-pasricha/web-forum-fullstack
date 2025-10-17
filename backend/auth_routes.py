from datetime import timedelta

from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_required,
    set_access_cookies,
    unset_jwt_cookies,
)
from models import User, db
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


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    pin = data.get("pin")

    if not username or not pin:
        return jsonify({"msg": "A request must contain a 'username' and 'pin'"}), 400

    user = db.session.execute(select(User).filter_by(username=username)).scalar_one_or_none()

    if user and user.check_pin(pin):
        access_token = create_access_token(identity=user.id, expires_delta=timedelta(hours=1))
        response = jsonify({"msg": "Successfully authenticated.", "user": {"id": user.id, "username": user.username}})
        set_access_cookies(response, access_token)
        return response, 200
    else:
        return jsonify({"msg": "That username or pin is incorrect!"}), 401


@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    response = jsonify({"msg": "You have been logged out! Goodbye."})
    unset_jwt_cookies(response)
    return response, 200


@auth_bp.route("/whoami", methods=["GET"])
@jwt_required(optional=True)
def whoami():
    current_user_id = get_jwt_identity()
    if not current_user_id:
        return jsonify({"isLoggedIn": False}), 200

    user = db.session.get(User, current_user_id)

    if user:
        return jsonify({"isLoggedIn": True, "user": {"id": user.id, "username": user.username}}), 200
    else:
        return jsonify({"isLoggedIn": False}), 200
