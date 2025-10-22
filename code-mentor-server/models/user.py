from sqlalchemy import Column, Integer, String
from database import Base

class User(Base):
    __tablename__ = "user"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)  # e.g., "admin", "student", "instructor"

    def __repr__(self):
        return f"<User(id={self.user_id}, username={self.username}, role={self.role})>"
