from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

# Define the Submission model
class Submission(BaseModel):
    id: int
    student: str
    studentId: str
    assignment: str
    submittedAt: str
    status: str
    score: Optional[int]
    batch: str

# Dummy data for submissions
submissions_data = [
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
    {
        "id": 2,
        "student": "Emily Davis",
        "studentId": "ST-2023-002",
        "assignment": "JavaScript Arrays",
        "submittedAt": "Oct 14, 2023 - 9:15 AM",
        "status": "Graded",
        "score": 85,
        "batch": "Batch B"
    },
    {
        "id": 3,
        "student": "Michael Brown",
        "studentId": "ST-2023-003",
        "assignment": "SQL Queries",
        "submittedAt": "Oct 15, 2023 - 10:30 AM",
        "status": "Late",
        "score": None,
        "batch": "Batch A"
    },
    {
        "id": 4,
        "student": "Sophia Wilson",
        "studentId": "ST-2023-004",
        "assignment": "Java Classes",
        "submittedAt": "Oct 16, 2023 - 2:00 PM",
        "status": "Flagged",
        "score": None,
        "batch": "Batch C"
    }
]

# Endpoint to fetch all submissions
@router.get("/submissions", response_model=List[Submission])
async def get_submissions():
    return submissions_data