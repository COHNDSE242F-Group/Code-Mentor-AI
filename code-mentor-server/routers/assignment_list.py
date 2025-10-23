from fastapi import APIRouter, HTTPException
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from database import async_session
from models.assignment import Assignment
from models.batch import Batch
import traceback

router = APIRouter(prefix="/assignment")


@router.get("/list")
async def get_assignments():
    try:
        async with async_session() as session:
            # eager-load related batch and instructor to avoid lazy-loading in async context
            stmt = select(Assignment).options(selectinload(Assignment.batch), selectinload(Assignment.instructor))
            result = await session.execute(stmt)
            assignments = []
            for a in result.scalars().all():
                batch_name = None
                if getattr(a, 'batch', None):
                    batch_name = a.batch.batch_name
                # description is JSON; try to flatten some fields
                description = getattr(a, 'description', {}) or {}
                assignments.append({
                    "id": a.assignment_id,
                    "title": a.assignment_name,
                    "language": description.get('language'),
                    "difficulty": description.get('difficulty'),
                    "dueDate": str(a.due_date),
                    "batch": batch_name,
                    "status": "Active"
                })
            return {"assignments": assignments}
    except Exception as e:
        # print stack trace to server logs for debugging
        traceback.print_exc()
        # return readable error to client for local debugging
        raise HTTPException(status_code=500, detail=str(e))
