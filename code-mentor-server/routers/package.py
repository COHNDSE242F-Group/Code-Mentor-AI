from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import text
from database import async_session
from models.plan import Plan
from models.subscription import Subscription
from models.university import University
from pydantic import Field
from datetime import datetime

router = APIRouter(
    prefix="/packages",
    tags=["packages"]
)


class PlanOut(BaseModel):
    plan_key: str
    name: str
    description: str | None
    monthly_price: int
    yearly_price: int
    instructors: str | None
    students: str | None
    storage: str | None


class SubscribeIn(BaseModel):
    uni_id: int
    plan_key: str
    billing_cycle: str  # 'monthly' | 'yearly'


class PlanDetail(BaseModel):
    plan_key: str
    name: str
    description: str | None
    monthly_price: int
    yearly_price: int
    instructors: str | None
    students: str | None
    storage: str | None
    features: str | None


class SubscriptionOut(BaseModel):
    subscription_id: int
    uni_id: int
    plan: PlanDetail
    billing_cycle: str
    status: str
    created_at: datetime | None = Field(default=None)


class BillingProfileIn(BaseModel):
    contact_name: Optional[str]
    contact_email: Optional[str]
    address_line1: Optional[str]
    address_line2: Optional[str] = None
    city: Optional[str] = None
    state_province: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    vat_number: Optional[str] = None


class PaymentMethodIn(BaseModel):
    provider: str  # e.g., 'stripe' or 'fake'
    provider_payment_method_id: str
    type: str  # 'card', 'paypal', 'bank_transfer'
    card_brand: Optional[str] = None
    card_last4: Optional[str] = None
    card_exp_month: Optional[int] = None
    card_exp_year: Optional[int] = None
    is_default: Optional[bool] = False


class ConfirmIn(BaseModel):
    billing_profile: Optional[BillingProfileIn]
    payment_method: Optional[PaymentMethodIn]


@router.get("/", response_model=List[PlanOut])
async def list_plans():
    async with async_session() as session:
        result = await session.execute(select(Plan))
        plans = result.scalars().all()
        return [PlanOut(
            plan_key=p.plan_key,
            name=p.name,
            description=p.description,
            monthly_price=p.monthly_price,
            yearly_price=p.yearly_price,
            instructors=p.instructors,
            students=p.students,
            storage=p.storage
        ) for p in plans]


@router.post("/subscribe")
async def subscribe(payload: SubscribeIn):
    async with async_session() as session:
        # Basic validation: does plan exist?
        result = await session.execute(select(Plan).where(Plan.plan_key == payload.plan_key))
        plan = result.scalar_one_or_none()
        if not plan:
            raise HTTPException(status_code=404, detail="Plan not found")

        # Validate university exists
        uni_res = await session.execute(select(University).where(University.university_id == payload.uni_id))
        uni = uni_res.scalar_one_or_none()
        if not uni:
            raise HTTPException(status_code=404, detail="University not found")

        # create subscription as 'pending' until payment/confirmation
        sub = Subscription(
            uni_id=payload.uni_id,
            plan_key=payload.plan_key,
            billing_cycle=payload.billing_cycle,
            status='pending'
        )
        session.add(sub)
        try:
            await session.commit()
            await session.refresh(sub)
        except Exception as e:
            await session.rollback()
            raise HTTPException(status_code=500, detail=str(e))

        # Build response with plan detail
        plan_detail = PlanDetail(
            plan_key=plan.plan_key,
            name=plan.name,
            description=plan.description,
            monthly_price=plan.monthly_price,
            yearly_price=plan.yearly_price,
            instructors=plan.instructors,
            students=plan.students,
            storage=plan.storage,
            features=plan.features
        )

        return SubscriptionOut(
            subscription_id=sub.subscription_id,
            uni_id=sub.uni_id,
            plan=plan_detail,
            billing_cycle=sub.billing_cycle,
            status=sub.status,
            created_at=sub.created_at
        )


