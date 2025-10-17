from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter()

# Mock batch/group options
MOCK_BATCHES = ["All Students", "Batch A", "Batch B", "Batch C", "Custom Group"]

@router.get("/assignment/options")
def get_assignment_options():
    return {"batches": MOCK_BATCHES}

@router.post("/assignment/create")
def create_assignment(assignment: Dict[str, Any]):
    # For now, just echo back the posted assignment
    return assignment


