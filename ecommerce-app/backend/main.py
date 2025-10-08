from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import engine
from app.models.init import Base
from app.api import auth, products

# Create tables (guarded so the app can still start if DB is not available)
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    # Log the error and continue. In production you might want to fail fast.
    print("Warning: could not create tables at startup:", e)

app = FastAPI(title="ECommerce API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(products.router, prefix="/products", tags=["products"])

@app.get("/")
def read_root():
    return {"message": "ECommerce API is running"}