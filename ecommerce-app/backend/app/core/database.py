import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Allow configuration via environment variable. If not set, fall back to a local SQLite DB
# This makes local development possible without a running Postgres instance.
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
if not SQLALCHEMY_DATABASE_URL:
    # Use SQLite file in the backend folder for simple local dev
    db_path = os.path.join(os.path.dirname(__file__), "../../dev_database.db")
    SQLALCHEMY_DATABASE_URL = f"sqlite:///{os.path.abspath(db_path)}"

# If using SQLite, we need to pass check_same_thread for the default pysqlite driver
connect_args = {}
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()