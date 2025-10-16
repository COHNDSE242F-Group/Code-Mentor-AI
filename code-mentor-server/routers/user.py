from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, delete
from database import async_session
from models import User
from pydantic import BaseModel

router = APIRouter(
    prefix="/user",
    tags=["user"]
)

# --------------------------
# Pydantic schemas
# --------------------------
class UserCreate(BaseModel):
    username: str
    password: str

class UserUpdate(BaseModel):
    username: str | None = None
    password: str | None = None

class UserOut(BaseModel):
    user_id: int
    username: str

    class Config:
        orm_mode = True

# --------------------------
# Endpoints
# --------------------------

# Create a new user
@router.post("/", response_model=UserOut)
async def create_user(user: UserCreate):
    async with async_session() as session:
        new_user = User(username=user.username, password=user.password)
        session.add(new_user)
        await session.commit()
        await session.refresh(new_user)
        return new_user

# Get all users
@router.get("/", response_model=list[UserOut])
async def get_users():
    async with async_session() as session:
        result = await session.execute(select(User))
        users = result.scalars().all()
        return users

# Get a single user by ID
@router.get("/{user_id}", response_model=UserOut)
async def get_user(user_id: int):
    async with async_session() as session:
        result = await session.execute(select(User).where(User.user_id == user_id))
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user

# Update a user
@router.put("/{user_id}", response_model=UserOut)
async def update_user(user_id: int, user_update: UserUpdate):
    async with async_session() as session:
        result = await session.execute(select(User).where(User.user_id == user_id))
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        if user_update.username is not None:
            user.username = user_update.username
        if user_update.password is not None:
            user.password = user_update.password

        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user

# Delete a user
@router.delete("/{user_id}")
async def delete_user(user_id: int):
    async with async_session() as session:
        result = await session.execute(select(User).where(User.user_id == user_id))
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        await session.delete(user)
        await session.commit()
        return {"detail": "User deleted successfully"}