@router.get("/subscription/{subscription_id}", response_model=SubscriptionOut)
async def get_subscription(subscription_id: int):
    async with async_session() as session:
        # get subscription
        result = await session.execute(select(Subscription).where(Subscription.subscription_id == subscription_id))
        sub = result.scalar_one_or_none()
        if not sub:
            raise HTTPException(status_code=404, detail="Subscription not found")

        # get plan
        plan_res = await session.execute(select(Plan).where(Plan.plan_key == sub.plan_key))
        plan = plan_res.scalar_one_or_none()

        plan_detail = PlanDetail(
            plan_key=plan.plan_key,
            name=plan.name,
            description=plan.description,
            monthly_price=plan.monthly_price,
            yearly_price=plan.yearly_price,
            instructors=plan.instructors,
            students=plan.students,
            storage=plan.storage,
            features=plan.features
        ) if plan else None

        return SubscriptionOut(
            subscription_id=sub.subscription_id,
            uni_id=sub.uni_id,
            plan=plan_detail,
            billing_cycle=sub.billing_cycle,
            status=sub.status,
            created_at=sub.created_at
        )


    @router.get('/uni/{uni_id}/subscriptions', response_model=List[SubscriptionOut])
    async def list_subscriptions_for_uni(uni_id: int):
        async with async_session() as session:
            result = await session.execute(select(Subscription).where(Subscription.uni_id == uni_id))
            subs = result.scalars().all()
            out = []
            for sub in subs:
                plan_res = await session.execute(select(Plan).where(Plan.plan_key == sub.plan_key))
                plan = plan_res.scalar_one_or_none()
                plan_detail = PlanDetail(
                    plan_key=plan.plan_key,
                    name=plan.name,
                    description=plan.description,
                    monthly_price=plan.monthly_price,
                    yearly_price=plan.yearly_price,
                    instructors=plan.instructors,
                    students=plan.students,
                    storage=plan.storage,
                    features=plan.features
                ) if plan else None
                out.append(SubscriptionOut(
                    subscription_id=sub.subscription_id,
                    uni_id=sub.uni_id,
                    plan=plan_detail,
                    billing_cycle=sub.billing_cycle,
                    status=sub.status,
                    created_at=sub.created_at
                ))
            return out


    class PaymentMethodOut(BaseModel):
        payment_method_id: int
        provider: str
        provider_payment_method_id: str | None
        type: str | None
        card_brand: str | None
        card_last4: str | None
        is_default: bool | None


    @router.get('/uni/{uni_id}/payment-methods', response_model=List[PaymentMethodOut])
    async def list_payment_methods_for_uni(uni_id: int):
        async with async_session() as session:
            sql = text('SELECT payment_method_id, provider, provider_payment_method_id, type, card_brand, card_last4, is_default FROM payment_method WHERE uni_id = :uni_id ORDER BY created_at DESC')
            res = await session.execute(sql, {'uni_id': uni_id})
            rows = res.fetchall()
            out = []
            for r in rows:
                out.append(PaymentMethodOut(
                    payment_method_id=r[0],
                    provider=r[1],
                    provider_payment_method_id=r[2],
                    type=r[3],
                    card_brand=r[4],
                    card_last4=r[5],
                    is_default=r[6]
                ))
            return out


