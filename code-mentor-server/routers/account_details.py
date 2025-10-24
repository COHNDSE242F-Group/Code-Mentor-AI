from fastapi import APIRouter, Depends, HTTPException, status
import logging
from pydantic import BaseModel
from typing import Optional, Dict, Any
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from database import async_session
from auth.dependencies import login_required
from models.student import Student
from models.instructor import Instructor
from models.admin import Admin
from fastapi.responses import JSONResponse
import traceback

router = APIRouter()

logger = logging.getLogger(__name__)


class ProfileOut(BaseModel):
    name: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    role: Optional[str]
    address: Optional[str] = None
    bio: Optional[str] = None
    avatarUrl: Optional[str] = None


class ProfileUpdate(BaseModel):
    # Make these optional for partial updates by providing default None
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    bio: Optional[str] = None
    avatarUrl: Optional[str] = None


@router.get("/account/profile")
async def get_profile(token_data: dict = Depends(login_required)):
    """Return profile information for the logged-in user.
    This returns a flat profile object matching the frontend expectations.
    """
    try:
        logger.debug("[get_profile] token payload: %s", token_data)
    except Exception:
        logger.exception("Failed to log token payload in get_profile")

    user_id_raw = token_data.get("user_id")
    role = token_data.get("role", "user")

    try:
        user_id = int(user_id_raw)
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user id in token")

    try:
        async with async_session() as session:
            if role == "student":
                result = await session.execute(
                    select(Student).options(selectinload(Student.university)).where(Student.student_id == user_id)
                )
                student = result.scalar_one_or_none()
                if not student:
                    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")

                profile = {
                    "name": student.student_name,
                    "email": student.email,
                    "phone": student.contact_no,
                    "role": "student",
                    "address": student.university.address if getattr(student, "university", None) else None,
                    "bio": None,
                    "avatarUrl": None,
                }
                return JSONResponse(content=profile)

            elif role == "instructor":
                result = await session.execute(
                    select(Instructor).where(Instructor.instructor_id == user_id)
                )
                instructor = result.scalar_one_or_none()
                if not instructor:
                    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Instructor not found")

                profile = {
                    "name": instructor.instructor_name,
                    "email": instructor.email,
                    "phone": instructor.contact_no,
                    "role": "instructor",
                    "address": instructor.address,
                    "bio": str(instructor.qualifications) if getattr(instructor, "qualifications", None) else None,
                    "avatarUrl": None,
                }
                return JSONResponse(content=profile)

            elif role == "admin":
                result = await session.execute(
                    select(Admin).options(selectinload(Admin.university)).where(Admin.admin_id == user_id)
                )
                admin = result.scalar_one_or_none()
                if not admin:
                    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Admin not found")

                profile = {
                    "name": None,
                    "email": admin.email,
                    "phone": admin.contact_no,
                    "role": "admin",
                    "address": admin.university.address if getattr(admin, "university", None) else None,
                    "bio": None,
                    "avatarUrl": None,
                }
                return JSONResponse(content=profile)

            else:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported role for profile")
    except HTTPException:
        raise
    except Exception as exc:
        tb = traceback.format_exc()
        logger.exception("Unexpected error in get_profile: %s", exc)
        return JSONResponse(status_code=500, content={"detail": "Internal server error", "exception": str(exc), "trace": tb})



# Dev debug endpoints removed. Use server logs and tests for debugging in development.


@router.post("/account/profile", response_model=ProfileOut)
async def update_profile(update: ProfileUpdate, token_data: dict = Depends(login_required)):
    """Update basic profile fields for the logged-in user. Only a small set of fields are allowed and persisted."""
    # Log token payload for debugging
    try:
        logger.debug("[update_profile] token payload: %s", token_data)
    except Exception:
        logger.exception("Failed to log token payload")

    user_id_raw = token_data.get("user_id")
    role = token_data.get("role", "user")

    try:
        user_id = int(user_id_raw)
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user id in token")

    try:
        async with async_session() as session:
            logger.debug("[update_profile] incoming update: %s", update.dict())
            if role == "student":
                result = await session.execute(
                    select(Student).options(selectinload(Student.university)).where(Student.student_id == user_id)
                )
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

                profile = {
                    "name": student.student_name,
                    "email": student.email,
                    "phone": student.contact_no,
                    "role": "student",
                    "address": student.university.address if getattr(student, "university", None) else None,
                    "bio": None,
                    "avatarUrl": None,
                }
                return JSONResponse(content=profile)

            elif role == "instructor":
                result = await session.execute(
                    select(Instructor).options(selectinload(Instructor.university)).where(Instructor.instructor_id == user_id)
                )
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
                # update instructor's private address when provided
                if "address" in data:
                    instructor.address = data["address"]

                session.add(instructor)
                await session.commit()
                await session.refresh(instructor)

                profile = {
                    "name": instructor.instructor_name,
                    "email": instructor.email,
                    "phone": instructor.contact_no,
                    "role": "instructor",
                    "address": instructor.address,
                    "bio": str(instructor.qualifications) if getattr(instructor, "qualifications", None) else None,
                    "avatarUrl": None,
                }
                return JSONResponse(content=profile)

            elif role == "admin":
                result = await session.execute(
                    select(Admin).options(selectinload(Admin.university)).where(Admin.admin_id == user_id)
                )
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

                profile = {
                    "name": None,
                    "email": admin.email,
                    "phone": admin.contact_no,
                    "role": "admin",
                    "address": admin.university.address if getattr(admin, "university", None) else None,
                    "bio": None,
                    "avatarUrl": None,
                }
                return JSONResponse(content=profile)

            else:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported role for update")
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Unexpected error in update_profile: %s", e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")

