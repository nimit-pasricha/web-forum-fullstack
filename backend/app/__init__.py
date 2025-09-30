from flask import Flask
from .models import db
from flask_cors import CORS
from .routes import bp as api_bp

def create_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"
    db.init_app(app)

    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

    app.register_blueprint(api_bp)

    with app.app_context():
        db.create_all()

    return app