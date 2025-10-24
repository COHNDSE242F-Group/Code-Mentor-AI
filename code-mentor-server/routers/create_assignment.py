from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import date, time as _time
from sqlalchemy.future import select

from database import async_session
from models.assignment import Assignment
from models.batch import Batch
from models.instructor import Instructor
from auth.dependencies import login_required

router = APIRouter()


class AssignmentCreateIn(BaseModel):
    title: str
    language: str
    difficulty: str
    dueDate: str  # ISO date string
    dueTime: Optional[str] = None
    batch: Optional[str] = None
    instructions: str
    aiEvaluation: Optional[bool] = False
    plagiarism: Optional[bool] = False


@router.get("/assignment/options")
async def get_assignment_options():
    """Return available batches/groups for assignment targeting."""
    async with async_session() as session:
        result = await session.execute(select(Batch))
        batches = [b.batch_name for b in result.scalars().all()]
        # include an 'All Students' option for convenience
        return {"batches": ["All Students"] + batches}


@router.post("/assignment/create")
async def create_assignment(assignment: AssignmentCreateIn, token_data: dict = Depends(login_required)):
    """Create an assignment in the database. Requires authentication (instructor).
    The token's user_id is used as instructor_id.
    """
    user_id_raw = token_data.get("user_id")
    try:
        instructor_id = int(user_id_raw)
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user id in token")

    # Parse due date
    try:
        due_date = date.fromisoformat(assignment.dueDate)
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid dueDate format, expected YYYY-MM-DD")

    async with async_session() as session:
        # ensure instructor exists (token user_id should map to an Instructor)
        instr = await session.execute(select(Instructor).where(Instructor.instructor_id == instructor_id))
        instr_obj = instr.scalar_one_or_none()
        if not instr_obj:
            raise HTTPException(status_code=404, detail="Instructor not found for current user")
        # Resolve batch name to batch_id (if provided and not 'All Students')
        batch_id = None
        if assignment.batch and assignment.batch != "All Students":
            result = await session.execute(select(Batch).where(Batch.batch_name == assignment.batch))
            batch = result.scalar_one_or_none()
            if not batch:
                raise HTTPException(status_code=404, detail=f"Batch '{assignment.batch}' not found")
            batch_id = batch.batch_id

        # Store instructions and metadata in description (JSON column)
        description: Dict[str, Any] = {
            "instructions": assignment.instructions,
            "language": assignment.language,
            "difficulty": assignment.difficulty,
            "dueTime": assignment.dueTime,
            "aiEvaluation": assignment.aiEvaluation,
            "plagiarism": assignment.plagiarism,
        }

        # parse optional dueTime into a time object for the new column
        due_time_obj = None
        if assignment.dueTime:
            try:
                due_time_obj = _time.fromisoformat(assignment.dueTime)
            except Exception:
                # if parsing fails, keep None and still store original in description
                due_time_obj = None

        new_assignment = Assignment(
            assignment_name=assignment.title,
            description=description,
            due_date=due_date,
            due_time=due_time_obj,
            difficulty=assignment.difficulty,
            instructor_id=instructor_id,
            batch_id=batch_id,
        )

        session.add(new_assignment)
        await session.commit()
        await session.refresh(new_assignment)

        return {
            "assignment_id": new_assignment.assignment_id,
            "assignment_name": new_assignment.assignment_name,
            "due_date": str(new_assignment.due_date),
            "due_time": (new_assignment.due_time.isoformat() if getattr(new_assignment, 'due_time', None) else (new_assignment.description or {}).get("dueTime")),
            "instructor_id": new_assignment.instructor_id,
            "batch_id": new_assignment.batch_id,
        }


