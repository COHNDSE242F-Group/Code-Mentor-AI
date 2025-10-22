from fastapi import APIRouter, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel

from database import async_session
from models import User, Admin  # make sure Admin model is imported
from auth import verify_password, create_access_token

router = APIRouter(
    prefix="/login",
    tags=["auth"]
)

# --------------------------
# Pydantic schema
# --------------------------
class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# --------------------------
# Admin Login endpoint
# --------------------------
@router.post("/", response_model=TokenResponse)
async def login_admin(login_data: LoginRequest):
    async with async_session() as session:
        async with session.begin():
            # Fetch user by username
            result = await session.execute(
                select(User).where(User.username == login_data.username)
            )
            user = result.scalar_one_or_none()

            if not user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid username or password"
                )

            # Verify password
            if not verify_password(login_data.password, user.password):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid username or password"
                )

            # Check if user exists in Admin table
            admin_result = await session.execute(
                select(Admin).where(Admin.user_id == user.user_id)
            )
            admin = admin_result.scalar_one_or_none()

            if not admin:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="User is not an admin"
                )

            # Create JWT token with role "admin"
            access_token = create_access_token(
                data={"user_id": user.user_id, "role": "admin"}
            )

            return {"access_token": access_token, "token_type": "bearer"}
