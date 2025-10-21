from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Student(Base):
    __tablename__ = "student"

    student_id = Column(Integer, primary_key=True, index=True)
    index_no = Column(String(50), nullable=True)
    student_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    contact_no = Column(String(20), nullable=True)
    uni_id = Column(Integer, ForeignKey("university.university_id"), nullable=False)
    batch_id = Column(Integer, ForeignKey("batch.batch_id"), nullable=False)

    university = relationship("University", back_populates="students")
    batch = relationship("Batch", back_populates="students")
    submissions = relationship("Submission", back_populates="student")

    def __repr__(self):
        return f"<Student(id={self.student_id}, name={self.student_name})>"
