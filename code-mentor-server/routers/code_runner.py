from fastapi import APIRouter, Header, HTTPException, Depends, Request
from auth.auth import verify_token
import logging
from pydantic import BaseModel
import subprocess, tempfile, os

router = APIRouter()

# Simple logger for this router (dev-only)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("routers.code_runner")

class CodeRequest(BaseModel):
    language: str
    code: str
    stdin: str = ""

# Dummy function for token validation
def get_current_user(request: Request, authorization: str | None = Header(None)):
    client = request.client.host if request.client else "unknown"
    if authorization is None:
        logger.warning("/run auth failed: missing Authorization header; client=%s path=%s", client, request.url.path)
        raise HTTPException(status_code=401, detail="Unauthorized: missing Authorization header")

    if not authorization.startswith("Bearer "):
        masked = authorization[:10] + "..." if len(authorization) > 10 else authorization
        logger.warning("/run auth failed: malformed Authorization header=%s client=%s", masked, client)
        raise HTTPException(status_code=401, detail="Unauthorized: malformed Authorization header")

    token = authorization.split(" ", 1)[1]
    try:
        user_id = verify_token(token)
        logger.debug("/run auth success: user_id=%s client=%s path=%s", user_id, client, request.url.path)
        return user_id
    except Exception as exc:
        logger.exception("/run auth failed: token verification error; client=%s error=%s", client, str(exc))
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(exc)}")

@router.post("/run")
async def run_code(req: CodeRequest, token: str = Depends(get_current_user)):
    # token is validated here
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