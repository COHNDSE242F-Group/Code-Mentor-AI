from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from database import async_session
from models import ProgressReport
import json
from auth.dependencies import role_required

router = APIRouter(prefix="/progress", tags=["Progress"])

@router.get("/")
async def get_progress(
    token_data: dict = Depends(role_required(["student"]))
):
    student_id = token_data["user_id"]
    
    async with async_session() as session:
        result = await session.execute(
            select(ProgressReport).where(ProgressReport.student_id == student_id)
        )
        report = result.scalar_one_or_none()
        if not report:
            raise HTTPException(status_code=404, detail="Progress report not found")

        content = report.content or {}
        concepts = content.get("concepts", [])
        strengths = content.get("strengths", [])
        improvements = content.get("improvements", [])

        # Build performance data for chart
        performance = []
        for c in concepts:
            name = c["name"]
            topic_count = c.get("topic_count", 0)
            completed = c.get("completed_count", 0)
            score = round((completed / topic_count) * 100, 2) if topic_count else 0
            performance.append({"name": name, "score": score, "avg": 70})  # avg = dummy data

        # Mock progress over time (optional)
        progress_over_time = [
            {"week": f"Week {i+1}", "score": min(100, 50 + i * 5)} for i in range(6)
        ]

        # Needs practice and mastered based on strengths/improvements
        needs_practice = [{"id": i, "name": imp, "score": 40} for i, imp in enumerate(improvements)]
        mastered = [{"id": i, "name": s, "score": 90} for i, s in enumerate(strengths)]
        
        # New concepts are those with low completion
        new_concepts = [
            {"id": c["id"], "name": c["name"], "difficulty": "Medium"}
            for c in concepts if c.get("completed_count", 0) < 2
        ]

        return {
            "performance": performance,
            "progress_over_time": progress_over_time,
            "needs_practice": needs_practice,
            "mastered": mastered,
            "new_concepts": new_concepts
        }