import os
import smtplib
from email.message import EmailMessage
from datetime import datetime, timedelta

import jwt
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv

# Load .env file
load_dotenv()

router = APIRouter(prefix="/auth", tags=["Password Reset"])

# Get environment variables
SECRET_KEY = os.getenv("SECRET_KEY")
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")

if not SECRET_KEY or not EMAIL_USER or not EMAIL_PASS:
    raise RuntimeError("SECRET_KEY, EMAIL_USER, and EMAIL_PASS must be set in .env")

# Request models
class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

# Temporary token store
password_reset_tokens = {}

@router.post("/forgot-password")
async def forgot_password(req: ForgotPasswordRequest):
    email = req.email

    # Generate JWT token valid for 15 minutes
    token = jwt.encode(
        {"email": email, "exp": datetime.utcnow() + timedelta(minutes=15)},
        SECRET_KEY,
        algorithm="HS256"
    )

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

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        email = payload.get("email")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=400, detail="Invalid token")

    if token not in password_reset_tokens or password_reset_tokens[token] != email:
        raise HTTPException(status_code=400, detail="Invalid token")

    # 🔧 TODO: Update password in database for this user
    print(f"Password for {email} has been reset to: {new_password}")

    del password_reset_tokens[token]
    return {"message": "Password reset successful"}