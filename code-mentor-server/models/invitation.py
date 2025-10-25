from sqlalchemy import Column, Integer, String, Enum, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Invitation(Base):
    __tablename__ = "invitation"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    role = Column(Enum("instructor", "student", name="role_enum"), nullable=False)
    status = Column(Enum("pending", "sent", name="status_enum"), default="pending")
    uni_id = Column(Integer, ForeignKey("university.university_id"), nullable=False)

    university = relationship("University", back_populates="invitations")