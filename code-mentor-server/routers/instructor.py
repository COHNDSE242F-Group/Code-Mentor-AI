from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.future import select
from database import async_session
from models.user import User
from models.instructor import Instructor
from pydantic import BaseModel
from typing import List, Optional
from models.admin import Admin
from auth.dependencies import role_required

router = APIRouter(
    prefix="/instructor",
    tags=["instructor"]
)


# Pydantic schemas
class InstructorCreate(BaseModel):
    username: str
    password: str
    instructor_name: str
    email: str
    contact_no: Optional[str] = None
    index_no: Optional[str] = None


class InstructorUpdate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    instructor_name: Optional[str] = None
    email: Optional[str] = None
    contact_no: Optional[str] = None
    index_no: Optional[str] = None
    uni_id: Optional[int] = None


class InstructorOut(BaseModel):
    instructor_id: int
    username: str
    instructor_name: str
    email: str

    class Config:
        orm_mode = True


# Create instructor (and user) — admin only
@router.post("/", response_model=InstructorOut)
async def create_instructor(instructor_data: InstructorCreate, token_data: dict = Depends(role_required(["admin"]))):
    admin_user_id = token_data.get("user_id")
    async with async_session() as session:
        result = await session.execute(select(Admin).where(Admin.admin_id == admin_user_id))
        admin = result.scalar_one_or_none()
        if not admin:
            raise HTTPException(status_code=404, detail="Admin not found")
        uni_id = admin.uni_id
        try:
            new_user = User(username=instructor_data.username, password=instructor_data.password, role="instructor")
            session.add(new_user)
            await session.flush()

            new_instructor = Instructor(
                instructor_id=new_user.user_id,
                instructor_name=instructor_data.instructor_name,
                email=instructor_data.email,
                contact_no=instructor_data.contact_no,
                index_no=instructor_data.index_no,
                uni_id=uni_id
            )
            session.add(new_instructor)
            await session.commit()
            await session.refresh(new_instructor)
        except Exception as e:
            await session.rollback()
            raise HTTPException(status_code=500, detail=str(e))
        return InstructorOut(
            instructor_id=new_instructor.instructor_id,
            username=new_user.username,
            instructor_name=new_instructor.instructor_name,
            email=new_instructor.email
        )


# Get all instructors
@router.get("/", response_model=List[InstructorOut])
async def get_instructors():
    async with async_session() as session:
        result = await session.execute(select(Instructor, User).join(User, User.user_id == Instructor.instructor_id))
        instructors = [
            InstructorOut(
                instructor_id=i.instructor_id,
                username=u.username,
                instructor_name=i.instructor_name,
                email=i.email
            )
            for i, u in result.all()
        ]
        return instructors


# Get single instructor
@router.get("/{instructor_id}", response_model=InstructorOut)
async def get_instructor(instructor_id: int):
    async with async_session() as session:
        result = await session.execute(
            select(Instructor, User)
            .join(User, User.user_id == Instructor.instructor_id)
            .where(Instructor.instructor_id == instructor_id)
        )
        row = result.first()
        if not row:
            raise HTTPException(status_code=404, detail="Instructor not found")
        ins, user = row
        return InstructorOut(
            instructor_id=ins.instructor_id,
            username=user.username,
            instructor_name=ins.instructor_name,
            email=ins.email
        )


# Update instructor and user
@router.put("/{instructor_id}", response_model=InstructorOut)
async def update_instructor(instructor_id: int, ins_update: InstructorUpdate):
    async with async_session() as session:
        async with session.begin():
            result = await session.execute(
                select(Instructor, User)
                .join(User, User.user_id == Instructor.instructor_id)
                .where(Instructor.instructor_id == instructor_id)
            )
            row = result.first()
            if not row:
                raise HTTPException(status_code=404, detail="Instructor not found")
            ins, user = row

            if ins_update.username is not None:
                user.username = ins_update.username
            if ins_update.password is not None:
                user.password = ins_update.password
            session.add(user)

            for field in ["instructor_name", "email", "contact_no", "index_no", "uni_id"]:
                value = getattr(ins_update, field)
                if value is not None:
                    setattr(ins, field, value)
            session.add(ins)

        await session.refresh(ins)
        return InstructorOut(
            instructor_id=ins.instructor_id,
            username=user.username,
            instructor_name=ins.instructor_name,
            email=ins.email
        )


# Delete instructor and user
@router.delete("/{instructor_id}")
async def delete_instructor(instructor_id: int):
    async with async_session() as session:
        async with session.begin():
            result = await session.execute(
                select(Instructor, User)
                .join(User, User.user_id == Instructor.instructor_id)
                .where(Instructor.instructor_id == instructor_id)
            )
            row = result.first()
            if not row:
                raise HTTPException(status_code=404, detail="Instructor not found")
            ins, user = row
            await session.delete(ins)
            await session.delete(user)
        return {"detail": "Instructor and User deleted successfully"}
