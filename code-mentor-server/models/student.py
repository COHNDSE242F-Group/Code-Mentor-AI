from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Student(Base):
    __tablename__ = "student"

    # student_id is the same as the linked user's user_id
    student_id = Column(Integer, ForeignKey("user.user_id"), primary_key=True, index=True)
    student_name = Column(String(200), nullable=False)
    email = Column(String(200), nullable=False)
    contact_no = Column(String(50), nullable=True)
    index_no = Column(String(50), nullable=True)
    uni_id = Column(Integer, nullable=True)
    batch_id = Column(Integer, nullable=True)

    # Relationship back to User (one-to-one)
    user = relationship("User", backref="student", uselist=False)

    def __repr__(self):
        return f"<Student(id={self.student_id}, name={self.student_name})>"
