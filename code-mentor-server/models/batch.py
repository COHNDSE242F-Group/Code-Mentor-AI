from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Batch(Base):
    __tablename__ = "batch"

    batch_id = Column(Integer, primary_key=True, index=True)
    batch_name = Column(String(100), nullable=False)
    uni_id = Column(Integer, ForeignKey("university.university_id"), nullable=False)

    university = relationship("University", back_populates="batches")
    students = relationship("Student", back_populates="batch")
    assignments = relationship("Assignment", back_populates="batch")

    def __repr__(self):
        return f"<Batch(id={self.batch_id}, name={self.batch_name})>"