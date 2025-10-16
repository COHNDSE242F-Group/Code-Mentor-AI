# auth/dependencies.py
from fastapi import Depends, HTTPException, status
from auth.auth import verify_token  # your JWT verifier
from models import User  # optional, if you need user info

def login_required(token: str = Depends(verify_token)):
    """Require the user to be logged in."""
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Login required")
    return token


def role_required(allowed_roles: list[str]):
    """
    Returns a dependency that ensures the user has one of the allowed roles.
    Example: Depends(role_required(["admin", "instructor"]))
    """
    def dependency(token_data: dict = Depends(verify_token)):
        user_role = token_data.get("role")
        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied: {user_role} role not permitted"
            )
        return token_data
    return dependency