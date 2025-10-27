## ⚠️ This Repository Has Been Migrated

Development for this project has moved to a new, clean repository. All future updates and commits will be pushed to the new location.

### **Please see the new, active repository here:**
### [https://github.com/nimit-pasricha/flask-react-forum](https://github.com/nimit-pasricha/flask-react-forum)

# Full-Stack Web Forum

BadgerChat is a dynamic, full-stack web forum application developed with a Flask backend and a React frontend. It allows users to register, log in securely, create and delete posts in various chatrooms, and engage in real-time discussions.

This project was initially a frontend-only university assignment, which I have significantly extended and transformed into a complete application by building out a robust and secure backend API from scratch.

## ✨ Features

-   **User Authentication:** Secure user registration and login with a robust password policy, leveraging JWT (JSON Web Tokens) for session management via `HttpOnly` and `SameSite` cookies.
-   **Multiple Chatrooms:** Users can browse and post messages in a variety of predefined chatrooms (e.g., Bascom Hill Hangout, Memorial Union Meetups).
-   **Message Management:** Authenticated users can create new posts and delete their own existing posts.
-   **Centralized State Management:** React's Context API is used for efficient, global management of user authentication status across the frontend.
-   **Responsive UI:** Built with React Bootstrap for a clean and responsive user interface.
-   **RESTful API:** A well-structured Flask API with clear endpoints for all core functionalities.

## 🚀 Technologies Used

**Backend:**
-   **Python:** Main programming language.
-   **Flask:** Web framework for building the API.
-   **Flask-SQLAlchemy:** ORM (Object-Relational Mapper) for database interactions.
-   **SQLite:** Development database (`forum.db`).
-   **Flask-JWT-Extended:** For secure JSON Web Token (JWT) based authentication.
-   **Flask-CORS:** Handling Cross-Origin Resource Sharing.
-   **python-dotenv:** For managing environment variables.
-   **Werkzeug:** For password hashing.

**Frontend:**
-   **React.js:** JavaScript library for building user interfaces.
-   **React Router:** For client-side routing and navigation.
-   **Vite:** Fast build tool and development server.
-   **Bootstrap / React-Bootstrap:** UI component library for styling.
-   **JavaScript (ES6+):** Core language for frontend logic.

## 🛠️ Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/nimit-pasricha/web-forum-fullstack
cd web-forum-fullstack
```

### 2. Backend Setup

Navigate to the `backend` directory:

```bash
cd backend
```

#### Create and activate virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install python dependencies:

```bash
pip install -r requirements.txt
```

#### Configure environment variables:

```bash
touch .env
```

Edit .env and add your secret keys and the Flask app declaration:

```bash
FLASK_APP=app.py
SECRET_KEY='your_flask_secret_key_here' # Generate with: python -c 'import secrets; print(secrets.token_hex(32))'
JWT_SECRET_KEY='your_jwt_secret_key_here' # Generate with: python -c 'import secrets; print(secrets.token_hex(32))'
DATABASE_URL='sqlite:///forum.db' # For local development
```

Replace the placeholder secret keys with long, random strings.

#### Initialize Database and Seed Chatrooms

```bash
# Run the app once to create the database file, then stop it (Ctrl+C).
python3 app.py

# Now that the database exists, seed it with the chatrooms.
flask seed-db
```

#### Run the Flask Backend Server

```bash
python app.py
```

The backend server will typically run on http://127.0.0.1:5000.

### 3. Frontend Setup

Open a new terminal tab/window and navigate back to the project root:

```bash
cd .. # if you are in the backend folder
```

Install Node.js Dependencies

```bash
npm install
```

Run the React Frontend Server

```bash
npm run dev
```

The frontend development server will typically run on http://localhost:5173.

## 🔒 Authentication Details
- **Registration:** Create a new user with a unique username and a minimum 8 character password with numbers, special characters (@$!%*?&), lower and upper case characters.
- **Login:** Authenticate with username and password. A secure `HttpOnly`, `SameSite=Lax` cookie (access_token_cookie) is issued and stored in the browser.
- **Automatic Session Check:** On every page load, the frontend checks `api/v1/whoami` to verify the user's active session.
- **Logout:** Deletes the authentication cookie.

**Note on Local Development & Cross-Origin Issues:** This project utilizes a Vite proxy (vite.config.js) to seamlessly handle communication between the frontend (http://localhost:5173) and the backend (http://localhost:5000). This setup elegantly resolves common CORS and SameSite cookie security policies during development, treating all API requests as same-origin from the browser's perspective.

## 🤝 Contributing
Feel free to fork the repository and contribute! Any feedback or improvements are welcome.

## 📄 License

This project is licensed under the terms of the [MIT License](LICENSE).
