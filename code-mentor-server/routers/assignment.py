from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import async_session
from models.assignment import Assignment
from pydantic import BaseModel
from typing import List, Optional
from datetime import date, time
from auth.dependencies import login_required
from models.student import Student
from models.topic_map import TopicMap
from sqlalchemy.orm import aliased
from auth.dependencies import role_required
from models import Submission

router = APIRouter(
    prefix="/assignment",
    tags=["assignment"]
)

# --------------------------
# Pydantic schemas
# --------------------------
class AssignmentTopic(BaseModel):
    concept_id: int
    topic_id: int

class AssignmentCreate(BaseModel):
    assignment_name: str
    description: Optional[dict] = None
    due_date: date
    due_time: Optional[time] = None
    difficulty: Optional[str] = None
    instructor_id: Optional[int] = None
    batch_id: Optional[int] = None

class AssignmentRequest(BaseModel):
    assignment: AssignmentCreate
    assignment_topics: List[AssignmentTopic]

class AssignmentUpdate(BaseModel):
    assignment_name: Optional[str] = None
    description: Optional[dict] = None
    due_date: Optional[date] = None
    due_time: Optional[time] = None
    difficulty: Optional[str] = None
    instructor_id: Optional[int] = None
    batch_id: Optional[int] = None

class AssignmentOut(BaseModel):
    assignment_id: int
    assignment_name: str
    description: Optional[dict]
    due_date: date
    due_time: Optional[time] = None
    difficulty: Optional[str] = None
    instructor_id: Optional[int]
    batch_id: Optional[int]

    # ✅ Pydantic v2 uses model_config
    model_config = {"from_attributes": True}

class AssignmentAndSubmission(BaseModel):
    Assignment: AssignmentOut
    Submission_id: Optional[int] = None

    model_config = {"from_attributes": True}

# --------------------------
# Endpoints
# --------------------------

# Create a new assignment
@router.post("/", response_model=AssignmentOut)
async def create_assignment(assignmentRequest: AssignmentRequest):
    async with async_session() as session:
        try:
            # Extract the assignment part
            assignment_data = assignmentRequest.assignment.dict()

            # Create the new Assignment row
            new_assignment = Assignment(**assignment_data)
            session.add(new_assignment)
            await session.flush()  # Get assignment_id before commit

            # 2️⃣ Build the topic map structure
            topic_map_dict = {}
            for topic in assignmentRequest.assignment_topics:
                # Convert IDs to strings for consistent JSON keys
                key = str(topic.concept_id)
                topic_map_dict.setdefault(key, []).append(str(topic.topic_id))

            # 3️⃣ Save to TopicMap table
            topic_map_entry = TopicMap(
                assignment_id=new_assignment.assignment_id,
                content=topic_map_dict
            )
            session.add(topic_map_entry)

            await session.commit()
            await session.refresh(new_assignment)

            return new_assignment

        except Exception as e:
            await session.rollback()
            raise HTTPException(status_code=500, detail=f"Failed to create assignment: {str(e)}")

# Get assignment by ID
@router.get("/{assignment_id}", response_model=AssignmentOut)
async def get_assignment(
    assignment_id: int,
    token_data: dict = Depends(login_required),  # token_data contains user_id and role
):
    user_id = token_data["user_id"]
    
    # fetch assignment for user (log omitted for cleanliness)

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