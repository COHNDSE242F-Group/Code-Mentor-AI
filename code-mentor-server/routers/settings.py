from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import async_session
from models import User, Instructor
from auth.auth import verify_token
from passlib.context import CryptContext

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.get("/settings/profile")
async def get_profile(token: dict = Depends(verify_token)):
    """
    Fetch the user's profile information.
    """
    user_id = token["user_id"]
    async with async_session() as session:
        # Fetch the user from the User table
        user = await session.get(User, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # If the user is an instructor, fetch additional details from the Instructor table
        if user.role == "instructor":
            instructor = await session.execute(
                select(Instructor).where(Instructor.instructor_id == user_id)  # Join logic
            )
            instructor = instructor.scalar_one_or_none()
            if not instructor:
                raise HTTPException(status_code=404, detail="Instructor profile not found")
            return {
                "name": instructor.instructor_name,
                "email": instructor.email,
                "role": user.role,
                "contact_no": instructor.contact_no,
                "qualifications": instructor.qualifications,
            }

        # For non-instructor users, return basic profile details
        return {
            "name": user.username,
            "email": None,  # Email is not available for non-instructors
            "role": user.role,
            "bio": None,  # Bio is not available in the User table
        }

@router.put("/settings/profile")
async def update_profile(
    profile_data: dict, token: dict = Depends(verify_token)
):
    """
    Update the user's profile information.
    """
    user_id = token["user_id"]
    async with async_session() as session:
        user = await session.get(User, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        user.username = profile_data.get("name", user.username)
        # Removed bio update since it doesn't exist in the User table
        session.add(user)
        await session.commit()
        return {"message": "Profile updated successfully"}

@router.put("/settings/account")
async def update_account(
    account_data: dict, token: dict = Depends(verify_token)
):
    """
    Update the user's account settings (password).
    """
    user_id = token["user_id"]
    async with async_session() as session:
        user = await session.get(User, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Handle password update securely
        new_password = account_data.get("password")
        if not new_password or len(new_password) < 6:
            raise HTTPException(status_code=400, detail="Password must be at least 6 characters long")
        
        hashed_password = pwd_context.hash(new_password)
        user.password = hashed_password

        session.add(user)
        try:
            await session.commit()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to update account: {str(e)}")

        return {"message": "Account updated successfully"}

@router.get("/settings/integrations")
async def get_integrations(token: dict = Depends(verify_token)):
    """
    Fetch the user's connected integrations.
    """
    # Mocked integrations for now
    try:
        return [
            {"name": "GitHub", "connected": True},
            {"name": "Google", "connected": False},
            {"name": "Slack", "connected": False},
            {"name": "Discord", "connected": True},
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching integrations: {str(e)}")

@router.put("/settings/instructor-profile")
async def update_instructor_profile(
    profile_data: dict, token: dict = Depends(verify_token)
):
    """
    Update the instructor's profile information.
    """
    user_id = token["user_id"]
    async with async_session() as session:
        # Fetch the instructor based on user_id
        instructor = await session.execute(
            select(Instructor).where(Instructor.instructor_id == user_id)
        )
        instructor = instructor.scalar_one_or_none()

        if not instructor:
            raise HTTPException(status_code=404, detail="Instructor not found")

        # Update instructor fields
        instructor.instructor_name = profile_data.get("name", instructor.instructor_name)
        instructor.email = profile_data.get("email", instructor.email)
        instructor.contact_no = profile_data.get("contact_no", instructor.contact_no)
        instructor.qualifications = profile_data.get("qualifications", instructor.qualifications)

        # Update the User table if necessary
        user = await session.get(User, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        user.username = profile_data.get("name", user.username)

        # Commit changes
        session.add(instructor)
        session.add(user)
        await session.commit()

        return {"message": "Instructor profile updated successfully"}