@router.post("/subscription/{subscription_id}/confirm")
async def confirm_subscription(subscription_id: int, payload: ConfirmIn | None = None):
    """Confirm a pending subscription. Accepts optional billing_profile and payment_method payload to persist.

    This will:
    - verify the subscription exists
    - create/insert billing_profile (if provided)
    - create/insert payment_method (if provided)
    - mark subscription status 'active'
    - create a payment_transaction record (simulated) recording the charge
    """
    async with async_session() as session:
        # get subscription
        result = await session.execute(select(Subscription).where(Subscription.subscription_id == subscription_id))
        sub = result.scalar_one_or_none()
        if not sub:
            raise HTTPException(status_code=404, detail="Subscription not found")

        billing_id = None
        payment_method_id = None
        plan = None
        try:
            # Insert billing_profile if provided
            if payload and payload.billing_profile:
                bp = payload.billing_profile
                insert_sql = text(
                    """
                    INSERT INTO billing_profile
                    (uni_id, contact_name, contact_email, address_line1, address_line2, city, state_province, postal_code, country, vat_number, created_at, updated_at)
                    VALUES (:uni_id, :contact_name, :contact_email, :address_line1, :address_line2, :city, :state_province, :postal_code, :country, :vat_number, now(), now())
                    RETURNING billing_profile_id
                    """
                )
                res = await session.execute(insert_sql, {
                    'uni_id': sub.uni_id,
                    'contact_name': bp.contact_name,
                    'contact_email': bp.contact_email,
                    'address_line1': bp.address_line1,
                    'address_line2': bp.address_line2,
                    'city': bp.city,
                    'state_province': bp.state_province,
                    'postal_code': bp.postal_code,
                    'country': bp.country,
                    'vat_number': bp.vat_number
                })
                row = res.fetchone()
                if row:
                    billing_id = row[0]

            # Insert payment_method if provided
            if payload and payload.payment_method:
                pm = payload.payment_method
                insert_pm = text(
                    """
                    INSERT INTO payment_method
                    (uni_id, provider, provider_payment_method_id, type, card_brand, card_last4, card_exp_month, card_exp_year, billing_profile_id, is_default, metadata, created_at)
                    VALUES (:uni_id, :provider, :provider_payment_method_id, :type, :card_brand, :card_last4, :card_exp_month, :card_exp_year, :billing_profile_id, :is_default, '{}'::jsonb, now())
                    RETURNING payment_method_id
                    """
                )
                res2 = await session.execute(insert_pm, {
                    'uni_id': sub.uni_id,
                    'provider': pm.provider,
                    'provider_payment_method_id': pm.provider_payment_method_id,
                    'type': pm.type,
                    'card_brand': pm.card_brand,
                    'card_last4': pm.card_last4,
                    'card_exp_month': pm.card_exp_month,
                    'card_exp_year': pm.card_exp_year,
                    'billing_profile_id': billing_id,
                    'is_default': pm.is_default or False
                })
                row2 = res2.fetchone()
                if row2:
                    payment_method_id = row2[0]

            # mark subscription active
            sub.status = 'active'
            session.add(sub)

            # Create a simulated payment transaction record (amount from plan)
            # fetch plan for price
            plan_res = await session.execute(select(Plan).where(Plan.plan_key == sub.plan_key))
            plan = plan_res.scalar_one_or_none()
            amount = 0
            if plan:
                amount = plan.monthly_price if sub.billing_cycle == 'monthly' else plan.yearly_price

            insert_tx = text(
                """
                INSERT INTO payment_transaction
                (subscription_id, uni_id, provider, provider_payment_id, amount_cents, currency, status, description, created_at)
                VALUES (:subscription_id, :uni_id, :provider, :provider_payment_id, :amount_cents, :currency, :status, :description, now())
                RETURNING payment_id
                """
            )
            provider_name = payload.payment_method.provider if (payload and payload.payment_method) else 'manual'
            provider_payment_id = payload.payment_method.provider_payment_method_id if (payload and payload.payment_method) else f'simulated_{subscription_id}'
            res3 = await session.execute(insert_tx, {
                'subscription_id': sub.subscription_id,
                'uni_id': sub.uni_id,
                'provider': provider_name,
                'provider_payment_id': provider_payment_id,
                'amount_cents': int(amount) * 100,
                'currency': 'USD',
                'status': 'succeeded',
                'description': f'Initial charge for subscription {sub.subscription_id}'
            })
            # commit all
            await session.commit()
            await session.refresh(sub)
        except Exception as e:
            await session.rollback()
            raise HTTPException(status_code=500, detail=str(e))

        # Build plan detail for response
        plan_detail = PlanDetail(
            plan_key=plan.plan_key,
            name=plan.name,
            description=plan.description,
            monthly_price=plan.monthly_price,
            yearly_price=plan.yearly_price,
            instructors=plan.instructors,
            students=plan.students,
            storage=plan.storage,
            features=getattr(plan, 'features', None)
        ) if plan else None

        return SubscriptionOut(
            subscription_id=sub.subscription_id,
            uni_id=sub.uni_id,
            plan=plan_detail,
            billing_cycle=sub.billing_cycle,
            status=sub.status,
            created_at=sub.created_at
        )
