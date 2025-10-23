from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import async_session
from models.submission import Submission
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import joinedload
from datetime import datetime,date


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
    due_date: date  # Use `date` to match the database field type
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
    assignment: AssignmentOut
    student: StudentOut
    report: Optional[dict]
    submitted_at: Optional[datetime]  # Use datetime directly

    class Config:
        orm_mode = True

# --------------------------
# Endpoints
# --------------------------


@router.get("/", response_model=List[SubmissionOut])
async def get_submissions():
    async with async_session() as session:
        result = await session.execute(
            select(Submission)
            .options(joinedload(Submission.assignment), joinedload(Submission.student))
        )
        submissions = result.scalars().all()

        # Extract data from the report JSON column for each submission
        return [
            {
                "submission_id": submission.submission_id,
                "assignment": submission.assignment,
                "student": submission.student,
                "report": submission.report or {},  # Ensure report is a dictionary
                "submitted_at": submission.submitted_at,
            }
            for submission in submissions
        ]

# Get a single submission by ID with related data
@router.get("/{submission_id}", response_model=SubmissionOut)
async def get_submission(submission_id: int, session: AsyncSession = Depends(async_session)):
    result = await session.execute(
        select(Submission)
        .where(Submission.submission_id == submission_id)
        .options(
            joinedload(Submission.assignment),
            joinedload(Submission.student)
        )
    )
    submission = result.scalar_one_or_none()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    # Extract code from the report JSON
    report = submission.report or {}
    return {
        "id": submission.submission_id,
        "assignment": submission.assignment.assignment_name,
        "student": submission.student.student_name,
        "studentId": submission.student.index_no,
        "submittedAt": submission.submitted_at.strftime("%b %d, %Y - %I:%M %p"),
        "code": report.get("code", ""),  # Extract code
        "paste": report.get("paste", False),  # Extract paste flag
        "status": report.get("status", "Pending"),
        "score": report.get("score"),
        "batch": submission.student.batch_id,
        "plagiarism": report.get("plagiarism"),  # Dummy data
        "ai_feedback": report.get("ai_feedback"),  # Dummy data
    }