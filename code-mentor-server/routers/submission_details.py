from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class SubmissionDetail(BaseModel):
    id: int
    assignment: str
    student: str
    studentId: str
    submittedAt: str
    code: str
    output: str
    status: str
    score: Optional[int]
    batch: str
    plagiarism: Optional[dict]
    ai_feedback: Optional[list]

@router.get("/submission/{submission_id}", response_model=SubmissionDetail)
async def get_submission_detail(submission_id: int):
    # Replace with database logic in production
    return {
        "id": submission_id,
        "assignment": "Python Data Structures",
        "student": "Alex Johnson",
        "studentId": "ST-2023-001",
        "submittedAt": "Oct 13, 2023 - 8:45 PM",
        "code": "def binary_search(arr, target): ...",  # Truncated for brevity
        "output": "All test cases passed!",
        "status": "Pending",
        "score": None,
        "batch": "Batch A",
        "plagiarism": {
            "score": 15,
            "sources": [
                "GeeksforGeeks - Binary Search Implementation",
                "GitHub - Data Structures & Algorithms Repository"
            ]
        },
        "ai_feedback": [
            {"type": "success", "title": "Correct Implementation", "desc": "The binary search algorithm is correctly implemented with the proper boundary conditions."},
            {"type": "success", "title": "Good Documentation", "desc": "The function includes a clear docstring explaining inputs, outputs, and purpose."},
            {"type": "warning", "title": "Performance Consideration", "desc": "The mid calculation could be optimized to prevent integer overflow in some languages (not an issue in Python)."},
            {"type": "success", "title": "Thorough Testing", "desc": "The test cases cover various scenarios including edge cases."}
        ]
    }