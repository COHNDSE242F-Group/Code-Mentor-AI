from fastapi import APIRouter
from pydantic import BaseModel
from typing import List,Optional


router = APIRouter()

class Conversation(BaseModel):
    id: int
    name: str
    lastMessage: str
    time: str
    unread: int
    online: bool
    avatar: Optional[str] = None
    isGroup: bool = False

class Message(BaseModel):
    id: int
    sender: str
    text: str
    time: str
    isMe: bool

# Dummy data for demonstration
conversations_data = [
    {
        "id": 1,
        "name": "Alex Johnson",
        "lastMessage": "See you tomorrow!",
        "time": "10:30 AM",
        "unread": 2,
        "online": True,
        "avatar": None,
        "isGroup": False
    },
    {
        "id": 2,
        "name": "Group Project",
        "lastMessage": "Let's meet at 5 PM.",
        "time": "9:15 AM",
        "unread": 0,
        "online": False,
        "avatar": None,
        "isGroup": True
    }
]

messages_data = {
    1: [
        {
            "id": 1,
            "sender": "Alex Johnson",
            "text": "Hello!",
            "time": "10:00 AM",
            "isMe": False
        },
        {
            "id": 2,
            "sender": "Me",
            "text": "Hi Alex!",
            "time": "10:01 AM",
            "isMe": True
        }
    ],
    2: [
        {
            "id": 1,
            "sender": "Me",
            "text": "Hey team!",
            "time": "9:00 AM",
            "isMe": True
        },
        {
            "id": 2,
            "sender": "Sam",
            "text": "Let's meet at 5 PM.",
            "time": "9:15 AM",
            "isMe": False
        }
    ]
}

@router.get("/conversations", response_model=List[Conversation])
async def get_conversations():
    return conversations_data

@router.get("/conversations/{conversation_id}/messages", response_model=List[Message])
async def get_messages(conversation_id: int):
    return messages_data.get(conversation_id, [])

@router.post("/conversations/{conversation_id}/messages", response_model=Message)
async def send_message(conversation_id: int, message: Message):
    # In a real app, save to DB and generate ID/time
    msg = message.dict()
    msg["id"] = len(messages_data.get(conversation_id, [])) + 1
    msg["time"] = "Now"
    messages_data.setdefault(conversation_id, []).append(msg)
    return msg