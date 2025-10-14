from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class Submission(BaseModel):
    id: int
    student: str
    studentId: str
    assignment: str
    submittedAt: str
    status: str
    score: Optional[int]
    batch: str

@router.get("/submissions", response_model=List[Submission])
async def get_submissions():
    # Replace with database logic in production
    return [
        {
            "id": 1,
            "student": "Alex Johnson",
            "studentId": "ST-2023-001",
            "assignment": "Python Data Structures",
            "submittedAt": "Oct 13, 2023 - 8:45 PM",
            "status": "Pending",
            "score": None,
            "batch": "Batch A"
        },
        # ...add other submissions here...
    ]