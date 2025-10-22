from sqlalchemy import Column, Integer, ForeignKey, String
from sqlalchemy.orm import relationship
from database import Base

class Admin(Base):
    __tablename__ = "admin"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.user_id"), nullable=False)
    
    # link back to User
    user = relationship("User", back_populates="admin")
    def __repr__(self):
        return f"<Admin(id={self.id}, user_id={self.user_id})>"