from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, TIMESTAMP, Text
from sqlalchemy.orm import relationship
from database import Base

class Conversation(Base):
    __tablename__ = "conversation"

    conversation_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    is_group = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, default="now()")

    participants = relationship("ConversationParticipant", back_populates="conversation")
    messages = relationship("Message", back_populates="conversation")


class ConversationParticipant(Base):
    __tablename__ = "conversation_participant"

    participant_id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversation.conversation_id"), nullable=False)
    user_id = Column(Integer, ForeignKey("user.user_id"), nullable=False)
    role = Column(String(50), default="participant")
    joined_at = Column(TIMESTAMP, default="now()")

    conversation = relationship("Conversation", back_populates="participants")


class Message(Base):
    __tablename__ = "message"

    message_id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversation.conversation_id"), nullable=False)
    sender_id = Column(Integer, ForeignKey("user.user_id"), nullable=False)
    text = Column(Text, nullable=False)
    sent_at = Column(TIMESTAMP, default="now()")

    conversation = relationship("Conversation", back_populates="messages")