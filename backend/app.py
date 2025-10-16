# app.py
import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv() # Load environment variables from .env file

app = Flask(__name__)

# Configurations from environment variables
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///badgerchat.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Configure JWT to use cookies
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["JWT_COOKIE_SECURE"] = True # Set to False for local testing with HTTP
app.config["JWT_COOKIE_CSRF_PROTECT"] = False # CSRF can be complex; disabling for this example

# Initialize Extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"]) # Allow your React frontend

if __name__ == '__main__':
    with app.app_context():
        db.create_all() # Create tables
    app.run(debug=True)