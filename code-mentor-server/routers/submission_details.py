from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import async_session
from models.submission import Submission
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import joinedload

router = APIRouter()

class SubmissionDetail(BaseModel):
    id: int
    assignment: str
    student: str
    studentId: str
    submittedAt: str
    code: str
    status: str
    score: Optional[int]
    batch: str
    paste: bool
    output: Optional[str] = ""
    instructor_feedback: Optional[List[str]] = []
    grade: Optional[str] = ""

class GradeFeedback(BaseModel):
    score: int
    feedback: str

# Dependency to get database session
async def get_db():
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()

@router.get("/submissions/{submission_id}", response_model=SubmissionDetail)
async def get_submission_detail(submission_id: int, session: AsyncSession = Depends(get_db)):
    result = await session.execute(
        select(Submission)
        .where(Submission.submission_id == submission_id)
        .options(joinedload(Submission.assignment), joinedload(Submission.student))
    )
    submission = result.scalar_one_or_none()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    report = submission.report or {}
    ai_eval = report.get("ai-evaluation", {})
    instructor_eval = report.get("instructor-evaluation", {})

    # Determine status - if no instructor evaluation exists, default to "Pending"
    status = "Pending"
    if instructor_eval:
        status = instructor_eval.get("status", "Pending")
    
    # Determine score - use instructor score if available, otherwise AI score
    score_value = None
    if instructor_eval and "score" in instructor_eval:
        score_value = instructor_eval.get("score")
    elif ai_eval and "overall_score" in ai_eval:
        score_value = ai_eval.get("overall_score")

    return {
        "id": submission.submission_id,
        "assignment": submission.assignment.assignment_name,
        "student": submission.student.student_name,
        "studentId": submission.student.index_no,
        "submittedAt": submission.submitted_at.strftime("%b %d, %Y - %I:%M %p") if submission.submitted_at else "Not submitted",
        "code": report.get("code", ""),
        "status": status,
        "score": score_value,
        "batch": str(submission.student.batch_id),
        "paste": report.get("paste", False),
        "output": report.get("output", ""),
        "instructor_feedback": instructor_eval.get("feedback", []),
        "grade": instructor_eval.get("grade", "")
    }
@router.post("/save_submissions/{submission_id}/grade")
async def save_grade_feedback(
    submission_id: int, 
    grade_feedback: GradeFeedback, 
    session: AsyncSession = Depends(get_db)
):
    result = await session.execute(
        select(Submission)
        .where(Submission.submission_id == submission_id)
    )
    submission = result.scalar_one_or_none()
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    print(f"Original report: {submission.report}")  # Debug log

    # Initialize report if None
    if submission.report is None:
        submission.report = {}
    
    # Create instructor-evaluation section if it doesn't exist
    if "instructor-evaluation" not in submission.report:
        submission.report["instructor-evaluation"] = {}
    
    # Update the instructor evaluation with all required fields
    instructor_eval = submission.report["instructor-evaluation"]
    
    # Update score, feedback, status, and grade
    instructor_eval["score"] = grade_feedback.score
    instructor_eval["feedback"] = [grade_feedback.feedback] if grade_feedback.feedback else []
    instructor_eval["status"] = "Graded"
    
    # Calculate grade based on score
    if grade_feedback.score >= 90:
        instructor_eval["grade"] = "A"
    elif grade_feedback.score >= 80:
        instructor_eval["grade"] = "B"
    elif grade_feedback.score >= 70:
        instructor_eval["grade"] = "C"
    elif grade_feedback.score >= 60:
        instructor_eval["grade"] = "D"
    else:
        instructor_eval["grade"] = "F"

    print(f"Updated report: {submission.report}")  # Debug log

    # Mark the object as modified and commit
    session.add(submission)  # Ensure the submission object is marked as modified
    await session.commit()  # Commit the changes to the database
    await session.refresh(submission)  # Refresh the submission object to ensure changes are persisted
    
    # Return the updated submission data
    return await get_submission_detail(submission_id, session)