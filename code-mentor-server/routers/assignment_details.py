from fastapi import APIRouter, HTTPException
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from database import async_session
from models.assignment import Assignment
from models.submission import Submission

router = APIRouter(prefix="/assignment")


@router.get("/details/{assignment_id}")
async def get_assignment_details(assignment_id: int):
    """Return assignment details including submissions and related batch/instructor info."""
    try:
        async with async_session() as session:
            stmt = (
                select(Assignment)
                .where(Assignment.assignment_id == assignment_id)
                .options(
                    selectinload(Assignment.batch),
                    selectinload(Assignment.instructor),
                    selectinload(Assignment.submissions).selectinload(Submission.student),
                )
            )
            result = await session.execute(stmt)
            assignment = result.scalar_one_or_none()
            if not assignment:
                raise HTTPException(status_code=404, detail="Assignment not found")

            # flatten description JSON
            description = getattr(assignment, "description", {}) or {}

            # compute status similarly to the list endpoint
            due = getattr(assignment, 'due_date', None)
            if not due:
                status = 'Draft'
            else:
                from datetime import date as _date
                today = _date.today()
                if due < today:
                    status = 'Closed'
                elif due == today:
                    status = 'Active'
                else:
                    status = 'Scheduled'

            submissions = []
            for s in getattr(assignment, "submissions", []) or []:
                student = getattr(s, "student", None)
                submissions.append({
                    "submission_id": s.submission_id,
                    "student_id": s.student_id,
                    "student_name": getattr(student, "student_name", None) if student else None,
                    "submitted_at": s.submitted_at.isoformat() if getattr(s, "submitted_at", None) else None,
                    "report": s.report,
                })

            return {
                "id": assignment.assignment_id,
                "title": assignment.assignment_name,
                "instructions": description.get("instructions"),
                "language": description.get("language"),
                "difficulty": (assignment.difficulty if getattr(assignment, 'difficulty', None) else description.get("difficulty")),
                "aiEvaluation": description.get("aiEvaluation"),
                "plagiarism": description.get("plagiarism"),
                "dueDate": str(assignment.due_date) if getattr(assignment, "due_date", None) else None,
                "dueTime": (assignment.due_time.isoformat() if getattr(assignment, 'due_time', None) else description.get("dueTime")),
                "batch": getattr(assignment.batch, "batch_name", None) if getattr(assignment, "batch", None) else None,
                "instructor": getattr(assignment.instructor, "instructor_name", None) if getattr(assignment, "instructor", None) else None,
                "instructor_id": getattr(assignment, 'instructor_id', None),
                "status": status,
                "submissions": submissions,
            }
    except HTTPException:
        raise
    except Exception as e:
        # help debugging by raising a 500 with message
        raise HTTPException(status_code=500, detail=str(e))

