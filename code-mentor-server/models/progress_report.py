from sqlalchemy import Column, Integer
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.mutable import MutableDict
from database import Base  # Ensure correct import path

class ProgressReport(Base):
    __tablename__ = "progress_report"

    student_id = Column(Integer, primary_key=True, nullable=False)
    content = Column(MutableDict.as_mutable(JSONB), nullable=False)

    def __repr__(self):
        return f"<ProgressReport(student_id={self.student_id}, content={self.content})>"