from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from enum import Enum

class TransactionType(str, Enum):
    INCOME = "income"
    EXPENSE = "expense"

class TransactionBase(BaseModel):
    date: datetime = Field(default_factory=datetime.utcnow)
    amount: float = Field(..., gt=0, description="Amount of the transaction, must be positive")
    type: TransactionType
    category: str
    description: Optional[str] = None
    reference: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class TransactionUpdate(BaseModel):
    date: Optional[datetime] = None
    amount: Optional[float] = Field(None, gt=0)
    type: Optional[TransactionType] = None
    category: Optional[str] = None
    description: Optional[str] = None
    reference: Optional[str] = None

class TransactionResponse(TransactionBase):
    id: str = Field(..., alias="_id")

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "_id": "60c72b2f9b1d8e2568cf2234",
                "date": "2026-06-15T12:00:00Z",
                "amount": 150000.0,
                "type": "income",
                "category": "Freelance",
                "description": "Project payment",
                "reference": "INV-001"
            }
        }
