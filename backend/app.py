import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

app = Flask(__name__)

# Configurations from environment variables
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY")
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "sqlite:///forum.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Configure JWT to use cookies
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["JWT_COOKIE_SECURE"] = True  # Set to False for local testing with HTTP
app.config["JWT_COOKIE_CSRF_PROTECT"] = False

# Initialize Extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

# Import and register blueprints
from auth_routes import auth_bp
from message_routes import messages_bp

app.register_blueprint(auth_bp, url_prefix="/api/v1")
app.register_blueprint(messages_bp, url_prefix="/api/v1")


@app.cli.command("seed-db")
def seed_db():
    from models import Chatroom

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
        if not Chatroom.query.filter_by(name=name).first():
            chatroom = Chatroom(name=name)
            db.session.add(chatroom)
    db.session.commit()
    print("Database seeded with initial chatrooms.")


if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Create tables
    app.run(debug=True)
