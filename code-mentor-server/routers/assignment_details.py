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
