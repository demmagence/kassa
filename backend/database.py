from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "***REMOVED-CREDENTIAL***"
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
