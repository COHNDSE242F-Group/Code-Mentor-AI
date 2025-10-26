from sqlalchemy import Column, Integer
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.mutable import MutableDict
from database import Base

class ConceptualMap(Base):
    __tablename__ = "conceptual_map"

    batch_id = Column(Integer, primary_key=True, nullable=False)
    content = Column(MutableDict.as_mutable(JSONB), nullable=False, default=dict)

    def __repr__(self):
        return f"<ConceptualMap(batch_id={self.batch_id}, content={self.content})>"