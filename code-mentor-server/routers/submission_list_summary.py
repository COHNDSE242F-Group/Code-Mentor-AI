from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import async_session
from models.submission import Submission
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import joinedload
from datetime import datetime, date

router = APIRouter(
    prefix="/submissionlist-summary",
    tags=["submission"]
)

# --------------------------
# Pydantic schemas
# --------------------------
class AssignmentOut(BaseModel):
    assignment_id: int
    assignment_name: str
    due_date: date
    batch_id: int
    instructor_id: int

    class Config:
        orm_mode = True

class StudentOut(BaseModel):
    student_id: int
    student_name: str
    email: str
    contact_no: Optional[str]
    batch_id: int
    index_no: str  # Add this field

    class Config:
        orm_mode = True

class SubmissionListOut(BaseModel):
    id: int
    assignment: str
    student: str
    studentId: str
    submittedAt: str
    status: str
    score: Optional[int]
    batch: str

class SubmissionDetailOut(BaseModel):
    id: int
    assignment: str
    student: str
    studentId: str
    submittedAt: str
    code: str
    paste: bool
    output: str
    status: str
    score: Optional[int]
    batch: str
    plagiarism: Optional[dict]
    ai_feedback: Optional[list]

class GradeFeedback(BaseModel):
    score: int
    feedback: str

# --------------------------
# Endpoints
# --------------------------


@router.get("/graded-count")
async def get_graded_count():
    """Fetch the count of submissions with 'Graded' status."""
    try:
        result = await async_session().execute(
            select(Submission)
            .where(Submission.report["instructor-evaluation"].has_key("status"))
            .where(Submission.report["instructor-evaluation"]["status"].astext == "Graded")
        )
        submissions = result.scalars().all()
        print(f"Graded Submissions: {submissions}")  # Debugging log
        count = len(submissions)
        print(f"Graded Count: {count}")  # Debugging log
        return {"count": count}
    except Exception as e:
        print(f"Error fetching graded count: {e}")  # Debugging log
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/pending-review-count")
async def get_pending_review_count():
    """Fetch the count of submissions with 'Pending' status."""
    try:
        result = await async_session().execute(
            select(Submission)
            .where(Submission.report["instructor-evaluation"].has_key("status"))
            .where(Submission.report["instructor-evaluation"]["status"].astext == "Pending")
        )
        submissions = result.scalars().all()  # Convert the iterable to a list
        count = len(submissions)  # Use len() to count the items
        print(f"Pending Review Count: {count}")  # Debugging log
        return {"count": count}
    except Exception as e:
        print(f"Error fetching pending review count: {e}")  # Debugging log
        raise HTTPException(status_code=500, detail="Internal Server Error")