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
from auth.auth import verify_token

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

@router.get("/student-get/get-conversations", response_model=List[ConversationOut])
async def get_student_conversations(token: dict = Depends(verify_token)):
    user_id = token["user_id"]
    logging.info(f"Fetching conversations for student user_id: {user_id}")
    
    async with async_session() as session:
        # Get all conversations
        result = await session.execute(select(Conversation))
        all_conversations = result.scalars().all()
        
        # Filter conversations where the student is a participant
        student_conversations = []
        for conversation in all_conversations:
            # Check if user_id exists in participants
            participant_ids = [participant["user_id"] for participant in conversation.participants]
            if user_id in participant_ids:
                student_conversations.append(conversation)
        
        # Format the response
        formatted_conversations = []
        for conversation in student_conversations:
            # Get instructor name for conversation display
            instructor_id = None
            for participant in conversation.participants:
                if participant["user_id"] != user_id:  # Find the other participant (instructor)
                    instructor_id = participant["user_id"]
                    break
            
            instructor_name = "Instructor"
            if instructor_id:
                # Fetch instructor details
                instructor_result = await session.execute(
                    select(Instructor).where(Instructor.instructor_id == instructor_id)
                )
                instructor = instructor_result.scalar_one_or_none()
                if instructor:
                    instructor_name = instructor.instructor_name
            
            formatted_conversations.append({
                "conversation_id": conversation.conversation_id,
                "name": instructor_name,  # Use instructor name as conversation name
                "is_group": conversation.is_group,
                "created_at": conversation.created_at.isoformat(),
                "participants": conversation.participants,
                "messages": conversation.messages or []
            })
        
        logging.info(f"Found {len(formatted_conversations)} conversations for student {user_id}")
        return formatted_conversations

@router.post("/student/add-conversations/{conversation_id}/messages")
async def add_student_message(conversation_id: int, message_data: MessageIn, token: dict = Depends(verify_token)):
    sender_id = token["user_id"]
    logging.info(f"Student {sender_id} adding message to conversation {conversation_id}")
    
    async with async_session() as session:
        # Verify the conversation exists and student is a participant
        conversation = await session.get(Conversation, conversation_id)
        if not conversation:
            logging.warning(f"Conversation not found: {conversation_id}")
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        # Check if student is a participant
        participant_ids = [participant["user_id"] for participant in conversation.participants]
        if sender_id not in participant_ids:
            logging.warning(f"Student {sender_id} is not a participant in conversation {conversation_id}")
            raise HTTPException(status_code=403, detail="Not authorized to send messages in this conversation")
        
        # Create new message
        new_message = {
            "message_id": len(conversation.messages) + 1 if conversation.messages else 1,
            "sender_id": sender_id,
            "text": message_data.text,
            "sent_at": datetime.utcnow().isoformat()
        }

        # Initialize messages array if None
        if conversation.messages is None:
            conversation.messages = []
        
        conversation.messages.append(new_message)
        
        # Update conversation
        session.add(conversation)
        await session.commit()
        await session.refresh(conversation)

        logging.info(f"Message added successfully to conversation {conversation_id}")
        return new_message

@router.get("/student/conversations/{conversation_id}/messages", response_model=List[dict])
async def get_student_messages(conversation_id: int, token: dict = Depends(verify_token)):
    user_id = token["user_id"]
    logging.info(f"Student {user_id} fetching messages from conversation {conversation_id}")
    
    async with async_session() as session:
        conversation = await session.get(Conversation, conversation_id)
        if not conversation:
            logging.warning(f"Conversation not found: {conversation_id}")
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        # Check if student is a participant
        participant_ids = [participant["user_id"] for participant in conversation.participants]
        if user_id not in participant_ids:
            logging.warning(f"Student {user_id} is not a participant in conversation {conversation_id}")
            raise HTTPException(status_code=403, detail="Not authorized to view messages in this conversation")
        
        # Format messages
        formatted_messages = []
        for message in (conversation.messages or []):
            formatted_message = {
                "message_id": message.get("message_id"),
                "sender_id": message.get("sender_id"),
                "text": message.get("text"),
                "sent_at": message.get("sent_at")
            }
            # Ensure sent_at is string
            if not isinstance(formatted_message["sent_at"], str):
                formatted_message["sent_at"] = formatted_message["sent_at"].isoformat()
            
            formatted_messages.append(formatted_message)
        
        logging.info(f"Found {len(formatted_messages)} messages for conversation {conversation_id}")
        return formatted_messages

@router.get("/get-student/users", response_model=List[dict])
async def get_instructors_for_student(token: dict = Depends(verify_token)):
    """Get all instructors that a student can message"""
    user_id = token["user_id"]
    logging.info(f"Fetching instructors for student {user_id}")
    
    async with async_session() as session:
        try:
            # Fetch all instructors
            instructors_result = await session.execute(select(Instructor))
            instructors = instructors_result.scalars().all()

            users = [
                {
                    "id": instructor.instructor_id, 
                    "name": instructor.instructor_name, 
                    "role": "Instructor"
                }
                for instructor in instructors
            ] 
            
            logging.info(f"Found {len(users)} instructors")
            return users
        except Exception as e:
            logging.error(f"Error fetching instructors: {e}")
            raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/student/conversations")
async def create_student_conversation(conversation_data: dict, token: dict = Depends(verify_token)):
    student_id = token["user_id"]
    logging.info(f"Student {student_id} creating new conversation")
    
    # Validate input
    if not conversation_data.get("participants") or len(conversation_data["participants"]) < 1:
        raise HTTPException(status_code=400, detail="Participants list must include at least one instructor.")
    
    instructor_id = conversation_data["participants"][0]["user_id"]
    
    async with async_session() as session:
        # Verify instructor exists
        instructor_result = await session.execute(
            select(Instructor).where(Instructor.instructor_id == instructor_id)
        )
        instructor = instructor_result.scalar_one_or_none()
        
        if not instructor:
            raise HTTPException(status_code=404, detail="Instructor not found")
        
        # Check if conversation already exists between this student and instructor
        existing_conversations_result = await session.execute(select(Conversation))
        existing_conversations = existing_conversations_result.scalars().all()
        
        for conv in existing_conversations:
            participant_ids = [p["user_id"] for p in conv.participants]
            if student_id in participant_ids and instructor_id in participant_ids:
                logging.info(f"Conversation already exists: {conv.conversation_id}")
                return {
                    "conversation_id": conv.conversation_id,
                    "name": conv.name,
                    "created_at": conv.created_at.isoformat(),
                    "participants": conv.participants
                }
        
        # Create new conversation
        participants = [
            {"user_id": instructor_id},  # Instructor
            {"user_id": student_id}      # Student
        ]
        
        new_conversation = Conversation(
            name=instructor.instructor_name,  # Use instructor name as conversation name
            participants=participants,
            is_group=False,
            created_at=datetime.utcnow(),
            messages=[]
        )
        
        session.add(new_conversation)
        await session.commit()
        await session.refresh(new_conversation)
        
        logging.info(f"New conversation created with ID: {new_conversation.conversation_id}")
        return {
            "conversation_id": new_conversation.conversation_id,
            "name": new_conversation.name,
            "created_at": new_conversation.created_at.isoformat(),
            "participants": new_conversation.participants
        }