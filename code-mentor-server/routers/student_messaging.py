import logging
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import async_session
from models import Conversation, Instructor, Student
from datetime import datetime
from sqlalchemy import text
from pydantic import BaseModel
from typing import List
from auth.auth import verify_token  # Import the token verification dependency
from auth.dependencies import role_required

router = APIRouter()

# Configure logging for student messaging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - STUDENT - %(levelname)s - %(message)s")

class ConversationOut(BaseModel):
    conversation_id: int
    name: str
    is_group: bool
    created_at: str
    participants: List[dict]
    messages: List[dict]

    class Config:
        orm_mode = True

class MessageIn(BaseModel):
    text: str

@router.get("/student/conversations", response_model=List[ConversationOut])
async def get_conversations(token: dict = Depends(verify_token)):  # Add token verification
    user_id = token["user_id"]  # Extract user_id from token
    logging.info(f"Token received: {token}")
    logging.info(f"Fetching conversations for user_id: {user_id}")
    async with async_session() as session:
        result = await session.execute(select(Conversation))
        conversations = result.scalars().all()

        formatted_conversations = [
            {
                **conversation.__dict__,
                "created_at": conversation.created_at.isoformat()
            }
            for conversation in conversations
        ]
        logging.info(f"Found {len(formatted_conversations)} conversations")
        return formatted_conversations
    

@router.post("/student/conversations/{conversation_id}/messages")
async def add_message(conversation_id: int, message_data: MessageIn, token: dict = Depends(verify_token)):  # Add token verification
    sender_id = token["user_id"]  # Extract user_id from token
    logging.info(f"Adding message to conversation_id: {conversation_id} by sender_id: {sender_id}")
    async with async_session() as session:
        conversation = await session.get(Conversation, conversation_id)
        if not conversation:
            logging.warning(f"Conversation not found: {conversation_id}")
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        new_message = {
            "message_id": len(conversation.messages) + 1,
            "sender_id": sender_id,
            "text": message_data.text,
            "sent_at": datetime.utcnow().isoformat()
        }

        if not conversation.messages:
            conversation.messages = []
        conversation.messages.append(new_message)

        session.add(conversation)
        await session.commit()
        await session.refresh(conversation)

        logging.info(f"Message added successfully to conversation_id: {conversation_id}")
        return new_message


@router.get("/student/conversations/{conversation_id}/messages", response_model=List[dict])
async def get_messages(conversation_id: int, token: dict = Depends(verify_token)):  # Add token verification
    user_id = token["user_id"]  # Extract user_id from token
    logging.info(f"Fetching messages for conversation_id: {conversation_id} by user_id: {user_id}")
    async with async_session() as session:
        conversation = await session.get(Conversation, conversation_id)
        if not conversation:
            logging.warning(f"Conversation not found: {conversation_id}")
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        formatted_messages = [
            {
                **message,
                "sent_at": message["sent_at"] if isinstance(message["sent_at"], str) else message["sent_at"].isoformat()
            }
            for message in (conversation.messages or [])
        ]
        logging.info(f"Found {len(formatted_messages)} messages for conversation_id: {conversation_id}")
        return formatted_messages
    
@router.get("/student/users", response_model=List[dict])
async def get_users():
  
    async with async_session() as session:
        try:
            instructors_result = await session.execute(select(Instructor))
            instructors = instructors_result.scalars().all()
            students_result = await session.execute(select(Student))
            students = students_result.scalars().all()

            users = [
                {"id": instructor.instructor_id, "name": instructor.instructor_name, "role": "Instructor"}
                for instructor in instructors
            ] + [
                {"id": student.student_id, "name": student.student_name, "role": "Student"}
                for student in students
            ]
            logging.info(f"Found {len(users)} users")
            return users
        except Exception as e:
            logging.error(f"Error fetching users: {e}")
            raise HTTPException(status_code=500, detail="Internal server error")



@router.post("/student/conversations")
async def create_conversation(conversation_data: dict, token: dict = Depends(verify_token)):  # Add token verification
    user_id = token["user_id"]  # Extract user_id from token
    logging.info(f"Creating a new conversation for user_id: {user_id}")
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
        logging.info(f"Conversation created successfully with ID: {new_conversation.conversation_id}")
        return {
            "conversation_id": new_conversation.conversation_id,
            "name": new_conversation.name,
            "created_at": new_conversation.created_at.isoformat(),
        }

@router.get("/student/conversations")
async def get_conversations():
    logging.info("Fetching conversations for student")
    async with async_session() as session:
        result = await session.execute(select(Conversation))
        conversations = result.scalars().all()

        formatted_conversations = [
            {
                "id": conversation.conversation_id,
                "name": conversation.name or "Unnamed Conversation",
                "lastMessage": conversation.messages[-1].text if conversation.messages else "",
                "time": conversation.messages[-1].sent_at if conversation.messages else conversation.created_at,
                "unread": 0,
                "online": False,
            }
            for conversation in conversations
        ]
        logging.info(f"Found {len(formatted_conversations)} conversations")
        return formatted_conversations