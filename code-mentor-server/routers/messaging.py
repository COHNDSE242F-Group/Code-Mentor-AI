from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import async_session
from models import Conversation
from pydantic import BaseModel
from typing import List
from sqlalchemy import text

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
async def get_conversations(user_id: int):
    async with async_session() as session:
        result = await session.execute(
            select(Conversation).where(
              text("conversation.participants @> :user_id")
            ).params(user_id=f'[{{"user_id": {user_id}}}]')
        )
        return result.scalars().all()
    

#@router.get("/conversations/{conversation_id}/messages", response_model=List[MessageOut])
#async def get_messages(conversation_id: int):
 #   async with async_session() as session:
  #      result = await session.execute(
   #         select(Message).where(Message.conversation_id == conversation_id).order_by(Message.sent_at)
    #    )
    #   messages = result.scalars().all()
     #   # Convert datetime to string
      #  return [
       #     {
        #        "message_id": msg.message_id,
         #       "text": msg.text,
          ##     "sent_at": msg.sent_at.isoformat() if isinstance(msg.sent_at, datetime) else msg.sent_at,
            #}
            #for msg in messages
        #]
        
@router.post("/conversations/{conversation_id}/messages")
async def add_message(conversation_id: int, sender_id: int, text: str):
    async with async_session() as session:
        conversation = await session.get(Conversation, conversation_id)
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        new_message = {
            "message_id": len(conversation.messages) + 1,
            "sender_id": sender_id,
            "text": text,
            "sent_at": datetime.utcnow().isoformat()
        }
        conversation.messages.append(new_message)
        session.add(conversation)
        await session.commit()
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