from sqlalchemy import Column, Integer
from sqlalchemy.dialects.postgresql import JSONB
from database import Base  # import your Base from database.py

class TopicMap(Base):
    __tablename__ = "topic_map"

    assignment_id = Column(Integer, primary_key=True, nullable=False)
    content = Column(JSONB, nullable=False)

    def __repr__(self):
        return f"<TopicMap(assignment_id={self.assignment_id}, content={self.content})>"