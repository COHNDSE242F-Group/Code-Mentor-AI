from sqlalchemy import Column, Integer, String, Text
from database import Base


class Plan(Base):
    __tablename__ = "plan"

    plan_id = Column(Integer, primary_key=True, index=True)
    plan_key = Column(String(50), nullable=False, unique=True)  # e.g. 'starter'
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    monthly_price = Column(Integer, nullable=False)
    yearly_price = Column(Integer, nullable=False)
    instructors = Column(String(50), nullable=True)  # number or 'Unlimited'
    students = Column(String(50), nullable=True)
    storage = Column(String(100), nullable=True)
    features = Column(Text, nullable=True)  # JSON string or CSV

    def __repr__(self):
        return f"<Plan(id={self.plan_id}, key={self.plan_key}, name={self.name})>"
