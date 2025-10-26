from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import async_session
from models.user import User
from models.student import Student
from models.instructor import Instructor
from models.admin import Admin
from typing import Optional
from pydantic import BaseModel
import secrets

router = APIRouter()

# Request model for forgot password
class ForgotPasswordRequest(BaseModel):
    email: str

# Request model for reset password
class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

# Temporary storage for reset tokens (use a database or cache in production)
reset_tokens = {}

@router.post("/Allusers-forgot-pw")
async def forgot_password(request: ForgotPasswordRequest, session: AsyncSession = Depends(async_session)):
    """Handle forgot password requests."""
    try:
        print(f"Received email: {request.email}")  # Debug log

        # Search for the email in Student, Instructor, and Admin tables
        student_result = await session.execute(select(Student).where(Student.email == request.email))
        student = student_result.scalar_one_or_none()

        instructor_result = await session.execute(select(Instructor).where(Instructor.email == request.email))
        instructor = instructor_result.scalar_one_or_none()

        admin_result = await session.execute(select(Admin).where(Admin.email == request.email))
        admin = admin_result.scalar_one_or_none()

        # Determine the user_id based on the email match
        user_id = None
        if student:
            user_id = student.student_id
        elif instructor:
            user_id = instructor.instructor_id
        elif admin:
            user_id = admin.admin_id

        if not user_id:
            raise HTTPException(status_code=404, detail="Email not found")

        # Generate a reset token
        reset_token = secrets.token_urlsafe(32)
        reset_tokens[reset_token] = user_id  # Store the token with the user_id

        # Simulate sending an email (replace with actual email sending logic)
        reset_link = f"http://localhost:3000/reset-password?token={reset_token}"
        print(f"Password reset link: {reset_link}")  # Debug log

        return {"message": "Password reset link sent", "reset_link": reset_link}
    except Exception as e:
        print(f"Error: {e}")  # Debug log
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/reset-password")
async def reset_password(request: ResetPasswordRequest, session: AsyncSession = Depends(async_session)):
    """Handle password reset requests."""
    try:
        # Validate the reset token
        user_id = reset_tokens.get(request.token)
        if not user_id:
            raise HTTPException(status_code=400, detail="Invalid or expired reset token")

        # Find the user by user_id
        result = await session.execute(select(User).where(User.user_id == user_id))
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Update the user's password
        user.password = request.new_password
        session.add(user)
        await session.commit()

        # Remove the used token
        del reset_tokens[request.token]

        return {"message": "Password reset successful"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")