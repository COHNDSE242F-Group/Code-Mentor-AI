#incoreect version
from sqlalchemy import Column, Integer, TIMESTAMP, ForeignKey,String
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB
from database import Base

class Submission(Base):
    __tablename__ = "submission"

    submission_id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("assignment.assignment_id"), nullable=False)
    student_id = Column(Integer, ForeignKey("student.student_id"), nullable=False)
    report = Column(JSONB, nullable=True)
    submitted_at = Column(TIMESTAMP(timezone=False), nullable=True)

    # Relationships
    assignment = relationship("Assignment", back_populates="submissions")
    student = relationship("Student", back_populates="submissions")


class Assignment(Base):
    __tablename__ = "assignment"

    assignment_id = Column(Integer, primary_key=True, index=True)
    assignment_name = Column(String(255), nullable=False)
    due_date = Column(TIMESTAMP(timezone=False), nullable=False)
    instructor_id = Column(Integer, ForeignKey("instructor.instructor_id"), nullable=True)
    batch_id = Column(Integer, ForeignKey("batch.batch_id"), nullable=True)
    description = Column(JSONB, nullable=True)

    # Relationships
    submissions = relationship("Submission", back_populates="assignment")
    instructor = relationship("Instructor", back_populates="assignments")
    batch = relationship("Batch", back_populates="assignments")


class Student(Base):
    __tablename__ = "student"

    student_id = Column(Integer, primary_key=True, index=True)
    student_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    contact_no = Column(String(20), nullable=True)
    batch_id = Column(Integer, ForeignKey("batch.batch_id"), nullable=False)

    # Relationships
    submissions = relationship("Submission", back_populates="student")
    batch = relationship("Batch", back_populates="students")


class Batch(Base):
    __tablename__ = "batch"

    batch_id = Column(Integer, primary_key=True, index=True)
    batch_name = Column(String(100), nullable=False)
    uni_id = Column(Integer, ForeignKey("university.university_id"), nullable=False)

    # Relationships
    assignments = relationship("Assignment", back_populates="batch")
    students = relationship("Student", back_populates="batch")


class Instructor(Base):
    __tablename__ = "instructor"

    instructor_id = Column(Integer, primary_key=True, index=True)
    instructor_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    contact_no = Column(String(20), nullable=True)

    # Relationships
    assignments = relationship("Assignment", back_populates="instructor")