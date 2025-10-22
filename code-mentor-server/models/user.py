class User(Base):
    __tablename__ = "user"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)  # e.g., "admin", "student", etc.

    # Relationship to admin table only
    admin = relationship("Admin", back_populates="user", uselist=False)
from fastapi import APIRouter, HTTPException, status
from sqlalchemy.future import select