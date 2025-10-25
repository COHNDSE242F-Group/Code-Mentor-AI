from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from database import Base


class Subscription(Base):
    __tablename__ = "subscription"

    subscription_id = Column(Integer, primary_key=True, index=True)
    uni_id = Column(Integer, ForeignKey("university.university_id"), nullable=False)
    plan_key = Column(String(50), nullable=False)
    billing_cycle = Column(String(20), nullable=False)  # 'monthly' or 'yearly'
    status = Column(String(50), nullable=False, default='active')
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<Subscription(id={self.subscription_id}, uni_id={self.uni_id}, plan_key={self.plan_key})>"
