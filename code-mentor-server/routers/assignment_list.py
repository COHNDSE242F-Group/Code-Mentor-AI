from fastapi import APIRouter, HTTPException
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from database import async_session
from models.assignment import Assignment
from models.batch import Batch
import traceback
from datetime import date as _date

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
                # if assignment has no batch (targeted to all students), show 'All Students'
                if getattr(a, 'batch', None) and getattr(a.batch, 'batch_name', None):
                    batch_name = a.batch.batch_name
                else:
                    batch_name = "All Students"
                # description is JSON; try to flatten some fields
                description = getattr(a, 'description', {}) or {}
                # compute status from due_date if not explicitly stored
                due = getattr(a, 'due_date', None)
                if not due:
                    status = 'Draft'
                else:
                    today = _date.today()
                    if due < today:
                        status = 'Closed'
                    elif due == today:
                        status = 'Active'
                    else:
                        status = 'Scheduled'

                assignments.append({
                    "id": a.assignment_id,
                    "title": a.assignment_name,
                    "language": description.get('language'),
                    "difficulty": description.get('difficulty'),
                    "dueDate": str(a.due_date) if getattr(a, 'due_date', None) else None,
                    "batch": batch_name,
                    "status": status
                })
            return {"assignments": assignments}
    except Exception as e:
        # print stack trace to server logs for debugging
        traceback.print_exc()
        # return readable error to client for local debugging
        raise HTTPException(status_code=500, detail=str(e))
