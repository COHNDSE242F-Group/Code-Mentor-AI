from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class ForgotPasswordRequest(BaseModel):
    email: str

@router.post("/forgot-password")
async def forgot_password(request: ForgotPasswordRequest):
    # TODO: Implement actual email sending logic here
    print(f"Password reset requested for: {request.email}")
    return {"message": "Password reset email sent if user exists."}