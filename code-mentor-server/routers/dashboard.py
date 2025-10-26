from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import cast, String
from database import async_session
from models.assignment import Assignment
from models.submission import Submission
from models.student import Student
from datetime import date, datetime, timezone
from typing import List, Optional
from pydantic import BaseModel
import json

router = APIRouter(
    prefix="/dashboard",
    tags=["dashboard"]
)

# --------------------------
# Pydantic schemas
# --------------------------
class AssignmentOut(BaseModel):
    assignment_id: int
    assignment_name: str
    due_date: date
    difficulty: Optional[str] = None

    class Config:
        orm_mode = True

class SubmissionOut(BaseModel):
    submission_id: int
    assignment_name: str
    student_name: str
    status: str
    submitted_at: datetime

    class Config:
        orm_mode = True

# --------------------------
# Database Session Dependency
# --------------------------
async def get_db():
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()

# --------------------------
# Endpoints
# --------------------------

@router.get("/graded-submissions")
async def submission_get_graded(session: AsyncSession = Depends(get_db)):
    """Fetch the count of submissions with 'Graded' status."""
    try:
        result = await session.execute(
            select(Submission)
            .where(Submission.report["instructor-evaluation"].has_key("status"))
            .where(Submission.report["instructor-evaluation"]["status"].astext == "Graded")
        )
        submissions = result.scalars().all()
        print(f"Graded Submissions: {len(submissions)}")  # Debugging log
        return {"count": len(submissions)}
    except Exception as e:
        print(f"Error fetching graded count: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/active-assignments", response_model=List[AssignmentOut])
async def get_active_assignments(session: AsyncSession = Depends(get_db)):
    """Fetch active assignments (assignments with a future due date)."""
    try:
        today = datetime.now(timezone.utc).date()

        result = await session.execute(
            select(Assignment)
            .where(Assignment.due_date >= today)
            .order_by(Assignment.due_date)
        )
        assignments = result.scalars().all()
        return assignments
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching active assignments: {str(e)}")

@router.get("/get-pending-review")
async def pending_reviews(session: AsyncSession = Depends(get_db)):
    """Fetch the count of submissions with 'Pending' status."""
    try:
        result = await session.execute(
            select(Submission)
            .where(Submission.report["instructor-evaluation"].has_key("status"))
            .where(Submission.report["instructor-evaluation"]["status"].astext == "Pending")
        )
        submissions = result.scalars().all()
        count = len(submissions)
        print(f"Pending Review Count: {count}")
        return {"count": count}
    except Exception as e:
        print(f"Error fetching pending review count: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")