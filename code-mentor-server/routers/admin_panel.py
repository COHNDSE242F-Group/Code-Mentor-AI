from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import get_db
from models import Admin, Student, Submission
from auth.auth import verify_token

router = APIRouter()

@router.get("/students")
async def get_students(token: dict = Depends(verify_token), db: AsyncSession = Depends(get_db)):
    admin_id = token["user_id"]

    # Fetch uni_id for the admin
    admin_query = await db.execute(select(Admin.uni_id).where(Admin.admin_id == admin_id))
    uni_id = admin_query.scalar_one_or_none()

    if not uni_id:
        raise HTTPException(status_code=404, detail="University not found for the admin")

    # Fetch students for the university
    students_query = await db.execute(select(Student).where(Student.uni_id == uni_id))
    students = students_query.scalars().all()

    return [{"id": student.student_id, "name": student.student_name, "email": student.email, "progress": 75, "lastActive": "2 hours ago"} for student in students]

@router.get("/submissions")
async def get_submissions(token: dict = Depends(verify_token), db: AsyncSession = Depends(get_db)):
    admin_id = token["user_id"]

    # Fetch uni_id for the admin
    admin_query = await db.execute(select(Admin.uni_id).where(Admin.admin_id == admin_id))
    uni_id = admin_query.scalar_one_or_none()

    if not uni_id:
        raise HTTPException(status_code=404, detail="University not found for the admin")

    # Fetch submissions for the university
    submissions_query = await db.execute(select(Submission).join(Student).where(Student.uni_id == uni_id))
    submissions = submissions_query.scalars().all()

    return [{"id": submission.submission_id, "student": submission.student.student_name, "problem": "Two Sum Problem", "submitted": submission.submitted_at.isoformat(), "status": "passed", "score": 98} for submission in submissions]