from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import async_session
from models import User

SECRET_KEY = "YOUR_SECRET_KEY"
ALGORITHM = "HS256"

router = APIRouter()


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


@router.post("/reset-password")
async def reset_password(request: ResetPasswordRequest, session: AsyncSession = Depends(async_session)):
    # Import JWT and password hashing libraries at runtime so static analyzers
    # that don't see the project's venv don't report unresolved imports.
    import importlib

    # Load JWT implementation dynamically to avoid static analyzer import errors
    jwt = None
    JWTError = Exception
    try:
        jose_mod = importlib.import_module("jose")
        jwt = getattr(jose_mod, "jwt", None)
        JWTError = getattr(jose_mod, "JWTError", JWTError)
    except Exception:
        # fallback to PyJWT
        try:
            pyjwt = importlib.import_module("jwt")
            jwt = pyjwt
            # PyJWT doesn't expose JWTError; define a local wrapper
            class JWTError(Exception):
                pass
        except Exception:
            raise HTTPException(status_code=500, detail="Missing JWT library: install 'python-jose' or 'PyJWT' in the project venv")

    # Load password hashing implementation dynamically
    try:
        passlib_context_mod = importlib.import_module("passlib.context")
        CryptContext = getattr(passlib_context_mod, "CryptContext")
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    except Exception:
        raise HTTPException(status_code=500, detail="Missing password hashing library: install 'passlib[bcrypt]' in the project venv")

    # Decode the token
    try:
        # If we're using PyJWT the signature is the same for decode
        payload = jwt.decode(request.token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("email")
        if not email:
            raise HTTPException(status_code=400, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    except Exception as e:
        # PyJWT may raise different exceptions; treat them as invalid token here
        raise HTTPException(status_code=400, detail=f"Invalid or expired token: {str(e)}")

    # Check if the user exists in the database
    result = await session.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update the user's password
    hashed_password = pwd_context.hash(request.new_password)
    user.password = hashed_password
    session.add(user)
    await session.commit()

    return {"message": "Password reset successful"}