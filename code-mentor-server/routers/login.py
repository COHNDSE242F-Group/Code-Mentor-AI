from fastapi import APIRouter, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel

from database import async_session
from models import User
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
# Login endpoint
# --------------------------
@router.post("/", response_model=TokenResponse)
async def login_user(login_data: LoginRequest):
    # Always create a new session per request
    async with async_session() as session:
        # Use transaction context to ensure connection stays alive
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

            # Create JWT token with user_id and role (default 'user')
            access_token = create_access_token(
                data={"user_id": user.user_id, "role": getattr(user, "role", "user")}
            )

            return {"access_token": access_token, "token_type": "bearer"}