# routers/editor.py
from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
import os
import json
from pathlib import Path
import hashlib

router = APIRouter()

LOG_DIR = Path("logs")
LOG_DIR.mkdir(exist_ok=True)

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
# Optional: small integrity helper (HMAC placeholder)
# -------------------------
def compute_text_hash(text: str) -> str:
    # SHA-256 hex digest (used by client for paste fingerprint)
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


# -------------------------
# Main endpoint - receive batched events
# -------------------------
@router.post("/log")
async def receive_event_batch(batch: KeystrokeBatch, request: Request):
    """
    Accepts a batch of keystroke/paste events for a session.
    Expected payload:
    {
      "sessionId": "sess_abc",
      "events": [
         { "sessionId":"sess_abc", "type":"keystroke", "details":{"key":"a"}, "clientTime":"2025-10-11T09:00:00.000Z" },
         { "sessionId":"sess_abc", "type":"paste", "details":{"textLength":120,"textHash":"..."} , "clientTime":"..." }
      ]
    }
    """
    # Basic validation
    if not batch.events or batch.sessionId.strip() == "":
        raise HTTPException(status_code=400, detail="Empty batch or missing sessionId")

    # All events must belong to same session
    for ev in batch.events:
        if ev.sessionId != batch.sessionId:
            raise HTTPException(status_code=400, detail="Mismatched sessionId in events")

    # Validate order/timestamps
    if not _validate_event_order(batch.events):
        # We allow storing but mark as suspicious in the record
        saved = []
        for ev in batch.events:
            rec = _create_event_record(ev)
            rec["_validation"] = "out_of_order_or_bad_timestamp"
            saved.append(rec)
        _append_events_to_file(batch.sessionId, saved)
        return {"status": "partial", "message": "Events saved but timestamp validation failed."}

    # Convert and store events (do not store raw pasted text; client should send textHash instead)
    saved_events = []
    for ev in batch.events:
        rec = _create_event_record(ev)
        saved_events.append(rec)

    _append_events_to_file(batch.sessionId, saved_events)

    # Produce a small server-side summary for quick checks
    typed = sum(1 for e in saved_events if e["type"] == "keystroke")
    pastes = sum(1 for e in saved_events if e["type"] == "paste")
    pasted_chars = sum(e["details"].get("textLength", 0) for e in saved_events if e["type"] == "paste")
    typed_chars = sum(e["details"].get("charCount", 0) for e in saved_events if e["type"] == "typingLength" or e["type"] == "typing")

    summary = {
        "sessionId": batch.sessionId,
        "received": len(saved_events),
        "keystrokes": typed,
        "pasteEvents": pastes,
        "pastedChars": pasted_chars,
        "typedCharsApprox": typed_chars
    }

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


# -------------------------
# Integrating with /submit
# -------------------------
# You should call _load_events_from_file(session_id) when processing submission to attach logs
# Example for usage in your submit route (not here):
#
# events = _load_events_from_file(submission.sessionId)
# suspicious = [e for e in events if e["type"] == "paste" or e.get("_validation")]
# compute summary and save submission + logs in DB
#
# -------------------------