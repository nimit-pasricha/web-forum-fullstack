from flask import Blueprint, jsonify

CHATROOMS = [
    "Bascom Hill Hangout",
    "Memorial Union Meetups",
    "Witte Whispers",
    "Chadbourne Chats",
    "Red Gym Rendezvous",
    "Babcock Banter",
    "Humanities Hubbub",
]

bp = Blueprint("api", __name__, url_prefix="/api/v1")


@bp.route("/chatrooms")
def get_chatrooms():
    res = jsonify(CHATROOMS)
    res.status_code = 200
    return res
