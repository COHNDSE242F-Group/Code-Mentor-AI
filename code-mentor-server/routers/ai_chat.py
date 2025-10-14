# ai_chat.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from groq import Groq
import traceback
import os

# === Initialize Groq client ===
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

router = APIRouter()

# === Request / Response Models ===
class ChatRequest(BaseModel):
    message: str
    history: list = []

class ChatResponse(BaseModel):
    reply: str

# === Main Chat Endpoint ===
@router.post("/ai-chat", response_model=ChatResponse)
async def ai_chat(req: ChatRequest):
    try:
        messages = [
            {"role": "system", "content": "You are a helpful AI tutor who assists students with code explanations and debugging."}
        ]

        # Include chat history if provided
        if req.history:
            for h in req.history:
                role = h.get("role", "user")
                content = h.get("content", "")
                messages.append({"role": role, "content": content})

        # Add the current user message
        messages.append({"role": "user", "content": req.message})

        print("📤 Messages sent to Groq:", messages)

        # === Call Groq’s new API ===
        completion = client.chat.completions.create(
            model="openai/gpt-oss-20b",  # ✅ currently active model
            messages=messages,
            temperature=0.7,
            max_completion_tokens=500,
            top_p=1,
            reasoning_effort="medium",
            stream=False,  # set True for live streaming
            stop=None
        )

        reply_text = completion.choices[0].message.content

        return {"reply": reply_text}

    except Exception as e:
        print("❌ Error:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
