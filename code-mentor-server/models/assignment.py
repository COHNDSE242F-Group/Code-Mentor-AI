from sqlalchemy import Column, Integer, String, ForeignKey, JSON, Date
from sqlalchemy.orm import relationship
from database import Base

class Assignment(Base):
    __tablename__ = "assignment"

    assignment_id = Column(Integer, primary_key=True, index=True)
    assignment_name = Column(String(255), nullable=False)
    description = Column(JSON, nullable=True)
    due_date = Column(Date, nullable=False)
    instructor_id = Column(Integer, ForeignKey("instructor.instructor_id"), nullable=True)
    batch_id = Column(Integer, ForeignKey("batch.batch_id"), nullable=True)

    instructor = relationship("Instructor", back_populates="assignments")
    batch = relationship("Batch", back_populates="assignments")
    submissions = relationship("Submission", back_populates="assignment")

    def __repr__(self):
        return f"<Assignment(id={self.assignment_id}, name={self.assignment_name})>"