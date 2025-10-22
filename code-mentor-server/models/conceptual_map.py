from sqlalchemy import Column, Integer
from sqlalchemy.dialects.postgresql import JSONB
from database import Base  # Make sure this imports your SQLAlchemy Base

class ConceptualMap(Base):
    __tablename__ = "conceptual_map"

    batch_id = Column(Integer, primary_key=True, nullable=False)
    content = Column(JSONB, nullable=False)

    def __repr__(self):
        return f"<ConceptualMap(batch_id={self.batch_id}, content={self.content})>"