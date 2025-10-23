from fastapi import APIRouter, HTTPException,Depends
from pydantic import BaseModel
from datetime import datetime, timedelta
from jose import jwt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import async_session
from models import User

SECRET_KEY = "YOUR_SECRET_KEY"
ALGORITHM = "HS256"
RESET_TOKEN_EXPIRE_MINUTES = 30

router = APIRouter()

class ForgotPasswordRequest(BaseModel):
    email: str

@router.post("/forgot-password")
async def forgot_password(request: ForgotPasswordRequest, session: AsyncSession = Depends(async_session)):
    # Check if the user exists in the database
    result = await session.execute(select(User).where(User.email == request.email))
    user = result.scalar()
    if not user:
        return {"message": "Password reset link generated if user exists."}

    # Generate a reset token
    reset_token = jwt.encode(
        {"email": request.email, "exp": datetime.utcnow() + timedelta(minutes=RESET_TOKEN_EXPIRE_MINUTES)},
        SECRET_KEY,
        algorithm=ALGORITHM,
    )

    # Return the reset link directly for testing purposes
    reset_link = f"http://localhost:3000/reset-password?token={reset_token}"
    return {"message": "Password reset link generated successfully.", "reset_link": reset_link}