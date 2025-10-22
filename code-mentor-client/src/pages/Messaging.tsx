import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Card from '../components/ui/Card';
import { 
  SearchIcon, PaperclipIcon, SendIcon, SmileIcon, PlusIcon, PhoneIcon, VideoIcon 
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  avatar?: string | null;
  isGroup?: boolean;
}

interface Message {
  id: number;
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
}



const UsersIcon = ({ size, className }: { size: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const Messaging: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
const [users, setUsers] = useState<{ id: number; name: string; role: string }[]>([]);

useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    fetch("http://localhost:8000/conversations", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch conversations");
        }
        return res.json();
      })
      .then(data => {
        const formattedData = data.map((conversation: any) => ({
          id: conversation.conversation_id,
          name: conversation.name || "Unnamed Conversation",
          messages: conversation.messages || [],
          participants: conversation.participants || [],
          time: conversation.created_at,
          unread: 0,
          online: false,
        }));
        setConversations(formattedData);
      })
      .catch(err => console.error(err));
  }
}, []);

useEffect(() => {
  if (!activeConversation) return;

  fetch(`http://localhost:8000/conversations/${activeConversation.id}/messages`)
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        setMessages(data);
      } else {
        setMessages([]); // Fallback to an empty array if the response is invalid
      }
    })
    .catch(err => {
      console.error(err);
      setMessages([]); // Fallback to an empty array in case of an error
    });
}, [activeConversation]);

