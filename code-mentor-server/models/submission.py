from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB
from database import Base
from datetime import datetime, timezone

class Submission(Base):
    __tablename__ = "submission"

    submission_id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("assignment.assignment_id", ondelete="CASCADE"), nullable=False)
    student_id = Column(Integer, ForeignKey("student.student_id", ondelete="CASCADE"), nullable=False)
    report = Column(JSONB, nullable=True)
    submitted_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    assignment = relationship("Assignment", back_populates="submissions")
    student = relationship("Student", back_populates="submissions")

    def __repr__(self):
        return f"<Submission(id={self.submission_id}, student_id={self.student_id})>"