from fastapi import APIRouter
from pydantic import BaseModel
import subprocess
import tempfile
import os

router = APIRouter()

class SubmissionReport(BaseModel):
    problem_id: str
    language: str
    code: str
    activity_log: List[Dict[str, Any]]

@app.post("/submit")
async def receive_submission(report: SubmissionReport):
    # Store report or flag suspicious submissions
    print("Received submission for:", report.problem_id)
    print("Suspicious Events:", [
        log for log in report.activity_log if log['type'] != 'typing'
    ])
    return {"status": "received", "logs": len(report.activity_log)}