const handleSendMessage = async (e: FormEvent) => {
  e.preventDefault();
  if (!activeConversation || !newMessage.trim()) return;

  const token = localStorage.getItem("token");

  const payloadData = {
    text: newMessage, // Ensure the payload matches the backend's expectations
  };

  try {
    const res = await fetch(`http://localhost:8000/conversations/${activeConversation.id}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
      body: JSON.stringify(payloadData), // Send the correct payload
    });

    if (!res.ok) {
      throw new Error("Failed to send message");
    }

    const savedMessage = await res.json();

    // Update the messages state with the new message
    setMessages(prev => [...prev, {
      id: savedMessage.message_id,
      sender: token ? JSON.parse(atob(token.split(".")[1])).user_id : null, // Sender ID from token
      text: savedMessage.text,
      time: savedMessage.sent_at,
      isMe: true, // Mark as sent by the current user
    }]);

    // Clear the input field
    setNewMessage("");
  } catch (err) {
    console.error("Failed to send message:", err);
  }
};
  const handleEmojiClick = (emojiData: any) => {
    setNewMessage((prev) => prev + emojiData.emoji); // Add the selected emoji to the message
  };
  const handleConversationClick = (conversation: Conversation) => {
  console.log("Selected conversation:", conversation); // Log the selected conversation
  setActiveConversation(conversation);
};
//fetch users when clcik new msg
useEffect(() => {
  if (showNewMessageModal) {
    fetch("http://localhost:8000/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  }
}, [showNewMessageModal]);


const handleUserSelect = async (user: { id: number; name: string; role: string }) => {
  console.log("Selected user:", user);

  const token = localStorage.getItem("token"); // Retrieve the token from localStorage

  try {
    // Send a request to the backend to create a new conversation
    const res = await fetch("http://localhost:8000/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
      body: JSON.stringify({
        name: user.name,
        participants: [{ user_id: user.id }], // Add the selected user's ID
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to create a new conversation");
    }

    const newConversation = await res.json();

    // Update the conversation list with the new conversation
    setConversations(prev => [...prev, {
      id: newConversation.conversation_id,
      name: newConversation.name,
      lastMessage: "",
      time: newConversation.created_at,
      unread: 0,
      online: false,
      avatar: null,
      isGroup: false,
    }]);

    // Set the new conversation as active
    setActiveConversation({
      id: newConversation.conversation_id,
      name: newConversation.name,
      lastMessage: "",
      time: newConversation.created_at,
      unread: 0,
      online: false,
      avatar: null,
      isGroup: false,
    });

    // Close the modal
    setShowNewMessageModal(false);
  } catch (err) {
    console.error("Failed to create a new conversation:", err);
  }
};
const NewMessageModal = () => (
  <div className="absolute bottom-12 left-0 bg-white rounded-lg shadow-lg p-4 w-80 border border-gray-300">
    <h2 className="text-lg font-bold mb-2">Select a User</h2>
    <div className="max-h-60 overflow-y-auto">
      <ul className="space-y-2">
        {users.map(user => (
          <li
            key={user.id}
            className="p-2 border rounded cursor-pointer hover:bg-gray-100"
            onClick={() => handleUserSelect(user)}
          >
            {user.name} ({user.role})
          </li>
        ))}
      </ul>
    </div>
    <button
      className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-full"
      onClick={() => setShowNewMessageModal(false)}
    >
      Cancel
    </button>
  </div>
);
return (
  <div className="w-full">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-800">Messaging</h1>
      <p className="text-gray-500">Communicate with students and other instructors</p>
    </div>
    <Card className="p-0 overflow-hidden">
      <div className="flex h-[calc(100vh-240px)] min-h-[500px]">
        {/* Conversations List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent"
              />
              <SearchIcon size={18} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map(conversation => (
              <div
                key={conversation.id}
                className={`flex items-center p-4 border-b border-gray-100 cursor-pointer ${
                  activeConversation?.id === conversation.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => handleConversationClick(conversation)}
              >
                <div className="relative mr-3">
                  {conversation.avatar ? (
                    <img src={conversation.avatar} alt={conversation.name} className="w-10 h-10 rounded-full" />
                  ) : conversation.isGroup ? (
                    <div className="w-10 h-10 rounded-full bg-[#FFC107] flex items-center justify-center text-white">
                      <UsersIcon size={20} />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#0D47A1] flex items-center justify-center text-white">
                      {conversation.name.charAt(0)}
                    </div>
                  )}
                  {conversation.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-900 truncate">{conversation.name}</h3>
                    <span className="text-xs text-gray-500">{conversation.time}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                </div>
                {conversation.unread > 0 && (
                  <div className="ml-2 bg-[#0D47A1] text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                    {conversation.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200">
            <button
              className="flex items-center justify-center w-full px-4 py-2 bg-[#0D47A1] text-white rounded-md hover:bg-blue-800"
              onClick={() => setShowNewMessageModal(true)}
            >
              <PlusIcon size={16} className="mr-2" />
              New Message
            </button>
          </div>
        </div>

        {/* Active Conversation */}
        <div className="w-2/3 flex flex-col">
          {activeConversation ? (
            <>
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#0D47A1] flex items-center justify-center text-white">
                    {activeConversation.name ? activeConversation.name.charAt(0) : "?"}
                  </div>
                  <div>
                    <h3 className="font-medium">{activeConversation.name}</h3>
                    <p className={`text-xs ${activeConversation.online ? 'text-green-500' : 'text-gray-500'}`}>
                      {activeConversation.online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <PhoneIcon size={18} className="text-gray-600" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <VideoIcon size={18} className="text-gray-600" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100">
                    <SearchIcon size={18} className="text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                <div className="space-y-4">
                  {messages.length > 0 ? (
                    messages.map(message => (
                      <div key={message.id} className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}>
                        {!message.isMe && (
                          <div className="w-8 h-8 rounded-full bg-[#0D47A1] flex items-center justify-center text-white mr-2 mt-1">
                            {message.sender.charAt(0)}
                          </div>
                        )}
                        <div
                          className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                            message.isMe ? 'bg-[#0D47A1] text-white' : 'bg-white border border-gray-200'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className={`text-xs mt-1 ${message.isMe ? 'text-blue-100' : 'text-gray-500'}`}>
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No messages yet.</p>
                  )}
                </div>
              </div>
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                <div className="flex items-end">
                  <button type="button" className="p-2 text-gray-500 hover:text-gray-700">
                    <PaperclipIcon size={20} />
                  </button>
                  <div className="flex-1 mx-2">
                    <textarea
                      placeholder="Type a message..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent resize-none"
                      rows={2}
                      value={newMessage}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewMessage(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <button
                      type="button"
                      className="p-2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)} // Toggle emoji picker
                    >
                      <SmileIcon size={20} />
                    </button>
                    {showEmojiPicker && (
                      <div className="absolute bottom-12 right-0 z-10">
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="ml-2 p-2 bg-[#0D47A1] text-white rounded-full hover:bg-blue-800"
                  >
                    <SendIcon size={18} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a conversation
            </div>
          )}
        </div>
      </div>
    </Card>

      {/* Render Modal */}
      {showNewMessageModal && <NewMessageModal />}
  </div>
  );
  
  };

export default Messaging;