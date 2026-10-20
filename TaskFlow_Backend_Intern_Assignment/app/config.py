import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./taskflow.db")
JWT_SECRET = os.getenv("JWT_SECRET", "local-development-secret-change-me")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "60"))
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://127.0.0.1:5500")

if JWT_SECRET == "local-development-secret-change-me":
    # Safe for a local demo, but deployments should set JWT_SECRET explicitly.
    pass
