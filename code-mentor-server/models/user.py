from sqlalchemy import Column, Integer, String
from database import Base  # Import your declarative_base from database.py

class User(Base):
    __tablename__ = "user"  # Matches your existing table name

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="user")  # 👈 Added role field

    def __repr__(self):
        return f"<User(id={self.user_id}, username={self.username}, role={self.role})>"