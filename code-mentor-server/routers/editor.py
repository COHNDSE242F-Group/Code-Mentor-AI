# routers/editor.py
from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
import os
import json
from pathlib import Path
import hashlib
import re
import logging

router = APIRouter()

LOG_DIR = Path("logs")
LOG_DIR.mkdir(exist_ok=True)

# Paste events log (kept small, append-only)
PASTE_LOG_FILE = Path("paste_events.json")

# Configure logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("routers.editor")

# -------------------------
# Pydantic models
# -------------------------
class KeystrokeEvent(BaseModel):
    sessionId: str
    type: str                     # "keystroke" | "paste" | other
    details: Dict[str, Any]
    clientTime: str               # ISO timestamp from client

class KeystrokeBatch(BaseModel):
    sessionId: str
    events: List[KeystrokeEvent]


# -------------------------
# Helpers
# -------------------------
def _session_log_path(session_id: str) -> Path:
    return LOG_DIR / f"{session_id}.jsonl"

def _append_events_to_file(session_id: str, events: List[Dict[str, Any]]) -> None:
    path = _session_log_path(session_id)
    with path.open("a", encoding="utf-8") as f:
        for ev in events:
            f.write(json.dumps(ev, ensure_ascii=False) + "\n")

def _load_events_from_file(session_id: str) -> List[Dict[str, Any]]:
    path = _session_log_path(session_id)
    if not path.exists():
        return []
    out = []
    with path.open("r", encoding="utf-8") as f:
        for line in f:
            try:
                out.append(json.loads(line))
            except Exception:
                continue
    return out

def _validate_event_order(events: List[KeystrokeEvent]) -> bool:
    # Basic validation: clientTime must be parseable and not wildly out of order
    last_ts: Optional[datetime] = None
    for ev in events:
        try:
            # accept with or without timezone; fromisoformat handles both
            ts = datetime.fromisoformat(ev.clientTime)
        except Exception:
            return False
        if last_ts and ts < last_ts:
            # out-of-order timestamps -> suspicious
            return False
        last_ts = ts
    return True

def _create_event_record(ev: KeystrokeEvent) -> Dict[str, Any]:
    # Create canonical saved record (no raw pasted text)
    record = {
        "sessionId": ev.sessionId,
        "type": ev.type,
        "details": ev.details,
        "clientTime": ev.clientTime,
        "receivedAt": datetime.now(tz=timezone.utc).isoformat(),
    }
    return record


# -------------------------
# Optional: small integrity helper (SHA-256)
# -------------------------
def compute_text_hash(text: str) -> str:
    # SHA-256 hex digest (used by client for paste fingerprint)
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


# -------------------------
# Server memory: last event per session (in-memory cache)
# -------------------------
# This is intentionally ephemeral (in-memory). For scaling, persist in DB or cache store.
last_events: Dict[str, Dict[str, Any]] = {}


# -------------------------
# Paste detection thresholds (tunable)
# -------------------------
PASTE_MIN_LEN = 10                 # minimal added length to consider
PASTE_TIME_THRESHOLD_SEC = 0.12    # 120 ms (fast)
PASTE_NEWLINE_DIFF = 2             # multiple new lines threshold
STRUCTURED_PATTERN = re.compile(r"[{}\[\]();,'\"=<>+\-\s]{3,}")


def append_paste_log(entry: dict):
    try:
        if not PASTE_LOG_FILE.exists():
            with open(PASTE_LOG_FILE, "w", encoding="utf-8") as f:
                json.dump([], f)
        with open(PASTE_LOG_FILE, "r", encoding="utf-8") as f:
            logs = json.load(f)
    except Exception:
        logs = []

    logs.append(entry)

    try:
        with open(PASTE_LOG_FILE, "w", encoding="utf-8") as f:
            json.dump(logs, f, indent=2)
    except Exception:
        logger.exception("Failed to write paste log")


# -------------------------
# Server-side paste heuristic
# -------------------------
def looks_like_paste(prev_code: str, new_code: str, delta_time: float) -> bool:
    """
    Detects if the user likely pasted content instead of typing.
    Heuristics:
      - delta length >= PASTE_MIN_LEN
      - operation happened very fast (delta_time < threshold)
      - added section contains structured code characters OR multiple newlines
    """
    delta_len = abs(len(new_code) - len(prev_code))
    if delta_len < PASTE_MIN_LEN:
        return False

    # Only consider fast events as possible paste
    if delta_time < PASTE_TIME_THRESHOLD_SEC and delta_len >= PASTE_MIN_LEN:
        # compute added portion in a robust way:
        # if prev_code is prefix of new_code, use suffix; otherwise just use new_code
        added_section = new_code[len(prev_code):] if new_code.startswith(prev_code) else new_code

        new_lines_diff = new_code.count("\n") - prev_code.count("\n")

        if STRUCTURED_PATTERN.search(added_section) or new_lines_diff >= PASTE_NEWLINE_DIFF:
            return True
    return False


