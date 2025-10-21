from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import async_session
from models.user import User
from models.student import Student
from pydantic import BaseModel
from typing import List, Optional
from models.admin import Admin
from auth.dependencies import role_required

router = APIRouter(
    prefix="/student",
    tags=["student"]
)

# --------------------------
# Pydantic schemas
# --------------------------
class StudentCreate(BaseModel):
    username: str
    password: str
    student_name: str
    email: str
    contact_no: str | None = None
    index_no: str | None = None
    batch_id: int

class StudentUpdate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    student_name: Optional[str] = None
    email: Optional[str] = None
    contact_no: Optional[str] = None
    index_no: Optional[str] = None
    uni_id: Optional[int] = None
    batch_id: Optional[int] = None

class StudentOut(BaseModel):
    student_id: int
    username: str
    student_name: str
    email: str

    class Config:
        orm_mode = True

# --------------------------
# Endpoints
# --------------------------

# Create a new student (and user)
@router.post("/", response_model=StudentOut)
async def create_student(
    student_data: StudentCreate,
    token_data: dict = Depends(role_required(["admin"]))
):
    admin_user_id = token_data.get("user_id")

    async with async_session() as session:
        # Get the admin's uni_id
        result = await session.execute(select(Admin).where(Admin.admin_id == admin_user_id))
        admin = result.scalar_one_or_none()
        if not admin:
            raise HTTPException(status_code=404, detail="Admin not found")

        uni_id = admin.uni_id  # Automatically use admin's university

        async with session.begin():  # Transaction ensures atomicity
            # Create the linked user
            new_user = User(
                username=student_data.username,
                password=student_data.password,
                role="student"
            )
            session.add(new_user)
            await session.flush()  # Assigns new_user.user_id without committing

            # Create the student using the new_user.user_id
            new_student = Student(
                student_id=new_user.user_id,
                student_name=student_data.student_name,
                email=student_data.email,
                contact_no=student_data.contact_no,
                index_no=student_data.index_no,
                uni_id=uni_id,  # no longer from input
                batch_id=student_data.batch_id
            )
            session.add(new_student)

        await session.refresh(new_student)

        return StudentOut(
            student_id=new_student.student_id,
            username=new_user.username,
            student_name=new_student.student_name,
            email=new_student.email
        )

# Get all students
@router.get("/", response_model=List[StudentOut])
async def get_students():
    async with async_session() as session:
        result = await session.execute(
            select(Student, User).join(User, User.user_id == Student.student_id)
        )
        students = [
            StudentOut(
                student_id=s.student_id,
                username=u.username,
                student_name=s.student_name,
                email=s.email
            )
            for s, u in result.all()
        ]
        return students

# Get a single student by ID
@router.get("/{student_id}", response_model=StudentOut)
async def get_student(student_id: int):
    async with async_session() as session:
        result = await session.execute(
            select(Student, User)
            .join(User, User.user_id == Student.student_id)
            .where(Student.student_id == student_id)
        )
        student_tuple = result.first()
        if not student_tuple:
            raise HTTPException(status_code=404, detail="Student not found")
        student, user = student_tuple
        return StudentOut(
            student_id=student.student_id,
            username=user.username,
            student_name=student.student_name,
            email=student.email
        )

# Update student (and optionally username/password)
@router.put("/{student_id}", response_model=StudentOut)
async def update_student(student_id: int, student_update: StudentUpdate):
    async with async_session() as session:
        async with session.begin():
            # Get Student and User
            result = await session.execute(
                select(Student, User)
                .join(User, User.user_id == Student.student_id)
                .where(Student.student_id == student_id)
            )
            student_tuple = result.first()
            if not student_tuple:
                raise HTTPException(status_code=404, detail="Student not found")
            student, user = student_tuple

            # Update User fields
            if student_update.username is not None:
                user.username = student_update.username
            if student_update.password is not None:
                user.password = student_update.password
            session.add(user)

            # Update Student fields
            for field in ["student_name", "email", "contact_no", "index_no", "uni_id", "batch_id"]:
                value = getattr(student_update, field)
                if value is not None:
                    setattr(student, field, value)
            session.add(student)

        await session.refresh(student)
        return StudentOut(
            student_id=student.student_id,
            username=user.username,
            student_name=student.student_name,
            email=student.email
        )

# Delete student (and user)
@router.delete("/{student_id}")
async def delete_student(student_id: int):
    async with async_session() as session:
        async with session.begin():
            # Get Student and User
            result = await session.execute(
                select(Student, User)
                .join(User, User.user_id == Student.student_id)
                .where(Student.student_id == student_id)
            )
            student_tuple = result.first()
            if not student_tuple:
                raise HTTPException(status_code=404, detail="Student not found")
            student, user = student_tuple

            await session.delete(student)
            await session.delete(user)

        return {"detail": "Student and User deleted successfully"}