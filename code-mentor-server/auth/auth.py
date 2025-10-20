# auth/auth.py
from datetime import datetime, timedelta
from typing import Optional, Dict
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt, ExpiredSignatureError
from passlib.context import CryptContext

# ==========================
# JWT Configuration
# ==========================
SECRET_KEY = "YOUR_VERY_STRONG_SECRET_KEY_HERE"  # change in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 10000

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme (looks for token in the "Authorization" header)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# ==========================
# Password Hashing
# ==========================
def hash_password(password: str) -> str:
    """
    Hash a plain text password using bcrypt.
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against a hashed password.
    Fallback to plain text comparison if verification fails.
    """
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        # fallback if stored password is plain text
        return plain_password == hashed_password

# ==========================
# JWT Token Handling
# ==========================
def create_access_token(data: Dict[str, str], expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token with optional expiration.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# ==========================
# JWT Token Verification
# ==========================
def verify_token(token: str = Depends(oauth2_scheme)) -> Dict[str, str]:
    """
    Verify a JWT and return the decoded payload if valid.
    Raises HTTPException if token is invalid or expired.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("user_id")
        role: str = payload.get("role", "user")

        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing user ID"
            )

        return {"user_id": user_id, "role": role}

    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )