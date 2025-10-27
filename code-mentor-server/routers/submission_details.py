from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import async_session
from models.submission import Submission
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import joinedload
from typing import Optional, List, Dict, Any


router = APIRouter()



class AIEvaluation(BaseModel):
    errors: Optional[List[str]] = []
    improvements: Optional[List[str]] = []
    overall_score: Optional[int] = None
    good_practices: Optional[List[str]] = []

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
    ai_evaluation: Optional[AIEvaluation] = None


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

    return {
        "id": submission.submission_id,
        "assignment": submission.assignment.assignment_name,
        "student": submission.student.student_name,
        "studentId": submission.student.index_no,
        "submittedAt": submission.submitted_at.strftime("%b %d, %Y - %I:%M %p") if submission.submitted_at else "Not submitted",
        "code": report.get("code", ""),
        "status": instructor_eval.get("status", ai_eval.get("status", "Pending")),
        "score": instructor_eval.get("score", ai_eval.get("overall_score")),
        "batch": str(submission.student.batch_id),
        "paste": report.get("paste", False),
        "output": report.get("output", ""),
        "instructor_feedback": instructor_eval.get("feedback", []),
        "grade": instructor_eval.get("grade", ""),
        # Add AI evaluation data
        "ai_evaluation": {
            "errors": ai_eval.get("errors", []),
            "improvements": ai_eval.get("improvements", []),
            "overall_score": ai_eval.get("overall_score"),
            "good_practices": ai_eval.get("good_practices", [])
        } if ai_eval else None
    }
@router.post("/submissions/{submission_id}/grade")
async def save_grade_feedback(
    submission_id: int, 
    grade_feedback: GradeFeedback, 
    session: AsyncSession = Depends(get_db)
):
    try:
        result = await session.execute(
            select(Submission)
            .where(Submission.submission_id == submission_id)
        )
        submission = result.scalar_one_or_none()
        
        if not submission:
            raise HTTPException(status_code=404, detail="Submission not found")

        # Create a new report dictionary to avoid reference issues
        current_report = submission.report or {}
        
        # Calculate grade
        if grade_feedback.score >= 90:
            grade = "A"
        elif grade_feedback.score >= 80:
            grade = "B"
        elif grade_feedback.score >= 70:
            grade = "C"
        elif grade_feedback.score >= 60:
            grade = "D"
        else:
            grade = "F"

        # Build instructor evaluation
        instructor_eval = {
            "score": grade_feedback.score,
            "feedback": [grade_feedback.feedback] if grade_feedback.feedback else [],
            "status": "Graded",
            "grade": grade
        }

        # Update report
        updated_report = {
            **current_report,
            "instructor-evaluation": instructor_eval
        }

        # Direct assignment
        submission.report = updated_report

        await session.commit()
        await session.refresh(submission)
        
        return await get_submission_detail(submission_id, session)
    
    except Exception as e:
        await session.rollback()
        print(f"Error saving grade: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to save grade: {str(e)}")