# -------------------------
# Main endpoint - receive batched events
# -------------------------
@router.post("/log")
async def receive_event_batch(batch: KeystrokeBatch, request: Request):
    """
    Accepts a batch of keystroke/paste events for a session.
    Client should not send raw pasted text — only metadata such as textLength and textHash.
    """
    # Basic validation
    if not batch.events or batch.sessionId.strip() == "":
        raise HTTPException(status_code=400, detail="Empty batch or missing sessionId")

    # All events must belong to same session
    for ev in batch.events:
        if ev.sessionId != batch.sessionId:
            raise HTTPException(status_code=400, detail="Mismatched sessionId in events")

    # Validate order/timestamps
    valid_order = _validate_event_order(batch.events)
    saved_events = []

    now = datetime.now(tz=timezone.utc)

    if not valid_order:
        # store events but mark them suspicious
        for ev in batch.events:
            rec = _create_event_record(ev)
            rec["_validation"] = "out_of_order_or_bad_timestamp"
            saved_events.append(rec)
        _append_events_to_file(batch.sessionId, saved_events)
        return {"status": "partial", "message": "Events saved but timestamp validation failed."}

    # Process events and run server-side paste checks using last_events memory
    session_prev = last_events.get(batch.sessionId, {"time": now, "code": ""})
    prev_time = session_prev.get("time", now)
    prev_code = session_prev.get("code", "")
    # Use client's last timestamp if exist to compute delta_time more accurately
    try:
        prev_ts = prev_time if isinstance(prev_time, datetime) else now
    except Exception:
        prev_ts = now

    for ev in batch.events:
        rec = _create_event_record(ev)

        # basic server-side paste check for paste events and even for large keystroke events
        try:
            ev_client_ts = datetime.fromisoformat(ev.clientTime)
        except Exception:
            ev_client_ts = now
        delta_time = (ev_client_ts - prev_ts).total_seconds() if prev_ts else 0.0

        server_detected = False
        if ev.type == "paste":
            # If client already declared a paste, still run lightweight checks to flag suspiciousness
            server_detected = looks_like_paste(prev_code, rec.get("details", {}).get("placeholder", "") or prev_code + " " , delta_time)
            # For paste events, check details for textLength and mark if large
            text_len = rec["details"].get("textLength", 0)
            if text_len >= PASTE_MIN_LEN and delta_time < max(PASTE_TIME_THRESHOLD_SEC, 1.0):
                server_detected = True
        else:
            # If the client sent a keystroke event that results in a very large insertion (some editors do),
            # attempt to detect a hidden paste (e.g., when editor doesn't report paste explicitly)
            # Look at details: some clients may provide addedTextLength or charCount
            added_len = rec["details"].get("addedLength", 0) or rec["details"].get("charCount", 0)
            # Reconstruct a best-effort new_code if client provided textLength for recent paste-like info
            new_code_estimate = prev_code
            if ev.type == "keystroke" and added_len and added_len >= PASTE_MIN_LEN:
                # If time is very small and many chars added, treat as a suspected paste
                if delta_time < PASTE_TIME_THRESHOLD_SEC:
                    server_detected = True

        # attach server detection metadata when applicable
        if server_detected:
            rec["_server_detected"] = True

        saved_events.append(rec)

        # update prev pointers for next event
        prev_ts = ev_client_ts
        # we do not store actual code body — but to allow next heuristic we can update prev_code estimate:
        # if client provides textLength we can approximate new length; otherwise keep previous
        if rec["details"].get("textLength") is not None:
            # store an estimated code length by keeping a placeholder string of that length (safe, no raw text)
            prev_code = " " * int(rec["details"].get("textLength", 0))
        elif rec["details"].get("charCount") is not None:
            prev_code = " " * int(rec["details"].get("charCount"))
        else:
            # fallback: keep previous
            prev_code = prev_code

    # persist saved events
    _append_events_to_file(batch.sessionId, saved_events)

    # Update in-memory last_events to current state
    last_events[batch.sessionId] = {"time": now, "code": prev_code}

    # Produce a small server-side summary for quick checks
    typed = sum(1 for e in saved_events if e["type"] == "keystroke" or e["type"] == "typing")
    pastes = sum(1 for e in saved_events if e["type"] == "paste")
    pasted_chars = sum(e["details"].get("textLength", 0) for e in saved_events if e["type"] == "paste")
    typed_chars = sum(e["details"].get("charCount", 0) for e in saved_events if e.get("details"))

    server_detected_count = sum(1 for e in saved_events if e.get("_server_detected"))
    suspicious_count = sum(1 for e in saved_events if e.get("_validation") or e.get("_server_detected"))

    summary = {
        "sessionId": batch.sessionId,
        "received": len(saved_events),
        "keystrokes": typed,
        "pasteEvents": pastes,
        "pastedChars": pasted_chars,
        "typedCharsApprox": typed_chars,
        "serverDetectedPastes": server_detected_count,
        "suspiciousEvents": suspicious_count
    }

    # If server detected paste events, also append to paste_events.json for admin review
    for e in saved_events:
        if e.get("_server_detected") or (e["type"] == "paste" and e.get("details", {}).get("textLength", 0) >= PASTE_MIN_LEN):
            paste_entry = {
                "timestamp": e.get("receivedAt"),
                "sessionId": batch.sessionId,
                "type": e.get("type"),
                "details": {
                    "textLength": e.get("details", {}).get("textLength"),
                    "textHash": e.get("details", {}).get("textHash"),
                },
                "serverDetected": bool(e.get("_server_detected"))
            }
            append_paste_log(paste_entry)

    return {"status": "ok", "summary": summary}


# -------------------------
# Helper endpoint: fetch logs for a session (admin/teacher)
# -------------------------
@router.get("/session/{session_id}")
async def get_session_logs(session_id: str):
    events = _load_events_from_file(session_id)
    if not events:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"sessionId": session_id, "events": events}