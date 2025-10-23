from fastapi import APIRouter
from sqlalchemy.future import select
from database import async_session
from models.student import Student
from models.user import User
from models.batch import Batch
from models.university import University
from models.instructor import Instructor

router = APIRouter()


@router.get("/students")
async def list_students():
    """Return expanded student details joined with user, university and batch.

    Fields returned per student:
      student_id, index_no, name, email, contact_no,
      university_name, batch_name, username, password
    """
    async with async_session() as session:
        stmt = (
            select(Student, User, University, Batch)
            .join(User, User.user_id == Student.student_id)
            .join(University, Student.uni_id == University.university_id)
            .join(Batch, Student.batch_id == Batch.batch_id)
        )
        result = await session.execute(stmt)
        students = []
        for s, u, uni, b in result.all():
            students.append({
                "student_id": s.student_id,
                "index_no": s.index_no,
                "name": s.student_name,
                "email": s.email,
                "contact_no": s.contact_no,
                "university_name": uni.university_name,
                "batch_name": b.batch_name,
                "username": u.username,
                "password": u.password,  # NOTE: returning passwords is insecure; consider removing or hashing
            })
        return students


@router.get("/students/{student_id}")
async def get_student_detail(student_id: int):
    async with async_session() as session:
        stmt = (
            select(Student, User, University, Batch)
            .join(User, User.user_id == Student.student_id)
            .join(University, Student.uni_id == University.university_id)
            .join(Batch, Student.batch_id == Batch.batch_id)
            .where(Student.student_id == student_id)
        )
        result = await session.execute(stmt)
        row = result.first()
        if not row:
            return {}
        s, u, uni, b = row
        return {
            "student_id": s.student_id,
            "index_no": s.index_no,
            "name": s.student_name,
            "email": s.email,
            "contact_no": s.contact_no,
            "university_name": uni.university_name,
            "batch_name": b.batch_name,
            "batch_id": b.batch_id,
            "uni_id": uni.university_id,
            "username": u.username,
            "password": u.password,
        }


@router.get("/batches")
async def list_batches():
    async with async_session() as session:
        result = await session.execute(select(Batch))
        batches = [
            {"batch_id": b.batch_id, "batch_name": b.batch_name, "uni_id": b.uni_id}
            for b in result.scalars().all()
        ]
        return batches


@router.get("/instructors")
async def list_instructors():
    """Return expanded instructor details joined with user and university.

    Fields returned per instructor:
      instructor_id, index_no, name, email, contact_no, university_name, username, password
    """
    async with async_session() as session:
        stmt = (
            select(Instructor, User, University)
            .join(User, User.user_id == Instructor.instructor_id)
            .join(University, Instructor.uni_id == University.university_id)
        )
        result = await session.execute(stmt)
        instructors = []
        for ins, u, uni in result.all():
            instructors.append({
                "instructor_id": ins.instructor_id,
                "index_no": ins.index_no,
                "name": ins.instructor_name,
                "email": ins.email,
                "contact_no": ins.contact_no,
                "university_name": uni.university_name,
                "username": u.username,
                "password": u.password,  # NOTE: insecure to return raw passwords
            })
        return instructors


@router.get("/instructors/{instructor_id}")
async def get_instructor_detail(instructor_id: int):
    async with async_session() as session:
        stmt = (
            select(Instructor, User, University)
            .join(User, User.user_id == Instructor.instructor_id)
            .join(University, Instructor.uni_id == University.university_id)
            .where(Instructor.instructor_id == instructor_id)
        )
        result = await session.execute(stmt)
        row = result.first()
        if not row:
            return {}
        ins, u, uni = row
        return {
            "instructor_id": ins.instructor_id,
            "index_no": ins.index_no,
            "name": ins.instructor_name,
            "email": ins.email,
            "contact_no": ins.contact_no,
            "university_name": uni.university_name,
            "uni_id": uni.university_id,
            "username": u.username,
            "password": u.password,
        }
