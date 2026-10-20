# TaskFlow – Task Management Application

TaskFlow is a simple task management application that allows users to create an account, log in, and manage their daily tasks. The project was built to demonstrate backend API development, authentication, database integration, and basic frontend development.

## Features

- **User Authentication:** Register and log in securely using JWT-based authentication.
- **Task Management:** Create, view, update, and delete tasks.
- **Role-Based Access:** Supports user and admin roles.
- **Password Security:** Passwords are hashed before being stored in the database.
- **REST API:** Backend endpoints built using FastAPI.
- **Database Integration:** SQLAlchemy ORM with SQLite by default and support for PostgreSQL configuration.
- **API Documentation:** Interactive API documentation available through Swagger UI.
- **Simple Frontend:** A lightweight interface for interacting with the application.

## Tech Stack

| Technology | Purpose |
|---|---|
| Python | Backend development |
| FastAPI | REST API framework |
| SQLAlchemy | Database ORM |
| SQLite | Default database |
| PostgreSQL | Alternative database configuration |
| JWT | Authentication |
| HTML, CSS, JavaScript | Frontend |
| Uvicorn | ASGI server |

## Project Structure

```text
primetrade_backend_assignment/
├── app/
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── database.py
│   ├── auth.py
│   └── dependencies.py
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── tests/
├── .env.example
├── .gitignore
├── requirements.txt
├── postman_collection.json
└── README.md
```

## Getting Started

Follow the steps below to run the application locally.

### Prerequisites

- Python 3.10 or newer
- Git
- A code editor such as VS Code

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd primetrade_backend_assignment
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Create a Virtual Environment

```bash
python3 -m venv .venv
```

Activate it on macOS or Linux:

```bash
source .venv/bin/activate
```

On Windows, use:

```powershell
.venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a local `.env` file from the example:

```bash
cp .env.example .env
```

Open `.env` and configure the required settings. Use a strong, randomly generated value for `JWT_SECRET`.

Keep your `.env` file and other credentials private. Do not commit secrets to GitHub.

### 5. Start the Backend

Open the first terminal in the project root and run:

```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

The backend API will be available at:

`http://127.0.0.1:8000`

### 6. Start the Frontend

Open a second terminal in the project root and run:

```bash
python3 -m http.server 5500 --directory frontend
```

Open the application in your browser:

`http://127.0.0.1:5500`

Keep both terminals running while using the application.

## API Documentation

FastAPI provides interactive documentation for exploring and testing the available endpoints.

Once the backend is running, open:

**Swagger UI:** http://127.0.0.1:8000/docs

**Health Check:** http://127.0.0.1:8000/health

The health endpoint can be used to check whether the backend is responding.

## API Endpoints

The following table summarizes the main API operations. Refer to Swagger UI for the exact request formats and available parameters.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Log in and obtain an access token |
| GET | `/tasks` | Retrieve tasks |
| POST | `/tasks` | Create a task |
| GET | `/tasks/{task_id}` | Retrieve a specific task |
| PUT | `/tasks/{task_id}` | Update a task |
| DELETE | `/tasks/{task_id}` | Delete a task |
| GET | `/health` | Check backend status |

Protected endpoints require a valid access token. Use the authentication mechanism shown in Swagger UI.

## Database Design

The application uses SQLAlchemy to communicate with the database.

### Users

The user records store account information, including the user's identifier, email, hashed password, and role.

### Tasks

The task records store information such as the task identifier, title, description, completion status, timestamps, and associated user.

Each task is associated with its owner so that task access can be controlled appropriately.

SQLite is used by default for local development. PostgreSQL can be configured through the application's database settings.

## Security

The project includes several basic security measures:

- Passwords are hashed rather than stored as plain text.
- JWT-based authentication protects authenticated API operations.
- Role-based access control distinguishes user and admin permissions.
- Task access should be restricted to authorized users.
- Secret values are configured through environment variables.

For production deployment, additional measures such as HTTPS, stricter CORS settings, token expiry policies, database migrations, and rate limiting should be considered.

## Testing

You can test the API using Swagger UI or the included Postman collection, if available in the repository.

Recommended test cases:

1. Register a new account.
2. Log in and obtain an access token.
3. Access a protected endpoint with a valid token.
4. Create a task.
5. Retrieve and update the task.
6. Delete the task.
7. Verify that unauthorized requests are rejected.
8. Verify that users cannot access tasks belonging to other users.
9. Check the backend health endpoint.

## Future Improvements

Some features that could be added in future versions include:

- Automated unit and integration tests.
- Task search, filtering, and pagination.
- Task priorities and due dates.
- Email verification and password reset.
- Docker-based deployment.
- PostgreSQL migrations using Alembic.
- CI/CD integration.
- Deployment to a cloud platform.

## What I Learned

Through this project, I worked with REST API development, authentication, database operations, environment configuration, and frontend-to-backend integration. It also helped me understand how different components of a web application work together.

## Author

**Bhargav Tanguturi**

GitHub: [bhargavv2](https://github.com/bhargavv2)

---

*Built as a backend development project to practice API design, authentication, database integration, and full-stack application fundamentals.*
