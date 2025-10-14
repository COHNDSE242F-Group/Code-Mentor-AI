from fastapi import APIRouter, HTTPException, Header, Depends, Request
from pydantic import BaseModel
from datetime import datetime
import json
import os
import re
import logging

# Import your authentication function
from auth.auth import verify_token

# ======================
# Setup router and file
# ======================
router = APIRouter()
REPORT_FILE = "keystroke_reports.json"
PASTE_LOG_FILE = "paste_events.json"

# Ensure the report file exists
if not os.path.exists(REPORT_FILE):
    with open(REPORT_FILE, "w") as f:
        json.dump({}, f)

# Configure a simple logger for this module (dev-only)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("routers.key_stroke")


# ======================
# Token validation
# ======================
def get_current_user(request: Request, authorization: str | None = Header(None)):
    """
    Extracts and verifies the Bearer token from the request header.
    Returns the user_id if valid, otherwise raises HTTP 401.
    Logs helpful debug information about why auth failed (missing header,
    wrong prefix, or token decode error).
    """
    client = request.client.host if request.client else "unknown"

    if not authorization:
        logger.warning("/keystroke auth failed: missing Authorization header; client=%s path=%s method=%s",
                       client, request.url.path, request.method)
        raise HTTPException(status_code=401, detail="Unauthorized: missing Authorization header")

    if not authorization.startswith("Bearer "):
        # Log the received header (masked) to help debug formatting issues
        masked = authorization[:10] + "..." if len(authorization) > 10 else authorization
        logger.warning("/keystroke auth failed: Authorization header does not start with 'Bearer '; header=%s client=%s",
                       masked, client)
        raise HTTPException(status_code=401, detail="Unauthorized: malformed Authorization header")

    token = authorization.split(" ", 1)[1]
    try:
        user_id = verify_token(token)
        logger.debug("/keystroke auth success: user_id=%s client=%s path=%s", user_id, client, request.url.path)
        return user_id
    except Exception as exc:
        # Log the exception message for easier debugging in dev
        logger.exception("/keystroke auth failed: token verification error; client=%s error=%s", client, str(exc))
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(exc)}")


# ======================
# Data Models
# ======================
class KeystrokeEvent(BaseModel):
    """
    Represents a keystroke event sent from the frontend.
    action: "typing" or "paste"
    code: the full code in the editor after the change
    """
    action: str
    code: str


# ======================
# File handling helpers
# ======================
def read_reports() -> dict:
    """Reads all keystroke logs from the JSON file."""
    with open(REPORT_FILE, "r") as f:
        return json.load(f)


def write_reports(data: dict):
    """Writes updated keystroke data to the JSON file."""
    with open(REPORT_FILE, "w") as f:
        json.dump(data, f, indent=2)


def append_paste_log(entry: dict):
    try:
        if not os.path.exists(PASTE_LOG_FILE):
            with open(PASTE_LOG_FILE, "w") as f:
                json.dump([], f)

        logs = []
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
# Track the last event per user to avoid cross-user interference
last_events: dict = {}

# Detection thresholds (tuned to match frontend heuristics)
PASTE_MIN_LEN = 10
PASTE_TIME_THRESHOLD_SEC = 0.12  # 120 ms
PASTE_NEWLINE_DIFF = 2

def looks_like_paste(prev_code: str, new_code: str, delta_time: float) -> bool:
    """
    Detects if the user likely pasted content instead of typing.
    Uses heuristics:
      - Big increase in code size
      - Code-like characters suddenly appear
      - Happens too fast (< 0.4s)
      - Several new lines appear suddenly
    """
    delta_len = abs(len(new_code) - len(prev_code))

    # Ignore small edits
    if delta_len < PASTE_MIN_LEN:
        return False

    # If a big code change happened very fast
    if delta_time < PASTE_TIME_THRESHOLD_SEC and delta_len >= PASTE_MIN_LEN:
        added_section = (
            new_code[len(prev_code):] if len(new_code) > len(prev_code) else new_code
        )

        # Detect code-like patterns
        suspicious_patterns = r"[{}\[\]();,'\"=<>+\-\s]{3,}"
        new_lines_diff = new_code.count("\n") - prev_code.count("\n")

        if re.search(suspicious_patterns, added_section) or new_lines_diff >= PASTE_NEWLINE_DIFF:
            return True

    return False


# ======================
# Routes
# ======================

@router.post("/keystroke")
async def track_keystroke(event: KeystrokeEvent, user_id: str = Depends(get_current_user)):
    """
    Receives keystroke data from the frontend.
    Logs typing or paste events for each user and detects backend pastes.
    """

    reports = read_reports()
    now = datetime.utcnow()
    user_key = f"user_{user_id}"

    # Get previous event for this user (default to now/empty)
    user_prev = last_events.get(user_id, {"time": now, "code": ""})
    prev_time = user_prev.get("time", now)
    prev_code = user_prev.get("code", "")
    delta_time = (now - prev_time).total_seconds()

    # Detect paste from backend (double check)
    backend_detected = looks_like_paste(prev_code, event.code, delta_time)

    if backend_detected:
        logger.info("Backend paste detection: user=%s delta_time=%.3fs prev_len=%d new_len=%d", user_id, delta_time, len(prev_code), len(event.code))

    # If backend suspects paste but frontend says typing, override it
    if backend_detected and event.action != "paste":
        event.action = "paste"

    # Save the event log
    reports.setdefault(user_key, []).append({
        "timestamp": now.isoformat(),
        "action": event.action,
        "code_length": len(event.code),
        "delta_time": round(delta_time, 3),
    })

    write_reports(reports)

    # Update last event state for this user
    last_events[user_id] = {"time": now, "code": event.code}
    # If a paste happened (either client-sent or backend-detected), log it to paste_events.json
    if event.action == "paste":
        paste_entry = {
            "timestamp": now.isoformat(),
            "user_id": user_id,
            "source": "server" if backend_detected else "client",
            "delta_time": round(delta_time, 3),
            "code_length": len(event.code),
        }
        append_paste_log(paste_entry)
        logger.info("Returning paste alert to client for user=%s (logged)", user_id)
        return {"alert": "⚠️ Suspicious paste detected!"}
    return {"status": "ok"}


@router.get("/keystroke-report")
async def get_report(user_id: str = Depends(get_current_user)):
    """
    Returns all keystroke activity for the authenticated user.
    """
    reports = read_reports()
    user_key = f"user_{user_id}"
    return reports.get(user_key, [])