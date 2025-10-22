from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, TIMESTAMP, Text
from sqlalchemy.orm import relationship
from database import Base

from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, JSON
from database import Base

class Conversation(Base):
    __tablename__ = "conversation"

    conversation_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    is_group = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, default="now()")
    participants = Column(JSON, nullable=False)  # JSON column for participants
    messages = Column(JSON, nullable=False)      # JSON column for messages