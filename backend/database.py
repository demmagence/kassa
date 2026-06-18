import os

from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
if not MONGO_URL:
    raise RuntimeError(
        "MONGO_URL is not set. Copy backend/.env.example to backend/.env and fill in your "
        "MongoDB connection string."
    )

client = AsyncIOMotorClient(MONGO_URL, serverSelectionTimeoutMS=3000)
db = client.kassa_db

def transaction_helper(transaction) -> dict:
    return {
        "_id": str(transaction["_id"]),
        "date": transaction["date"],
        "amount": transaction["amount"],
        "type": transaction["type"],
        "category": transaction["category"],
        "description": transaction.get("description"),
        "reference": transaction.get("reference"),
    }
