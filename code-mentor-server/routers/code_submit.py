from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.future import select
from datetime import datetime, timezone
from typing import Any, Dict
from pydantic import BaseModel

from database import async_session
from models.submission import Submission
from auth.dependencies import role_required

router = APIRouter(
    prefix="/submit",
    tags=["submission"]
)

class SubmissionData(BaseModel):
    assignment_id: int
    report: Dict[str, Any]  # JSON report


@router.post("/", summary="Submit or update an assignment")
async def submit_assignment(
    data: SubmissionData,
    token_data: dict = Depends(role_required(["student"]))
):
    """
    Receives a submission containing assignment_id and a report JSON.
    Student_id is automatically taken from the token (user_id).
    If a submission with the same student_id and assignment_id exists, it updates it.
    """
    try:
        student_id = token_data["user_id"]
        now_utc = datetime.now(timezone.utc)

        async with async_session() as session:
            # Check if submission already exists
            result = await session.execute(
                select(Submission).filter(
                    Submission.student_id == student_id,
                    Submission.assignment_id == data.assignment_id
                )
            )
            existing = result.scalars().first()

            if existing:
                existing.report = data.report
                existing.submitted_at = now_utc
                await session.commit()
                await session.refresh(existing)
                return {
                    "status": "updated",
                    "submission_id": existing.submission_id,
                    "message": "Submission updated successfully"
                }

            new_submission = Submission(
                assignment_id=data.assignment_id,
                student_id=student_id,
                report=data.report,
                submitted_at=now_utc
            )
            session.add(new_submission)
            await session.commit()
            await session.refresh(new_submission)

            return {
                "status": "created",
                "submission_id": new_submission.submission_id,
                "message": "Submission created successfully"
            }

    except Exception as e:
        # rollback within a session context if needed
        async with async_session() as session:
            await session.rollback()
        raise HTTPException(status_code=500, detail=f"Error saving submission: {str(e)}")