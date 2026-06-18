from bson import ObjectId
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from database import db, transaction_helper
from models import TransactionCreate, TransactionUpdate, TransactionResponse
from typing import List, Optional
from datetime import datetime

app = FastAPI(title="Kassa API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Next.js dev ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

# CRUD Transactions

@app.post("/api/transactions", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
async def create_transaction(transaction: TransactionCreate):
    try:
        new_trans_dict = transaction.model_dump()
        result = await db.transactions.insert_one(new_trans_dict)
        created_trans = await db.transactions.find_one({"_id": result.inserted_id})
        return transaction_helper(created_trans)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Database connection error: {str(e)}"
        )

@app.get("/api/transactions", response_model=List[TransactionResponse])
async def list_transactions(
    type: Optional[str] = None,
    category: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
):
    query = {}
    if type:
        query["type"] = type
    if category:
        query["category"] = category
    
    date_query = {}
    if start_date:
        date_query["$gte"] = start_date
    if end_date:
        date_query["$lte"] = end_date
    
    if date_query:
        query["date"] = date_query

    cursor = db.transactions.find(query).sort("date", -1)
    transactions = []
    async for doc in cursor:
        transactions.append(transaction_helper(doc))
    return transactions

@app.get("/api/transactions/{id}", response_model=TransactionResponse)
async def get_transaction(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid transaction ID format")
    
    transaction = await db.transactions.find_one({"_id": ObjectId(id)})
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    return transaction_helper(transaction)

@app.get("/api/transactions/stats/summary")
async def get_transactions_summary(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
):
    query = {}
    date_query = {}
    if start_date:
        date_query["$gte"] = start_date
    if end_date:
        date_query["$lte"] = end_date
    if date_query:
        query["date"] = date_query

    pipeline = [
        {"$match": query},
        {
            "$group": {
                "_id": "$type",
                "total": {"$sum": "$amount"}
            }
        }
    ]
    
    cursor = db.transactions.aggregate(pipeline)
    summary = {"total_income": 0.0, "total_expense": 0.0, "net_cash_flow": 0.0}
    
    async for result in cursor:
        if result["_id"] == "income":
            summary["total_income"] = result["total"]
        elif result["_id"] == "expense":
            summary["total_expense"] = result["total"]
            
    summary["net_cash_flow"] = summary["total_income"] - summary["total_expense"]
    return summary

@app.put("/api/transactions/{id}", response_model=TransactionResponse)
async def update_transaction(id: str, transaction_update: TransactionUpdate):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid transaction ID format")
    
    update_data = {k: v for k, v in transaction_update.model_dump().items() if v is not None}
    if not update_data:
        existing = await db.transactions.find_one({"_id": ObjectId(id)})
        if not existing:
            raise HTTPException(status_code=404, detail="Transaction not found")
        return transaction_helper(existing)
        
    result = await db.transactions.update_one(
        {"_id": ObjectId(id)},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Transaction not found")
        
    updated_trans = await db.transactions.find_one({"_id": ObjectId(id)})
    return transaction_helper(updated_trans)

@app.delete("/api/transactions/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_transaction(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid transaction ID format")
        
    result = await db.transactions.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return None

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
