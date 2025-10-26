from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, delete
from database import async_session
from models.batch import Batch
from pydantic import BaseModel
from auth.dependencies import role_required

router = APIRouter(
    prefix="/batch",
    tags=["Batch"]
)

# --------------------------
# Pydantic schemas
# --------------------------
class BatchCreate(BaseModel):
    batch_name: str
    uni_id: int

class BatchUpdate(BaseModel):
    batch_name: str | None = None
    uni_id: int | None = None

class BatchOut(BaseModel):
    batch_id: int
    batch_name: str
    uni_id: int

    class Config:
        orm_mode = True

# --------------------------
# Endpoints
# --------------------------

# Create a new batch - admin only
@router.post("/", response_model=BatchOut, dependencies=[Depends(role_required(["admin"]))])
async def create_batch(batch: BatchCreate):
    async with async_session() as session:
        new_batch = Batch(batch_name=batch.batch_name, uni_id=batch.uni_id)
        session.add(new_batch)
        await session.commit()
        await session.refresh(new_batch)
        return new_batch

# Get all batches - admin and instructor
@router.get("/", response_model=list[BatchOut], dependencies=[Depends(role_required(["admin", "instructor"]))])
async def get_batches():
    async with async_session() as session:
        result = await session.execute(select(Batch))
        batches = result.scalars().all()
        return batches

# Get a batch by ID
@router.get("/{batch_id}", response_model=BatchOut, dependencies=[Depends(role_required(["admin", "instructor"]))])
async def get_batch(batch_id: int):
    async with async_session() as session:
        result = await session.execute(select(Batch).where(Batch.batch_id == batch_id))
        batch = result.scalar_one_or_none()
        if not batch:
            raise HTTPException(status_code=404, detail="Batch not found")
        return batch

# Update a batch - admin only
@router.put("/{batch_id}", response_model=BatchOut, dependencies=[Depends(role_required(["admin"]))])
async def update_batch(batch_id: int, batch_update: BatchUpdate):
    async with async_session() as session:
        result = await session.execute(select(Batch).where(Batch.batch_id == batch_id))
        batch = result.scalar_one_or_none()
        if not batch:
            raise HTTPException(status_code=404, detail="Batch not found")

        if batch_update.batch_name is not None:
            batch.batch_name = batch_update.batch_name
        if batch_update.uni_id is not None:
            batch.uni_id = batch_update.uni_id

        session.add(batch)
        await session.commit()
        await session.refresh(batch)
        return batch

# Delete a batch - admin only
@router.delete("/{batch_id}", dependencies=[Depends(role_required(["admin"]))])
async def delete_batch(batch_id: int):
    async with async_session() as session:
        result = await session.execute(select(Batch).where(Batch.batch_id == batch_id))
        batch = result.scalar_one_or_none()
        if not batch:
            raise HTTPException(status_code=404, detail="Batch not found")

        await session.delete(batch)
        await session.commit()
        return {"detail": "Batch deleted successfully"}