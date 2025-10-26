from fastapi import APIRouter, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import Optional
from datetime import datetime, date
from pydantic import BaseModel
from database import async_session
from models.submission import Submission

router = APIRouter(
    prefix="/submission",
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

    class Config:
        orm_mode = True

class SubmissionOut(BaseModel):
    submission_id: int

    # Nested objects (preferred)
    assignment: Optional[AssignmentOut]
    student: Optional[StudentOut]

    # Flat fields (fallback for older data)
    assignment_name: Optional[str]
    student_name: Optional[str]
    studentId: Optional[str]

    report: Optional[dict]
    submitted_at: Optional[datetime]

    class Config:
        orm_mode = True

# --------------------------
# Endpoint
# --------------------------
@router.get("/{submission_id}", response_model=SubmissionOut)
async def get_submission(submission_id: int):
    async with async_session() as session:
        result = await session.execute(
            select(Submission)
            .where(Submission.submission_id == submission_id)
            .options(
                selectinload(Submission.assignment),
                selectinload(Submission.student)
            )
        )
        submission = result.scalar_one_or_none()

        if not submission:
            raise HTTPException(status_code=404, detail="Submission not found")

        # Map to unified schema
        submission_data = {
            "submission_id": submission.submission_id,
            "assignment": submission.assignment if hasattr(submission, "assignment") else None,
            "student": submission.student if hasattr(submission, "student") else None,
            "assignment_name": submission.assignment.assignment_name if submission.assignment else None,
            "student_name": submission.student.student_name if submission.student else None,
            "studentId": str(submission.student.student_id) if submission.student else None,
            "report": getattr(submission, "report", None),
            "submitted_at": getattr(submission, "submitted_at", None),
        }

        return submission_data