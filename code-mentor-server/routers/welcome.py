from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import async_session
from models.university import University

router = APIRouter(
    prefix="/welcome",
    tags=["welcome"]
)


class WelcomeCreate(BaseModel):
    universityName: str
    address: str
    contactEmail: EmailStr | None = None
    contactNo: str | None = None


class WelcomeOut(BaseModel):
    university_id: int
    university_name: str


@router.post("/register", response_model=WelcomeOut)
async def register_university(payload: WelcomeCreate):
    """Create a University record.

    Stores university name, address, contact email and contact number.
    If a university with the provided contact email already exists, returns 409.
    """
    async with async_session() as session:
        # Use provided contactEmail if present
        contact_email = payload.contactEmail

        # Check for existing university by email
        if contact_email:
            q = await session.execute(select(University).where(University.email == contact_email))
            existing = q.scalar_one_or_none()
            if existing:
                raise HTTPException(status_code=409, detail={
                    "message": "University with that contact email already exists",
                    "university_id": existing.university_id,
                    "university_name": existing.university_name
                })

        # Create the university (save contact_email and contact_no to university)
        new_uni = University(
            university_name=payload.universityName,
            address=payload.address,
            email=contact_email or "",
            contact_no=payload.contactNo or None,
        )
        session.add(new_uni)
        try:
            await session.commit()
        except Exception as e:
            await session.rollback()
            raise HTTPException(status_code=500, detail=str(e))

        await session.refresh(new_uni)

    return WelcomeOut(
        university_id=new_uni.university_id,
        university_name=new_uni.university_name,
    )
