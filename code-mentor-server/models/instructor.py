from sqlalchemy import Column, Integer, String, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base

class Instructor(Base):
    __tablename__ = "instructor"

    instructor_id = Column(Integer, primary_key=True, index=True)
    index_no = Column(String(50), nullable=True)
    instructor_name = Column(String(255), nullable=False)
    uni_id = Column(Integer, ForeignKey("university.university_id"), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    contact_no = Column(String(20), nullable=True)
    qualifications = Column(JSON, nullable=True)
    address = Column(String(255), nullable=True)

    university = relationship("University", back_populates="instructors")
    assignments = relationship("Assignment", back_populates="instructor")

    def __repr__(self):
        return f"<Instructor(id={self.instructor_id}, name={self.instructor_name})>"