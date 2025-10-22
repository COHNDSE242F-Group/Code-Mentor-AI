from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import async_session
from models.assignment import Assignment
from pydantic import BaseModel
from typing import List, Optional
from datetime import date
from auth.dependencies import login_required
from models.student import Student

router = APIRouter(
    prefix="/assignment",
    tags=["assignment"]
)

# --------------------------
# Pydantic schemas
# --------------------------
class AssignmentCreate(BaseModel):
    assignment_name: str
    description: Optional[dict] = None
    due_date: date
    instructor_id: Optional[int] = None
    batch_id: Optional[int] = None

class AssignmentUpdate(BaseModel):
    assignment_name: Optional[str] = None
    description: Optional[dict] = None
    due_date: Optional[date] = None
    instructor_id: Optional[int] = None
    batch_id: Optional[int] = None

class AssignmentOut(BaseModel):
    assignment_id: int
    assignment_name: str
    description: Optional[dict]
    due_date: date
    instructor_id: Optional[int]
    batch_id: Optional[int]

    class Config:
        orm_mode = True

# --------------------------
# Endpoints
# --------------------------

# Create a new assignment
@router.post("/", response_model=AssignmentOut)
async def create_assignment(assignment: AssignmentCreate):
    async with async_session() as session:
        new_assignment = Assignment(**assignment.dict())
        session.add(new_assignment)
        await session.commit()
        await session.refresh(new_assignment)
        return new_assignment

# Get all assignments
@router.get("/", response_model=List[AssignmentOut])
async def get_assignments():
    async with async_session() as session:
        result = await session.execute(select(Assignment))
        assignments = result.scalars().all()
        return assignments

# Get assignment by ID
@router.get("/{assignment_id}", response_model=AssignmentOut)
async def get_assignment(
    assignment_id: int,
    token_data: dict = Depends(login_required),  # token_data contains user_id and role
):
    user_id = token_data["user_id"]
    
    print(f"Fetching assignment {assignment_id} for user {user_id}")

    async with async_session() as session:
        # Fetch the student
        result = await session.execute(select(Student).where(Student.student_id == user_id))
        student = result.scalar_one_or_none()
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")

        # Fetch the assignment
        result = await session.execute(select(Assignment).where(Assignment.assignment_id == assignment_id))
        assignment = result.scalar_one_or_none()
        if not assignment:
            raise HTTPException(status_code=404, detail="Assignment not found")

        # Check if the student's batch matches the assignment's batch
        if assignment.batch_id is not None and student.batch_id != assignment.batch_id:
            raise HTTPException(
                status_code=403,
                detail="Access forbidden: you are not enrolled in this assignment's batch"
            )

        return assignment

# Get assignments by batch_id
@router.get("/batch/{batch_id}", response_model=List[AssignmentOut])
async def get_assignments_by_batch(batch_id: int):
    async with async_session() as session:
        result = await session.execute(select(Assignment).where(Assignment.batch_id == batch_id))
        assignments = result.scalars().all()
        return assignments

# Get assignments by instructor_id
@router.get("/instructor/{instructor_id}", response_model=List[AssignmentOut])
async def get_assignments_by_instructor(instructor_id: int):
    async with async_session() as session:
        result = await session.execute(select(Assignment).where(Assignment.instructor_id == instructor_id))
        assignments = result.scalars().all()
        return assignments

# Update an assignment
@router.put("/{assignment_id}", response_model=AssignmentOut)
async def update_assignment(assignment_id: int, assignment_update: AssignmentUpdate):
    async with async_session() as session:
        result = await session.execute(select(Assignment).where(Assignment.assignment_id == assignment_id))
        assignment = result.scalar_one_or_none()
        if not assignment:
            raise HTTPException(status_code=404, detail="Assignment not found")

        for field, value in assignment_update.dict(exclude_unset=True).items():
            setattr(assignment, field, value)

        session.add(assignment)
        await session.commit()
        await session.refresh(assignment)
        return assignment

# Delete an assignment
@router.delete("/{assignment_id}")
async def delete_assignment(assignment_id: int):
    async with async_session() as session:
        result = await session.execute(select(Assignment).where(Assignment.assignment_id == assignment_id))
        assignment = result.scalar_one_or_none()
        if not assignment:
            raise HTTPException(status_code=404, detail="Assignment not found")

        await session.delete(assignment)
        await session.commit()
        return {"detail": "Assignment deleted successfully"}