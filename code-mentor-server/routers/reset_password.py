import os
import importlib
import smtplib
from email.message import EmailMessage
from datetime import datetime, timedelta

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

# Try to load .env if available; not fatal if the editor/analyzer isn't using the venv
try:
    dotenv = importlib.import_module("dotenv")
    load_dotenv = getattr(dotenv, "load_dotenv")
    load_dotenv()
except Exception:
    pass

router = APIRouter(prefix="/auth", tags=["Password Reset"])

# Request models
class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

# Temporary token store
password_reset_tokens = {}


def _get_jwt_module():
    try:
        return importlib.import_module("jwt")
    except Exception:
        try:
            jose = importlib.import_module("jose")
            return getattr(jose, "jwt")
        except Exception:
            raise RuntimeError("Missing JWT library: install 'PyJWT' or 'python-jose' in the environment")

@router.post("/forgot-password")
async def forgot_password(req: ForgotPasswordRequest):
    email = req.email

    # Read environment and validate
    SECRET_KEY = os.getenv("SECRET_KEY")
    EMAIL_USER = os.getenv("EMAIL_USER")
    EMAIL_PASS = os.getenv("EMAIL_PASS")

    if not SECRET_KEY or not EMAIL_USER or not EMAIL_PASS:
        raise HTTPException(status_code=500, detail="Server not configured for email or JWT")

    # Dynamically load JWT module and create token valid for 15 minutes
    try:
        jwt_mod = _get_jwt_module()
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))

    token = jwt_mod.encode({"email": email, "exp": datetime.utcnow() + timedelta(minutes=15)}, SECRET_KEY, algorithm="HS256")

    password_reset_tokens[token] = email
    reset_link = f"http://localhost:5173/reset-password?token={token}"  # Your React page

    # Create email
    msg = EmailMessage()
    msg['Subject'] = "Reset your CodeMentorAI password"
    msg['From'] = EMAIL_USER
    msg['To'] = email
    msg.set_content(
        f"Hello,\n\nClick this link to reset your password:\n{reset_link}\n\n"
        "This link will expire in 15 minutes."
    )

    # Send email
    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASS)
            server.send_message(msg)
        return {"message": "Password reset link sent"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")


@router.post("/reset-password")
async def reset_password(req: ResetPasswordRequest):
    token = req.token
    new_password = req.new_password

    SECRET_KEY = os.getenv("SECRET_KEY")
    if not SECRET_KEY:
        raise HTTPException(status_code=500, detail="Server not configured for JWT")

    try:
        jwt_mod = _get_jwt_module()
        payload = jwt_mod.decode(token, SECRET_KEY, algorithms=["HS256"]) if hasattr(jwt_mod, "decode") else jwt_mod.decode(token, SECRET_KEY)
        email = payload.get("email") if isinstance(payload, dict) else None
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid or expired token: {str(e)}")

    if token not in password_reset_tokens or password_reset_tokens[token] != email:
        raise HTTPException(status_code=400, detail="Invalid token")

    # 🔧 TODO: Update password in database for this user
    print(f"Password for {email} has been reset to: {new_password}")

    del password_reset_tokens[token]
    return {"message": "Password reset successful"}