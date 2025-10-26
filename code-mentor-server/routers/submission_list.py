from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import async_session
from models.submission import Submission
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import joinedload
from datetime import datetime,date
from sqlalchemy.orm import selectinload


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
        return submissions

# Get a single submission by ID with related data
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
        return submission