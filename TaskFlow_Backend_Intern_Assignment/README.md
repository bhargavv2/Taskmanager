# TaskFlow API — Backend Developer Intern Assignment

A small task-management app built to demonstrate authentication, role-based access, REST API design, validation, and a simple browser UI. The project is intentionally kept understandable rather than over-engineered.

## Stack
- **Backend:** Python, FastAPI, SQLAlchemy
- **Database:** SQLite by default; PostgreSQL supported through `DATABASE_URL`
- **Authentication:** JWT access tokens and hashed passwords
- **Frontend:** HTML, CSS, and vanilla JavaScript
- **API docs:** Swagger UI at `/docs`

## Features
- Register and log in
- Password hashing with PBKDF2
- JWT-protected routes
- `user` and `admin` roles
- CRUD for tasks
- Users can manage their own tasks; admins can view and manage all tasks
- API versioning under `/api/v1`
- Input validation and consistent error responses
- Basic frontend for authentication and task CRUD

## Run locally

### 1. Create a virtual environment
```bash
python -m venv .venv
# macOS/Linux
source .venv/bin/activate
# Windows PowerShell
.venv\Scripts\Activate.ps1
```

### 2. Install backend dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure environment
```bash
cp .env.example .env
```
The defaults work for local development. SQLite creates `taskflow.db` automatically.

### 4. Start the API
```bash
uvicorn app.main:app --reload
```
- API: http://127.0.0.1:8000
- Swagger docs: http://127.0.0.1:8000/docs
- Frontend: open `frontend/index.html` in your browser

If your browser blocks local file requests, serve the frontend with:
```bash
python -m http.server 5500 --directory frontend
```
Then open http://127.0.0.1:5500.

## Make an admin user
Register normally, then promote the account in the database for local evaluation. The simple SQLite database can be updated with a SQLite browser, or use this one-time Python command:
```bash
python -c "from app.database import SessionLocal; from app.models import User; db=SessionLocal(); u=db.query(User).filter(User.email=='you@example.com').first(); u.role='admin'; db.commit(); db.close()"
```
Replace the email with the registered account's email. Do not expose an admin-promotion endpoint in production.

## Main API routes

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/v1/auth/register` | Create an account |
| POST | `/api/v1/auth/login` | Get a JWT access token |
| GET | `/api/v1/auth/me` | Current user profile |
| GET | `/api/v1/tasks` | List tasks |
| POST | `/api/v1/tasks` | Create a task |
| GET | `/api/v1/tasks/{task_id}` | Read a task |
| PATCH | `/api/v1/tasks/{task_id}` | Update a task |
| DELETE | `/api/v1/tasks/{task_id}` | Delete a task |
| GET | `/api/v1/admin/users` | Admin-only user listing |

Use `Authorization: Bearer <access_token>` for protected endpoints.

## Example requests

Register:
```json
{
  "name": "Bhargav",
  "email": "bhargav@example.com",
  "password": "StrongPass123"
}
```

Create task:
```json
{
  "title": "Finish API documentation",
  "description": "Add request and response examples",
  "status": "todo"
}
```

## Design and security notes
- Passwords are never stored as plain text.
- JWTs have an expiry and are signed with a secret supplied through environment configuration.
- User input is validated using Pydantic models; task queries are scoped to the current user unless the requester is an admin.
- The browser demo keeps the access token in `sessionStorage`, which limits its lifetime to the current tab session. For a production web app, prefer a secure, `HttpOnly`, `Secure`, `SameSite` cookie and add CSRF protection where appropriate.
- CORS is restricted by `FRONTEND_ORIGIN` rather than opened to every origin.
- The demo uses SQLite for easy setup. PostgreSQL is the recommended deployment database.

## Scalability note
The API is stateless, so multiple application instances can sit behind a load balancer. For production, move to PostgreSQL, use database migrations (Alembic), store secrets in a managed secret store, add structured logs and metrics, rate-limit authentication endpoints, and run automated tests in CI. Redis can be introduced for caching or rate limiting when measurements show it is needed. If the system grows, separate domains such as identity and task management can be extracted into services behind an API gateway—but a modular monolith is simpler and safer at this assignment's scale.

## Limitations / next steps
This is an assignment-sized starter, not a production security audit. Before production use, add email verification, password reset, refresh-token rotation/revocation, migrations, rate limiting, audit logs, and automated tests.
