## ⚠️ This Repository Has Been Migrated

Development for this project has moved to a new, clean repository. All future updates and commits will be pushed to the new location.

### **Please see the new, active repository here:**
### [https://github.com/nimit-pasricha/flask-react-forum](https://github.com/nimit-pasricha/flask-react-forum)

# Full-Stack Containerized Web Forum with CI/CD

This is a full-stack web forum application, originally a frontend-only university project, that I have significantly extended and re-engineered. It features a robust Flask RESTful API, a dynamic React frontend, and a complete DevOps workflow including containerization and an automated CI/CD pipeline.

The application is fully containerized using Docker and orchestrated with Docker Compose, allowing for a reproducible, one-command setup. The CI/CD pipeline automatically builds and publishes the production-ready Docker images to Docker Hub on every push to the `main` branch.

## ✨ Features

-   **Containerized Environment:** The entire application (backend, frontend, database) is orchestrated with Docker Compose for a reliable, isolated, and portable development and production setup.
-   **CI/CD Pipeline:** An automated GitHub Actions workflow builds and publishes production-ready backend and frontend images to Docker Hub.
-   **User Authentication:** Secure user registration and login with JWT (JSON Web Tokens) for session management via `HttpOnly` cookies.
-   **RESTful API:** A well-structured Flask API built from scratch, featuring Blueprints and full CRUD functionality for posts and chatrooms.
-   **Production-Ready Proxy:** An Nginx reverse proxy serves the static React files and intelligently routes `/api` requests to the Flask backend, eliminating CORS issues in production.
-   **Multiple Chatrooms:** Users can browse and post messages in a variety of predefined chatrooms.
-   **Message Management:** Authenticated users can create new posts and delete their own existing posts.

## 🚀 Technologies Used

| Category | Technology |
| :--- | :--- |
| **DevOps / Deployment** | **Docker, Docker Compose, GitHub Actions (CI/CD), Nginx** |
| **Backend** | **Python, Flask, PostgreSQL, SQLAlchemy, Flask-JWT-Extended, Werkzeug** |
| **Frontend** | **React.js, React Router, Vite, Bootstrap, JavaScript (ES6+)** |

---

## 🛠️ Setup

This is the fastest and most reliable way to run the application.

### 1. Clone the Repository

```bash
git clone [https://github.com/nimit-pasricha/flask-react-forum](https://github.com/nimit-pasricha/flask-react-forum)
cd flask-react-forum
```

### 2. Configure Environment Variables

```bash
# In the ./backend/ directory, create a .env file
touch ./backend/.env
```

Edit `./backend/.env` and add your secret keys:

```bash
# You can generate secret keys with: python3 -c 'import secrets; print(secrets.token_hex(32))'
SECRET_KEY='your_flask_secret_key_here' 
JWT_SECRET_KEY='your_jwt_secret_key_here'
```

### 3. Run the Application

From the project's root directory, run:

```bash
docker-compose up --build -d
```

### 4. Initialize the Database

The containers are running, but the database is empty. In a new terminal, run the following commands to initialize the tables and seed the chatrooms:

```bash
docker-compose exec backend flask init-db
docker-compose exec backend flask seed-db
```

**The application is now running:**
- Frontend: `http://localhost`

- Backend API: `http://localhost/api/...` (via the Nginx proxy)

## 🔒 Authentication & Proxy Details

- **Production (Docker):** An Nginx container acts as a reverse proxy. It serves the static React app on port 80 and routes all requests to `/api/...` to the Flask `backend` service, eliminating all CORS issues.

- **Local Development (Legacy):** The project also supports a local, non-containerized setup. In this mode, a Vite proxy (`vite.config.js`) is used to resolve CORS between the frontend (`localhost:5173`) and the backend (`localhost:5000`).

</details>

## 📄 License
This project is licensed under the terms of the MIT License.