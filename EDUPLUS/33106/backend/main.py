import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models, seed_data
from routes import auth, institutions, students, topics, actions, interventions, imports, reports, analytics, relay

# Create tables
Base.metadata.create_all(bind=engine)

# Auto-seed if database is new
seed_data.seed_database()

app = FastAPI(
    title="Lumixora Platform API",
    description="EduPulse & LUMIXORA RELAY Component Intelligence Engine",
    version="1.2.0"
)

# Enable CORS for local Vite dev server and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all routers
app.include_router(auth.router)
app.include_router(institutions.router)
app.include_router(students.router)
app.include_router(topics.router)
app.include_router(actions.router)
app.include_router(interventions.router)
app.include_router(imports.router)
app.include_router(reports.router)
app.include_router(analytics.router)
app.include_router(relay.router)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "platform": "EduPulse",
        "tagline": "Every test should lead to a better next step.",
        "location": "Kurnool, Andhra Pradesh, India"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
