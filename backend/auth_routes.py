import re
from datetime import timedelta

from extensions import db
from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_required,
    set_access_cookies,
    unset_jwt_cookies,
)
from models import User
from sqlalchemy import select

auth_bp = Blueprint("auth_bp", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"msg": "A request must contain a 'username' and 'password'"}), 400

    # Server-side password policy validation
    if len(password) < 8:
        return jsonify({"msg": "Password must be at least 8 characters long."}), 400
    if not re.search(r"[a-z]", password):
        return jsonify({"msg": "Password must contain a lowercase letter."}), 400
    if not re.search(r"[A-Z]", password):
        return jsonify({"msg": "Password must contain an uppercase letter."}), 400
    if not re.search(r"\d", password):
        return jsonify({"msg": "Password must contain a number."}), 400
    if not re.search(r"[@$!%*?&]", password):
        return jsonify({"msg": "Password must contain a special character (@$!%*?&)."}), 400

    user_exists = db.session.execute(select(User).filter_by(username=username)).scalar_one_or_none()
    if user_exists:
        return jsonify({"msg": "The user already exists!"}), 409

    new_user = User(username=username, password=password)
    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=str(new_user.id), expires_delta=timedelta(hours=1))
    response = jsonify(
        {"msg": "Successfully authenticated.", "user": {"id": new_user.id, "username": new_user.username}}
    )
    set_access_cookies(response, access_token)
    return response, 200


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    if not username or not password:
        return jsonify({"msg": "A request must contain a 'username' and 'password'"}), 400

    user = db.session.execute(select(User).filter_by(username=username)).scalar_one_or_none()

    # Updated to call check_password
    if user and user.check_password(password):
        access_token = create_access_token(identity=str(user.id), expires_delta=timedelta(hours=1))
        response = jsonify({"msg": "Successfully authenticated.", "user": {"id": user.id, "username": user.username}})
        set_access_cookies(response, access_token)
        return response, 200
    else:
        return jsonify({"msg": "That username or password is incorrect!"}), 401


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

    user = db.session.get(User, int(current_user_id))

    if user:
        return jsonify({"isLoggedIn": True, "user": {"id": user.id, "username": user.username}}), 200
    else:
        return jsonify({"isLoggedIn": False}), 200
