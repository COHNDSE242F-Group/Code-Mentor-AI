from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Admin(Base):
    __tablename__ = "admin"

    admin_id = Column(Integer, primary_key=True, index=True)
    uni_id = Column(Integer, ForeignKey("university.university_id"), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    contact_no = Column(String(20), nullable=True)

    # Relationship with University
    university = relationship("University", back_populates="admins")

    def __repr__(self):
        return f"<Admin(id={self.admin_id}, email={self.email})>"
