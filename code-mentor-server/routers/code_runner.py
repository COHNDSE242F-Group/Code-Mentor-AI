from fastapi import APIRouter
from pydantic import BaseModel
import subprocess
import tempfile
import os

router = APIRouter()

class CodeRequest(BaseModel):
    language: str
    code: str
    stdin: str = ""

@router.post("/run")
async def run_code(req: CodeRequest):
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