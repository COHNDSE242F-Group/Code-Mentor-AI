from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from datetime import datetime
import json
import os
import re
import logging
from auth.auth import verify_token

# Import auth dependency
from auth.dependencies import login_required  # replaces get_current_user

# ======================
# Setup router and file
# ======================
router = APIRouter()
REPORT_FILE = "keystroke_reports.json"
PASTE_LOG_FILE = "paste_events.json"

user_code_cache = {}

# Ensure the report file exists
if not os.path.exists(REPORT_FILE):
    with open(REPORT_FILE, "w") as f:
        json.dump({}, f)

# Logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("routers.key_stroke")

# ======================
# Data Models
# ======================
class KeystrokeEvent(BaseModel):
    action: str  # "typing" or "paste"
    code: str
    language: str

# ======================
# File handling helpers
# ======================
def read_reports() -> dict:
    with open(REPORT_FILE, "r") as f:
        return json.load(f)

def write_reports(data: dict):
    with open(REPORT_FILE, "w") as f:
        json.dump(data, f, indent=2)

def append_paste_log(entry: dict):
    try:
        if not os.path.exists(PASTE_LOG_FILE):
            with open(PASTE_LOG_FILE, "w") as f:
                json.dump([], f)
        with open(PASTE_LOG_FILE, "r") as f:
            logs = json.load(f)
        logs.append(entry)
        with open(PASTE_LOG_FILE, "w") as f:
            json.dump(logs, f, indent=2)
    except Exception:
        logger.exception("Failed to append to paste log")

# ======================
# Backend Paste Detection Logic
# ======================
last_events: dict = {}
PASTE_MIN_LEN = 10
PASTE_TIME_THRESHOLD_SEC = 0.12
PASTE_NEWLINE_DIFF = 2

def looks_like_paste(prev_code: str, new_code: str, delta_time: float) -> bool:
    delta_len = abs(len(new_code) - len(prev_code))
    if delta_len < PASTE_MIN_LEN:
        return False
    if delta_time < PASTE_TIME_THRESHOLD_SEC and delta_len >= PASTE_MIN_LEN:
        added_section = new_code[len(prev_code):] if len(new_code) > len(prev_code) else new_code
        suspicious_patterns = r"[{}\[\]();,'\"=<>+\-\s]{3,}"
        new_lines_diff = new_code.count("\n") - prev_code.count("\n")
        if re.search(suspicious_patterns, added_section) or new_lines_diff >= PASTE_NEWLINE_DIFF:
            return True
    return False

def get_newly_added_text(old_code: str, new_code: str) -> str:
    """
    Returns the text that was added to new_code compared to old_code.
    """
    start = 0
    while start < len(old_code) and start < len(new_code) and old_code[start] == new_code[start]:
        start += 1

    end_old = len(old_code) - 1
    end_new = len(new_code) - 1

    while end_old >= start and end_new >= start and old_code[end_old] == new_code[end_new]:
        end_old -= 1
        end_new -= 1

    return new_code[start:end_new+1]


def detect_paste_heuristically(old_code: str, new_code: str) -> bool:
    """
    Detects whether the change from old_code to new_code looks like a paste action.
    """
    print("Heuristic paste detection running...")
    newly_added_code = get_newly_added_text(old_code, new_code)
    print(f"Newly added code: {newly_added_code!r}")

    if len(newly_added_code) < 10:
        print("Heuristic paste detection result: False (too small to be a paste)")
        return False

    # Detect structural paste (brackets, quotes, spaces, symbols)
    structured_pattern = r'.*[A-Za-z0-9]*[,\ /<"\s].*'
    looks_structured = bool(re.match(structured_pattern, newly_added_code))
    
    print("Heuristic paste detection result:", looks_structured)
    return looks_structured

# ======================
# Routes
# ======================
@router.post("/keystroke")
async def track_keystroke(event: KeystrokeEvent, token_data: dict = Depends(login_required)):
    """
    Receives keystroke data from the frontend.
    Detects backend pastes and logs them.
    """
    user_id = token_data["user_id"]
    reports = read_reports()
    now = datetime.utcnow()
    user_key = f"user_{user_id}"

    if user_id not in user_code_cache:
        if event.language == "javascript":
            user_code_cache[user_id] = {"code": "// Write your solution here\nconsole.log('Hello, world!');", "paste": False}
        elif event.language == "python":
            user_code_cache[user_id] = {"code": "# Write your solution here\nprint('Hello, world!')", "paste": False}
    
    if event.action == "paste":
        user_code_cache[user_id]["code"] = event.code
        user_code_cache[user_id]["paste"] = True
    else:
        isPaste = detect_paste_heuristically(user_code_cache[user_id]["code"], event.code)
        user_code_cache[user_id]["code"] = event.code

        if isPaste:
            print("Paste detected")
            user_code_cache[user_id]["code"] = event.code
            user_code_cache[user_id]["paste"] = True
    
    return {"status": "ok"}

@router.get("/keystroke/report")
async def get_report(token_data: dict = Depends(login_required)):
    """
    Returns the current code and paste status for the authenticated user.
    """
    user_id = token_data["user_id"]

    # Get current code cache for the user
    current_code = user_code_cache.get(user_id, {"code": "", "paste": False})

    return current_code

@router.post("/keystroke/clear")
async def clear_user_keystroke(request: Request):
    """
    Clears user keystroke data when the user exits or the tab closes.
    Compatible with navigator.sendBeacon.
    """
    try:
        data = await request.json()
        token = data.get("token")
        if not token:
            raise HTTPException(status_code=400, detail="Token missing in request body")

        payload = verify_token(token)  # manually decode JWT
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=400, detail="Invalid token")

        if user_id in user_code_cache:
            del user_code_cache[user_id]
        return {"message": f"Cleared keystrokes for user {user_id}"}

    except Exception as e:
        import logging
        logging.error(f"❌ Failed to clear keystrokes on unload: {e}")
        raise HTTPException(status_code=400, detail="Failed to clear keystrokes on unload")