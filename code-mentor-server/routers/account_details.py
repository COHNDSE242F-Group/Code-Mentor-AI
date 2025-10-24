from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, Dict, Any
from sqlalchemy.future import select

from database import async_session
from auth.dependencies import login_required
from models.student import Student
from models.instructor import Instructor
from models.admin import Admin

router = APIRouter()


class ProfileOut(BaseModel):
    name: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    role: Optional[str]
    address: Optional[str] = None
    bio: Optional[str] = None
    avatarUrl: Optional[str] = None


class ProfileUpdate(BaseModel):
    name: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    address: Optional[str] = None
    bio: Optional[str] = None
    avatarUrl: Optional[str] = None


@router.get("/account/profile", response_model=ProfileOut)
async def get_profile(token_data: dict = Depends(login_required)):
    """Return profile information for the logged-in user. Uses Student, Instructor or Admin models depending on token role."""
    user_id_raw = token_data.get("user_id")
    role = token_data.get("role", "user")

    try:
        user_id = int(user_id_raw)
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user id in token")

    async with async_session() as session:
        if role == "student":
            result = await session.execute(select(Student).where(Student.student_id == user_id))
            student = result.scalar_one_or_none()
            if not student:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")

            profile = {
                "name": student.student_name,
                "email": student.email,
                "phone": student.contact_no,
                "role": "student",
                "address": None,
                "bio": None,
                "avatarUrl": None,
            }

            if getattr(student, "university", None):
                profile["address"] = student.university.address

            return profile

        elif role == "instructor":
            result = await session.execute(select(Instructor).where(Instructor.instructor_id == user_id))
            instructor = result.scalar_one_or_none()
            if not instructor:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Instructor not found")

            profile = {
                "name": instructor.instructor_name,
                "email": instructor.email,
                "phone": instructor.contact_no,
                "role": "instructor",
                "address": None,
                "bio": None,
                "avatarUrl": None,
            }

            if getattr(instructor, "university", None):
                profile["address"] = instructor.university.address
            if getattr(instructor, "qualifications", None):
                profile["bio"] = str(instructor.qualifications)
            return profile

        elif role == "admin":
            result = await session.execute(select(Admin).where(Admin.admin_id == user_id))
            admin = result.scalar_one_or_none()
            if not admin:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Admin not found")

            profile = {
                "name": None,
                "email": admin.email,
                "phone": admin.contact_no,
                "role": "admin",
                "address": None,
                "bio": None,
                "avatarUrl": None,
            }

            if getattr(admin, "university", None):
                profile["address"] = admin.university.address
            return profile

        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported role for profile")


@router.post("/account/profile", response_model=ProfileOut)
async def update_profile(update: ProfileUpdate, token_data: dict = Depends(login_required)):
    """Update basic profile fields for the logged-in user. Only a small set of fields are allowed and persisted."""
    user_id_raw = token_data.get("user_id")
    role = token_data.get("role", "user")

    try:
        user_id = int(user_id_raw)
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user id in token")

    async with async_session() as session:
        if role == "student":
            result = await session.execute(select(Student).where(Student.student_id == user_id))
            student = result.scalar_one_or_none()
            if not student:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")

            data = update.dict(exclude_unset=True)
            if "name" in data:
                student.student_name = data["name"]
            if "phone" in data:
                student.contact_no = data["phone"]
            if "email" in data:
                student.email = data["email"]

            session.add(student)
            await session.commit()
            await session.refresh(student)

            return {
                "name": student.student_name,
                "email": student.email,
                "phone": student.contact_no,
                "role": "student",
                "address": student.university.address if getattr(student, "university", None) else None,
                "bio": None,
                "avatarUrl": None,
            }

        elif role == "instructor":
            result = await session.execute(select(Instructor).where(Instructor.instructor_id == user_id))
            instructor = result.scalar_one_or_none()
            if not instructor:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Instructor not found")

            data = update.dict(exclude_unset=True)
            if "name" in data:
                instructor.instructor_name = data["name"]
            if "phone" in data:
                instructor.contact_no = data["phone"]
            if "email" in data:
                instructor.email = data["email"]

            session.add(instructor)
            await session.commit()
            await session.refresh(instructor)

            return {
                "name": instructor.instructor_name,
                "email": instructor.email,
                "phone": instructor.contact_no,
                "role": "instructor",
                "address": instructor.university.address if getattr(instructor, "university", None) else None,
                "bio": str(instructor.qualifications) if getattr(instructor, "qualifications", None) else None,
                "avatarUrl": None,
            }

        elif role == "admin":
            result = await session.execute(select(Admin).where(Admin.admin_id == user_id))
            admin = result.scalar_one_or_none()
            if not admin:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Admin not found")

            data = update.dict(exclude_unset=True)
            if "phone" in data:
                admin.contact_no = data["phone"]
            if "email" in data:
                admin.email = data["email"]

            session.add(admin)
            await session.commit()
            await session.refresh(admin)

            return {
                "name": None,
                "email": admin.email,
                "phone": admin.contact_no,
                "role": "admin",
                "address": admin.university.address if getattr(admin, "university", None) else None,
                "bio": None,
                "avatarUrl": None,
            }

        else:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported role for update")

