from fastapi import APIRouter

router = APIRouter(prefix="/assignment")

@router.get("/list")
def get_assignments():
    # Mock assignment data with status field
    return {
        "assignments": [
            {
                "id": 1,
                "title": "Python Basics",
                "language": "Python",
                "difficulty": "Easy",
                "dueDate": "2025-10-20",
                "batch": "Batch A",
                "status": "Active"
            },
            {
                "id": 2,
                "title": "JavaScript Loops",
                "language": "JavaScript",
                "difficulty": "Medium",
                "dueDate": "2025-10-22",
                "batch": "Batch B",
                "status": "Draft"
            },
            {
                "id": 3,
                "title": "SQL Advanced Joins",
                "language": "SQL",
                "difficulty": "Hard",
                "dueDate": "2025-10-25",
                "batch": "Batch C",
                "status": "Scheduled"
            },
            {
                "id": 4,
                "title": "Java Inheritance",
                "language": "Java",
                "difficulty": "Advanced",
                "dueDate": "2025-10-28",
                "batch": "Batch A",
                "status": "Closed"
            }
        ]
    }
