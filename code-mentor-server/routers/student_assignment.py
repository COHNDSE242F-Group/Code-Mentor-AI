from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from sqlalchemy.future import select
from sqlalchemy.orm import aliased
from database import async_session
from auth.dependencies import login_required
from models.student import Student
from models.assignment import Assignment
from models import Submission
from pydantic import BaseModel
from datetime import date, time
from sqlalchemy import desc, func

router = APIRouter()

# --------------------------
# Pydantic schemas
# --------------------------
class AssignmentOut(BaseModel):
    assignment_id: int
    assignment_name: str
    description: Optional[dict]
    due_date: date
    due_time: Optional[time] = None
    difficulty: Optional[str] = None
    instructor_id: Optional[int]
    batch_id: Optional[int]

    model_config = {"from_attributes": True}

class AssignmentAndSubmission(BaseModel):
    Assignment: AssignmentOut
    Submission_id: Optional[int] = None

    model_config = {"from_attributes": True}

# --------------------------
# GET /student - Assignments with Submissions
# --------------------------
@router.get("/student_assignment", response_model=List[AssignmentAndSubmission])
async def get_assignments(token_data: dict = Depends(login_required)):
    """
    Get all assignments for the logged-in student, along with their submissions (if any).
    """
    student_id = int(token_data["user_id"])

    async with async_session() as session:
        # Fetch student
        result = await session.execute(
            select(Student).where(Student.student_id == student_id)
        )
        student = result.scalar_one_or_none()
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")

        batch_id = student.batch_id
        if batch_id is None:
            return []

        # Subquery: latest submission per assignment for this student
        SubmissionAlias = aliased(Submission)
        subquery = (
            select(
                SubmissionAlias.assignment_id,
                func.max(SubmissionAlias.submission_id).label("submission_id")
            )
            .where(SubmissionAlias.student_id == student_id)
            .group_by(SubmissionAlias.assignment_id)
        ).subquery()

        # Main query: assignments with optional submission
        stmt = (
            select(Assignment, subquery.c.submission_id)
            .outerjoin(subquery, subquery.c.assignment_id == Assignment.assignment_id)
            .where(Assignment.batch_id == batch_id)
            .order_by(Assignment.due_date)
        )

        result = await session.execute(stmt)
        rows = result.all()

        assignments_with_submissions = [
            {"Assignment": row[0], "Submission_id": row[1]} for row in rows
        ]

        return assignments_with_submissions