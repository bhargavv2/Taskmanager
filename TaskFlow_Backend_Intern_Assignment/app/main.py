from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.config import FRONTEND_ORIGIN
from app.database import Base, engine
from app.routers import auth, tasks, admin

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TaskFlow API",
    description="A task-management REST API demonstrating JWT authentication and role-based access.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN, "http://localhost:5500", "null"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(status_code=422, content={
        "detail": "Request validation failed",
        "errors": [{"field": ".".join(str(x) for x in item["loc"]), "message": item["msg"]} for item in exc.errors()],
    })

@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok", "service": "taskflow-api"}

v1 = FastAPI()
app.include_router(auth.router, prefix="/api/v1")
app.include_router(tasks.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")
