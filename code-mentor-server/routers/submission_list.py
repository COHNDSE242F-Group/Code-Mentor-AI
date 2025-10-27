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




@router.get("/", response_model=List[SubmissionListOut])
async def get_submissions():
    async with async_session() as session:
        try:
            result = await session.execute(
                select(Submission)
                .options(joinedload(Submission.assignment), joinedload(Submission.student))
            )
            submissions = result.scalars().all()

            submissions_list = []
            for submission in submissions:
                report = submission.report or {}
                submissions_list.append({
                    "id": submission.submission_id,
                    "assignment": submission.assignment.assignment_name,
                    "student": submission.student.student_name,
                    "studentId": submission.student.index_no,
                    "submittedAt": submission.submitted_at.strftime("%b %d, %Y - %I:%M %p") if submission.submitted_at else "Not submitted",
                    "status": report.get("instructor-evaluation", {}).get("status", report.get("status", "Pending")),
                    "score": report.get("instructor-evaluation", {}).get("score", report.get("score")),
                    "batch": str(submission.student.batch_id),
                })
            return submissions_list
        except Exception as e:
            print(f"Error fetching submissions: {e}")
            raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/{submission_id}", response_model=SubmissionDetailOut)
async def get_submission_detail(submission_id: int):
    async with async_session() as session:
        try:
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

            report = submission.report or {}
            return {
                "id": submission.submission_id,
                "assignment": submission.assignment.assignment_name,
                "student": submission.student.student_name,
                "studentId": submission.student.index_no,
                "submittedAt": submission.submitted_at.strftime("%b %d, %Y - %I:%M %p") if submission.submitted_at else "Not submitted",
                "code": report.get("code", ""),
                "paste": report.get("paste", False),
                "output": report.get("output", ""),
                "status": report.get("instructor-evaluation", {}).get("status", report.get("status", "Pending")),
                "score": report.get("instructor-evaluation", {}).get("score", report.get("score")),
                "batch": str(submission.student.batch_id),
                "feedback": report.get("instructor-evaluation", {}).get("feedback", []),
                "grade": report.get("instructor-evaluation", {}).get("grade", "N/A"),
            }
        except Exception as e:
            print(f"Error fetching submission detail: {e}")
            raise HTTPException(status_code=500, detail="Internal Server Error")