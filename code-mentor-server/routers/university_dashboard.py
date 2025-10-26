from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import async_session, get_db
from models import Admin, Instructor, Student, Assignment,University,Batch
from auth.auth import verify_token



router = APIRouter()

@router.get("/university/dashboard", summary="Fetch university dashboard data")
async def get_university_dashboard(uni_id: int):
    """
    Fetch data for the university dashboard.
    """
    async with async_session() as session:
        # Fetch university details
        university = await session.execute(
            select(University).where(University.university_id == uni_id)
        )
        university = university.scalar_one_or_none()
        if not university:
            raise HTTPException(status_code=404, detail="University not found")

        # Fetch active instructors
        active_instructors = await session.execute(
            select(Instructor).where(Instructor.uni_id == uni_id)
        )
        active_instructors_count = active_instructors.scalars().all()

        # Fetch active students
        active_students = await session.execute(
            select(Student).where(Student.uni_id == uni_id)
        )
        active_students_count = active_students.scalars().all()

        # Fetch courses created
        courses_created = await session.execute(
            select(Assignment).where(Assignment.batch_id.in_(
                select(Batch.batch_id).where(Batch.uni_id == uni_id)
            ))
        )
        courses_created_count = courses_created.scalars().all()

        # Mock storage data (replace with actual storage logic if available)
        storage_used = "87 GB"
        storage_limit = "200 GB"

        # Fetch recent activity (e.g., new students, instructors, courses)
        recent_activity = []
        new_students = await session.execute(
            select(Student).where(Student.uni_id == uni_id).order_by(Student.student_id.desc()).limit(5)
        )
        for student in new_students.scalars().all():
            recent_activity.append({
                "type": "student_joined",
                "name": student.student_name,
                "date": "Recently"
            })

        return {
            "university_name": university.university_name,
            "active_instructors": len(active_instructors_count),
            "active_students": len(active_students_count),
            "courses_created": len(courses_created_count),
            "storage_used": storage_used,
            "storage_limit": storage_limit,
            "recent_activity": recent_activity,
        }

@router.get("/university-stats")
async def get_university_stats(token: dict = Depends(verify_token), db: AsyncSession = Depends(get_db)):
    try:
        # Extract admin_id from token
        admin_id = token["user_id"]

        # Fetch uni_id for the admin
        admin_query = await db.execute(
            select(Admin.uni_id).where(Admin.admin_id == admin_id)
        )
        uni_id = admin_query.scalar_one_or_none()

        if not uni_id:
            raise HTTPException(status_code=404, detail="University not found for the admin")

        # Fetch active instructors count
        active_instructors_query = await db.execute(
            select(Instructor).where(Instructor.uni_id == uni_id)
        )
        active_instructors_count = active_instructors_query.scalars().all()

        # Fetch active students count
        active_students_query = await db.execute(
            select(Student).where(Student.uni_id == uni_id)
        )
        active_students_count = active_students_query.scalars().all()

        # Fetch courses created count
        courses_created_query = await db.execute(
            select(Assignment).where(Assignment.instructor_id.in_(
                select(Instructor.instructor_id).where(Instructor.uni_id == uni_id)
            ))
        )
        courses_created_count = courses_created_query.scalars().all()

        return {
            "activeInstructors": len(active_instructors_count),
            "activeStudents": len(active_students_count),
            "coursesCreated": len(courses_created_count),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/university/details")
async def get_university_details(token: dict = Depends(verify_token)):
    user_id = token["user_id"]  # Extract admin_id from token
    async with async_session() as session:
        # Fetch admin details to find university_id
        admin_result = await session.execute(
            select(Admin).where(Admin.admin_id == user_id)
        )
        admin = admin_result.scalar_one_or_none()
        
        if not admin:
            raise HTTPException(status_code=404, detail="Admin not found")
        
        # Fetch university details using admin's university_id
        university_result = await session.execute(
            select(University).where(University.university_id == admin.uni_id)
        )
        university = university_result.scalar_one_or_none()
        
        if not university:
            raise HTTPException(status_code=404, detail="University not found")
        
        return {
            "university_id": university.university_id,
            "university_name": university.university_name,
            "address": university.address,
            "email": university.email,
            "contact_no": university.contact_no
        }