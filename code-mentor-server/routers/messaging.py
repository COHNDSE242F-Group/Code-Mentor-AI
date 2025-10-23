from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import async_session
from models import Conversation
from pydantic import BaseModel
from typing import List
from sqlalchemy import text
from models import Instructor, Student,Conversation
from auth.auth import verify_token
from datetime import datetime
from fastapi import HTTPException

router = APIRouter()

class ConversationOut(BaseModel):
    conversation_id: int
    name: str
    is_group: bool
    created_at: str
    participants: List[dict]
    messages: List[dict]

    class Config:
        orm_mode = True

from datetime import datetime
@router.get("/conversations", response_model=List[ConversationOut])
async def get_conversations(token: str = Depends(verify_token)):
    user_id = token["user_id"]  # Extract user_id from token
    async with async_session() as session:
        result = await session.execute(
            select(Conversation).where(
                text("conversation.participants @> :user_id")
            ).params(user_id=f'[{{"user_id": {user_id}}}]')
        )
        conversations = result.scalars().all()

        # Convert `created_at` to string for each conversation
        formatted_conversations = [
            {
                **conversation.__dict__,
                "created_at": conversation.created_at.isoformat()  # Convert datetime to ISO format string
            }
            for conversation in conversations
        ]
        return formatted_conversations
class MessageIn(BaseModel):
    text: str



@router.post("/conversations/{conversation_id}/messages")
async def add_message(
    conversation_id: int,
    message_data: dict,  # Expecting {"text": "message content"}
    token: dict = Depends(verify_token)
):
    sender_id = token["user_id"]  # Extract user_id from token
    async with async_session() as session:
        # Fetch the conversation
        conversation = await session.get(Conversation, conversation_id)
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        # Create a new message
        new_message = {
            "message_id": len(conversation.messages) + 1,  # Increment message ID
            "sender_id": sender_id,
            "text": message_data["text"],
            "sent_at": datetime.utcnow().isoformat()  # Use ISO format for timestamps
        }

        # Append the new message to the conversation's messages
        if not conversation.messages:
            conversation.messages = []  # Initialize messages as an empty list if it's None
        conversation.messages.append(new_message)

        # Save the updated conversation
        session.add(conversation)
        await session.commit()
        await session.refresh(conversation)

        return new_message

@router.get("/users", response_model=List[dict])
async def get_users():
    async with async_session() as session:
        # Fetch instructors
        instructors_result = await session.execute(select(Instructor))
        instructors = instructors_result.scalars().all()

        # Fetch students
        students_result = await session.execute(select(Student))
        students = students_result.scalars().all()

        # Combine and format the results
        users = [
            {"id": instructor.instructor_id, "name": instructor.instructor_name, "role": "Instructor"}
            for instructor in instructors
        ] + [
            {"id": student.student_id, "name": student.student_name, "role": "Student"}
            for student in students
        ]
        return users
    
@router.post("/conversations")
async def create_conversation(
    conversation_data: dict,
    token: dict = Depends(verify_token)
):
    user_id = token["user_id"]  # Extract user_id from token
    async with async_session() as session:
        new_conversation = Conversation(
            name=conversation_data["name"],
            participants=[{"user_id": user_id}, *conversation_data["participants"]],
            created_at=datetime.utcnow(),
            messages=[]
        )
        session.add(new_conversation)
        await session.commit()
        await session.refresh(new_conversation)
        return new_conversation

@router.get("/conversations/{conversation_id}/messages", response_model=List[dict])
async def get_messages(conversation_id: int):
    async with async_session() as session:
        conversation = await session.get(Conversation, conversation_id)
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        # Ensure messages is always an array
        return conversation.messages if conversation.messages else []
    
@router.get("/conversations/{conversation_id}/messages", response_model=List[dict])
async def get_messages(conversation_id: int):
    async with async_session() as session:
        conversation = await session.get(Conversation, conversation_id)
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        # Ensure messages is always an array and convert `sent_at` to string
        formatted_messages = [
            {
                **message,
                "sent_at": message["sent_at"] if isinstance(message["sent_at"], str) else message["sent_at"].isoformat()
            }
            for message in (conversation.messages or [])
        ]
        return formatted_messages

