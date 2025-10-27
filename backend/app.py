import os

from dotenv import load_dotenv
from extensions import cors, db, jwt
from flask import Flask
from models import Chatroom, User

load_dotenv()

app = Flask(__name__)

# Configurations from environment variables
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY")
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "sqlite:///forum.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Configure JWT to use cookies
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["JWT_COOKIE_SECURE"] = False
app.config["JWT_COOKIE_CSRF_PROTECT"] = False
# app.config["JWT_COOKIE_SAMESITE"] = "None"

db.init_app(app)
jwt.init_app(app)


@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    user = db.session.get(User, int(identity))
    return user


from auth_routes import auth_bp
from message_routes import messages_bp

app.register_blueprint(auth_bp, url_prefix="/api/v1")
app.register_blueprint(messages_bp, url_prefix="/api/v1")


@app.cli.command("seed-db")
def seed_db():
    initial_chatrooms = [
        "Bascom Hill Hangout",
        "Memorial Union Meetups",
        "Witte Whispers",
        "Chadbourne Chats",
        "Red Gym Rendezvous",
        "Babcock Banter",
        "Humanities Hubbub",
    ]
    for name in initial_chatrooms:
        if not db.session.execute(db.select(Chatroom).filter_by(name=name)).scalar():
            chatroom = Chatroom(name=name)
            db.session.add(chatroom)
    db.session.commit()
    print("Database seeded with initial chatrooms.")


@app.cli.command("init-db")
def init_db_command():
    """Creates the database tables."""
    with app.app_context():
        db.create_all()


if __name__ == "__main__":
    app.run(debug=True, port=5000)
