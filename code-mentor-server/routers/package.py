from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import async_session
from models.plan import Plan
from models.subscription import Subscription

router = APIRouter(
    prefix="/packages",
    tags=["packages"]
)


class PlanOut(BaseModel):
    plan_key: str
    name: str
    description: str | None
    monthly_price: int
    yearly_price: int
    instructors: str | None
    students: str | None
    storage: str | None


class SubscribeIn(BaseModel):
    uni_id: int
    plan_key: str
    billing_cycle: str  # 'monthly' | 'yearly'


@router.get("/", response_model=List[PlanOut])
async def list_plans():
    async with async_session() as session:
        result = await session.execute(select(Plan))
        plans = result.scalars().all()
        return [PlanOut(
            plan_key=p.plan_key,
            name=p.name,
            description=p.description,
            monthly_price=p.monthly_price,
            yearly_price=p.yearly_price,
            instructors=p.instructors,
            students=p.students,
            storage=p.storage
        ) for p in plans]


@router.post("/subscribe")
async def subscribe(payload: SubscribeIn):
    async with async_session() as session:
        # Basic validation: does plan exist?
        result = await session.execute(select(Plan).where(Plan.plan_key == payload.plan_key))
        plan = result.scalar_one_or_none()
        if not plan:
            raise HTTPException(status_code=404, detail="Plan not found")

        sub = Subscription(
            uni_id=payload.uni_id,
            plan_key=payload.plan_key,
            billing_cycle=payload.billing_cycle,
            status='active'
        )
        session.add(sub)
        try:
            await session.commit()
            await session.refresh(sub)
        except Exception as e:
            await session.rollback()
            raise HTTPException(status_code=500, detail=str(e))

        return {"subscription_id": sub.subscription_id, "status": sub.status}
