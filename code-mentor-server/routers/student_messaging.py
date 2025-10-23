import logging
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import async_session
from auth.dependencies import login_required
from models import Conversation, Instructor, Student
from datetime import datetime
from sqlalchemy import text

router = APIRouter()

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

@router.get("/student/conversations", response_model=list[dict])
async def get_student_conversations(token: dict = Depends(login_required)):
    user_id = token.get("user_id")
    logging.info(f"Fetching conversations for user_id: {user_id}")
    async with async_session() as session:
        result = await session.execute(
            select(Conversation).where(
                text("conversation.participants @> :user_id")
            ).params(user_id=f'[{{"user_id": {user_id}}}]')
        )
        conversations = result.scalars().all()
        logging.info(f"Found {len(conversations)} conversations for user_id: {user_id}")

        return [
            {
                "conversation_id": conversation.conversation_id,
                "name": conversation.name,
                "is_group": conversation.is_group,
                "created_at": conversation.created_at.isoformat(),
                "participants": conversation.participants,
                "messages": conversation.messages,
            }
            for conversation in conversations
        ]

@router.post("/student/conversations/{conversation_id}/messages")
async def add_student_message(
    conversation_id: int,
    message_data: dict,
    token: dict = Depends(login_required)
):
    sender_id = token.get("user_id")
    logging.info(f"Adding message to conversation_id: {conversation_id} by sender_id: {sender_id}")
    try:
        async with async_session() as session:
            # Fetch the conversation
            conversation = await session.get(Conversation, conversation_id)
            if not conversation:
                logging.warning(f"Conversation not found: {conversation_id}")
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

            logging.info(f"Message added successfully to conversation_id: {conversation_id}")
            return new_message
    except Exception as e:
        logging.error(f"Error adding message to conversation_id {conversation_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/student/conversations/{conversation_id}/messages", response_model=list[dict])
async def get_student_messages(conversation_id: int):
    logging.info(f"Fetching messages for conversation_id: {conversation_id}")
    try:
        async with async_session() as session:
            conversation = await session.get(Conversation, conversation_id)
            if not conversation:
                logging.warning(f"Conversation not found: {conversation_id}")
                raise HTTPException(status_code=404, detail="Conversation not found")
            
            # Ensure messages is always an array and convert `sent_at` to string
            formatted_messages = [
                {
                    **message,
                    "sent_at": message["sent_at"] if isinstance(message["sent_at"], str) else message["sent_at"].isoformat()
                }
                for message in (conversation.messages or [])
            ]
            logging.info(f"Found {len(formatted_messages)} messages for conversation_id: {conversation_id}")
            return formatted_messages
    except Exception as e:
        logging.error(f"Error fetching messages for conversation_id {conversation_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/student/users", response_model=list[dict])
async def get_users(token: dict = Depends(login_required)):
    logging.info("Fetching users from the database")
    async with async_session() as session:
        instructors_result = await session.execute(select(Instructor))
        instructors = instructors_result.scalars().all()
        students_result = await session.execute(select(Student))
        students = students_result.scalars().all()

        return [
            {"id": instructor.instructor_id, "name": instructor.instructor_name, "role": "Instructor"}
            for instructor in instructors
        ] + [
            {"id": student.student_id, "name": student.student_name, "role": "Student"}
            for student in students
        ]

@router.post("/student/conversations")
async def create_student_conversation(
    conversation_data: dict,
    token: dict = Depends(login_required)
):
    user_id = token.get("user_id")
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
        return {
            "conversation_id": new_conversation.conversation_id,
            "name": new_conversation.name,
            "created_at": new_conversation.created_at.isoformat(),
        }