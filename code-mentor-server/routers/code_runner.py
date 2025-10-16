from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import subprocess, tempfile, os
import logging

# Import your dependencies
from auth.dependencies import role_required

router = APIRouter()

# Simple logger for this router (dev-only)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("routers.code_runner")


class CodeRequest(BaseModel):
    language: str
    code: str
    stdin: str = ""


@router.post("/run")
async def run_code(
    req: CodeRequest,
    token_data: dict = Depends(role_required(["admin", "instructor", "student"]))  # Enforces role
):
    """
    Execute Python or JavaScript code.
    Only accessible by users with roles: admin, instructor, student.
    """
    user_id = token_data.get("user_id")
    user_role = token_data.get("role")

    # Log which user is running the code
    logger.info("Code execution requested by user_id=%s role=%s language=%s", user_id, user_role, req.language)

    # Create a temporary file for the code
    with tempfile.NamedTemporaryFile(delete=False, suffix=f".{req.language}") as f:
        f.write(req.code.encode())
        file_path = f.name

    result = {"stdout": "", "stderr": ""}

    try:
        if req.language == "python":
            proc = subprocess.run(
                ["python", file_path],
                input=req.stdin.encode(),
                capture_output=True,
                timeout=5
            )
        elif req.language == "javascript":
            proc = subprocess.run(
                ["node", file_path],
                input=req.stdin.encode(),
                capture_output=True,
                timeout=5
            )
        else:
            result["stderr"] = "Language not supported"
            return result

        result["stdout"] = proc.stdout.decode()
        result["stderr"] = proc.stderr.decode()
    except subprocess.TimeoutExpired:
        result["stderr"] = "Execution timed out"
    finally:
        os.remove(file_path)

    return result