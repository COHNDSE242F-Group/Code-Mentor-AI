from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from database import Base

class University(Base):
    __tablename__ = "university"

    university_id = Column(Integer, primary_key=True, index=True)
    university_name = Column(String(255), nullable=False)
    address = Column(Text, nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    contact_no = Column(String(20), nullable=True)

    batches = relationship("Batch", back_populates="university")
    instructors = relationship("Instructor", back_populates="university")
    students = relationship("Student", back_populates="university")

    def __repr__(self):
        return f"<University(id={self.university_id}, name={self.university_name})>"