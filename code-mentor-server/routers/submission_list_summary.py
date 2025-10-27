from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import async_session
from models.submission import Submission
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import joinedload
from datetime import datetime, date
from sqlalchemy import or_, and_

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
    index_no: str

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
        async with async_session() as session:
            # Count submissions where instructor-evaluation.status is "Graded"
            result = await session.execute(
                select(Submission).where(
                    Submission.report["instructor-evaluation"]["status"].astext == "Graded"
                )
            )
            submissions = result.scalars().all()
            count = len(submissions)
            print(f"Graded Count: {count}")
            return {"count": count}
    except Exception as e:
        print(f"Error fetching graded count: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/pending-review-count")
async def get_pending_review_count():
    """Fetch the count of submissions that are pending review."""
    try:
        async with async_session() as session:
            # Count submissions that are NOT graded (pending)
            # This includes:
            # 1. Submissions with no instructor-evaluation at all
            # 2. Submissions with instructor-evaluation but no status field
            # 3. Submissions with instructor-evaluation.status = "Pending"
            # 4. Submissions with instructor-evaluation.status != "Graded"
            
            # First, get total submissions
            total_result = await session.execute(select(Submission))
            total_submissions = total_result.scalars().all()
            
            # Then get graded submissions
            graded_result = await session.execute(
                select(Submission).where(
                    Submission.report["instructor-evaluation"]["status"].astext == "Graded"
                )
            )
            graded_submissions = graded_result.scalars().all()
            
            # Pending = Total - Graded
            pending_count = len(total_submissions) - len(graded_submissions)
            
            print(f"Total Submissions: {len(total_submissions)}")
            print(f"Graded Submissions: {len(graded_submissions)}")
            print(f"Pending Review Count: {pending_count}")
            
            return {"count": pending_count}
            
    except Exception as e:
        print(f"Error fetching pending review count: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Alternative approach with more detailed filtering
@router.get("/pending-review-count-detailed")
async def get_pending_review_count_detailed():
    """Alternative implementation with detailed filtering."""
    try:
        async with async_session() as session:
            # Build conditions for pending submissions
            conditions = [
                # No instructor-evaluation section at all
                ~Submission.report.has_key("instructor-evaluation"),
                # instructor-evaluation exists but no status field
                and_(
                    Submission.report.has_key("instructor-evaluation"),
                    ~Submission.report["instructor-evaluation"].has_key("status")
                ),
                # instructor-evaluation.status is "Pending"
                Submission.report["instructor-evaluation"]["status"].astext == "Pending",
                # instructor-evaluation.status exists but is not "Graded"
                and_(
                    Submission.report["instructor-evaluation"].has_key("status"),
                    Submission.report["instructor-evaluation"]["status"].astext != "Graded"
                )
            ]
            
            result = await session.execute(
                select(Submission).where(or_(*conditions))
            )
            pending_submissions = result.scalars().all()
            count = len(pending_submissions)
            
            print(f"Pending Review Count (Detailed): {count}")
            return {"count": count}
            
    except Exception as e:
        print(f"Error fetching pending review count (detailed): {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")