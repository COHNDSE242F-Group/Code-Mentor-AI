from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import async_session
from models import Conversation, ConversationParticipant, Message
from pydantic import BaseModel
from typing import List

router = APIRouter()

class ConversationOut(BaseModel):
    conversation_id: int
    name: str
    is_group: bool
    created_at: str

    class Config:
        orm_mode = True

class MessageOut(BaseModel):
    message_id: int
    text: str
    sender_id: int
    sent_at: str

    class Config:
        orm_mode = True
from datetime import datetime

@router.get("/conversations", response_model=List[ConversationOut])
async def get_conversations(user_id: int):
    async with async_session() as session:
        result = await session.execute(
            select(Conversation).join(ConversationParticipant).where(ConversationParticipant.user_id == user_id)
        )
        conversations = result.scalars().all()
        # Convert datetime to string
        return [
            {
                "conversation_id": conv.conversation_id,
                "name": conv.name,
                "is_group": conv.is_group,
                "created_at": conv.created_at.isoformat() if isinstance(conv.created_at, datetime) else conv.created_at,
            }
            for conv in conversations
        ]
@router.get("/conversations/{conversation_id}/messages", response_model=List[MessageOut])
async def get_messages(conversation_id: int):
    async with async_session() as session:
        result = await session.execute(
            select(Message).where(Message.conversation_id == conversation_id).order_by(Message.sent_at)
        )
        messages = result.scalars().all()
        # Convert datetime to string
        return [
            {
                "message_id": msg.message_id,
                "text": msg.text,
                "sender_id": msg.sender_id,
                "sent_at": msg.sent_at.isoformat() if isinstance(msg.sent_at, datetime) else msg.sent_at,
            }
            for msg in messages
        ]
@router.post("/conversations/{conversation_id}/messages", response_model=MessageOut)
async def send_message(conversation_id: int, text: str, sender_id: int):
    async with async_session() as session:
        message = Message(conversation_id=conversation_id, text=text, sender_id=sender_id)
        session.add(message)
        await session.commit()
        await session.refresh(message)
        return message