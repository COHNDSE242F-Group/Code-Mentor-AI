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
                "difficulty": description.get("difficulty"),
                "aiEvaluation": description.get("aiEvaluation"),
                "plagiarism": description.get("plagiarism"),
                "dueDate": str(assignment.due_date) if getattr(assignment, "due_date", None) else None,
                "batch": getattr(assignment.batch, "batch_name", None) if getattr(assignment, "batch", None) else None,
                "instructor": getattr(assignment.instructor, "instructor_name", None) if getattr(assignment, "instructor", None) else None,
                "status": status,
                "submissions": submissions,
            }
    except HTTPException:
        raise
    except Exception as e:
        # help debugging by raising a 500 with message
        raise HTTPException(status_code=500, detail=str(e))
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/assignment")

# Mock assignments data (like database)
MOCK_ASSIGNMENTS = {
    1: {
        "id": 1,
        "title": "Python Basics",
        "language": "Python",
        "difficulty": "Easy",
        "dueDate": "2025-10-20",
        "dueTime": "14:00",
        "batch": "Batch A",
        "status": "Active",
        "instructions": "Write a Python program to demonstrate loops and conditional statements.\nSubmit your code as a .py file.",
        "aiEvaluation": True,
        "plagiarism": False,
        "attachments": ["python_basics_instructions.pdf", "example_code.zip"]
    },
    2: {
        "id": 2,
        "title": "JavaScript Loops",
        "language": "JavaScript",
        "difficulty": "Medium",
        "dueDate": "2025-10-22",
        "dueTime": "10:00",
        "batch": "Batch B",
        "status": "Draft",
        "instructions": "Create a JS program to practice loops and array manipulation.",
        "aiEvaluation": False,
        "plagiarism": True,
        "attachments": ["loops_guide.pdf"]
    },
    3: {
        "id": 3,
        "title": "SQL Advanced Joins",
        "language": "SQL",
        "difficulty": "Hard",
        "dueDate": "2025-10-25",
        "dueTime": "17:00",
        "batch": "Batch C",
        "status": "Scheduled",
        "instructions": "Write SQL queries that demonstrate INNER, LEFT, and RIGHT JOIN operations.",
        "aiEvaluation": True,
        "plagiarism": True,
        "attachments": []
    },
    4: {
        "id": 4,
        "title": "Java Inheritance",
        "language": "Java",
        "difficulty": "Advanced",
        "dueDate": "2025-10-28",
        "dueTime": "11:30",
        "batch": "Batch A",
        "status": "Closed",
        "instructions": "Implement a class hierarchy demonstrating inheritance and polymorphism.",
        "aiEvaluation": False,
        "plagiarism": False,
        "attachments": ["inheritance_doc.pdf"]
    }
}

@router.get("/details/{assignment_id}")
def get_assignment_details(assignment_id: int):
    assignment = MOCK_ASSIGNMENTS.get(assignment_id)
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return assignment
