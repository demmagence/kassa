from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient

app = FastAPI(title="Kassa API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Connection
MONGO_URL = "mongodb+srv://kassa:kodingansampah@kassa-db.oyfz85q.mongodb.net/?appName=kassa-db"
client = AsyncIOMotorClient(MONGO_URL)
db = client.kassa_db

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Backend is running!"}

@app.get("/api/status")
async def api_status():
    try:
        await db.command("ping")
        db_connected = True
    except Exception:
        db_connected = False
    return {"status": "active", "db_connected": db_connected}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
