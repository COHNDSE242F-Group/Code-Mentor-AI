from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import get_db
from models.invitation import Invitation
from models.admin import Admin
from auth.auth import verify_token
from typing import List

router = APIRouter()

# Add an invitation
@router.post("/invitations")
async def add_invitation(
    email: str,
    name: str,
    role: str,
    token: dict = Depends(verify_token),
    db: AsyncSession = Depends(get_db),
):
    admin_id = token["user_id"]

    # Fetch uni_id for the admin
    admin_query = await db.execute(select(Admin.uni_id).where(Admin.admin_id == admin_id))
    uni_id = admin_query.scalar_one_or_none()

    if not uni_id:
        raise HTTPException(status_code=404, detail="University not found for the admin")

    # Add the invitation
    new_invitation = Invitation(email=email, name=name, role=role, uni_id=uni_id)
    db.add(new_invitation)
    await db.commit()
    await db.refresh(new_invitation)

    return {"message": "Invitation added successfully", "invitation": new_invitation}

# Remove an invitation
@router.delete("/invitations/{invitation_id}")
async def remove_invitation(invitation_id: int, db: AsyncSession = Depends(get_db)):
    invitation_query = await db.execute(select(Invitation).where(Invitation.id == invitation_id))
    invitation = invitation_query.scalar_one_or_none()

    if not invitation:
        raise HTTPException(status_code=404, detail="Invitation not found")

    await db.delete(invitation)
    await db.commit()

    return {"message": "Invitation removed successfully"}

# Process CSV file
@router.post("/invitations/process-csv")
async def process_csv(
    csv_file: bytes,  # File content as bytes
    token: dict = Depends(verify_token),
    db: AsyncSession = Depends(get_db),
):
    admin_id = token["user_id"]

    # Fetch uni_id for the admin
    admin_query = await db.execute(select(Admin.uni_id).where(Admin.admin_id == admin_id))
    uni_id = admin_query.scalar_one_or_none()

    if not uni_id:
        raise HTTPException(status_code=404, detail="University not found for the admin")

    # Parse CSV file (assuming name and email columns)
    import csv
    from io import StringIO

    csv_content = StringIO(csv_file.decode("utf-8"))
    reader = csv.DictReader(csv_content)

    invitations = []
    for row in reader:
        email = row.get("email")
        name = row.get("name")
        role = row.get("role")

        if email and name and role in ["instructor", "student"]:
            new_invitation = Invitation(email=email, name=name, role=role, uni_id=uni_id)
            db.add(new_invitation)
            invitations.append(new_invitation)

    await db.commit()

    return {"message": "CSV processed successfully", "invitations": invitations}