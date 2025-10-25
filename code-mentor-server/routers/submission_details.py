from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import async_session
from models.submission import Submission
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import joinedload

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

class GradeFeedback(BaseModel):
    score: int
    feedback: str

@router.get("/submission/{submission_id}", response_model=SubmissionDetail)
async def get_submission_detail(submission_id: int, session: AsyncSession = Depends(async_session)):
    if not submission_id:
        raise HTTPException(status_code=400, detail="Submission ID is required")

    result = await session.execute(
        select(Submission)
        .where(Submission.submission_id == submission_id)
        .options(joinedload(Submission.assignment), joinedload(Submission.student))
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
        "submittedAt": submission.submitted_at.strftime("%b %d, %Y - %I:%M %p"),
        "code": report.get("code", ""),
        "paste": report.get("paste", False),
        "output": report.get("output", ""),
        "status": report.get("status", "Pending"),
        "score": report.get("score"),
        "batch": submission.student.batch_id,
        "plagiarism": report.get("plagiarism"),
        "ai_feedback": report.get("ai_feedback"),
    }

@router.post("/submission/{submission_id}/grade")
async def save_grade_feedback(submission_id: int, grade_feedback: GradeFeedback, session: AsyncSession = Depends(async_session)):
    result = await session.execute(select(Submission).where(Submission.submission_id == submission_id))
    submission = result.scalar_one_or_none()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    # Update the report JSON field with grade and feedback
    submission.report = submission.report or {}
    submission.report["score"] = grade_feedback.score
    submission.report["feedback"] = grade_feedback.feedback
    submission.report["status"] = "Graded"

    session.add(submission)
    await session.commit()
    return {"message": "Grade and feedback saved successfully"}