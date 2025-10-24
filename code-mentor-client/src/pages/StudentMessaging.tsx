import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Card from '../components/ui/Card';
import { SearchIcon, PaperclipIcon, SendIcon, SmileIcon, PlusIcon } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { fetchWithAuth } from '../utils/auth';

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

interface User {
  id: number;
  name: string;
  role: string;
}

const StudentMessaging: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);

  useEffect(() => {
    fetchWithAuth("http://localhost:8000/student/conversations")
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch conversations");
        }
        return res.json();
      })
      .then(data => setConversations(data))
      .catch(err => {
        console.error(err);
        alert("An error occurred while fetching conversations. Please try again.");
      });
  }, []);

  useEffect(() => {
    if (!activeConversation) return;

    fetchWithAuth(`http://localhost:8000/student/conversations/${activeConversation.id}/messages`)
      .then(res => res.json())
      .then(data => {
        const token = localStorage.getItem("token");
        const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;
        setMessages(data.map((message: any) => ({
          id: message.message_id,
          sender: message.sender_id,
          text: message.text,
          time: message.sent_at,
          isMe: payload && message.sender_id === payload.user_id,
        })));
      })
      .catch(err => console.error(err));
  }, [activeConversation]);

  useEffect(() => {
    if (showNewMessageModal) {
      fetchWithAuth("http://localhost:8000/student/users", {
        method: "GET",
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(`Failed to fetch users: ${res.status} ${res.statusText}`);
          }
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            setUsers(data); // Set users only if the response is an array
          } else {
            console.error("Invalid response format:", data);
            setUsers([]); // Fallback to an empty array
          }
        })
        .catch(err => {
          console.error("Error fetching users:", err);
          alert("An error occurred while fetching users. Please try again.");
          setUsers([]); // Fallback to an empty array
        });
    }
  }, [showNewMessageModal]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!activeConversation || !newMessage.trim()) return;

    try {
      const res = await fetchWithAuth(`http://localhost:8000/student/conversations/${activeConversation.id}/messages`, {
        method: "POST",
        body: JSON.stringify({ text: newMessage }),
      });

      const savedMessage = await res.json();
      const token = localStorage.getItem("token");
      const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;

      setMessages(prev => [...prev, {
        id: savedMessage.message_id,
        sender: payload?.user_id,
        text: savedMessage.text,
        time: savedMessage.sent_at,
        isMe: true,
      }]);

      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleUserSelect = async (user: User) => {
    try {
      const res = await fetchWithAuth("http://localhost:8000/student/conversations", {
        method: "POST",
        body: JSON.stringify({
          name: user.name,
          participants: [{ user_id: user.id }],
        }),
      });

      const newConversation = await res.json();
      setConversations(prev => [...prev, {
        id: newConversation.conversation_id,
        name: newConversation.name,
        lastMessage: "",
        time: newConversation.created_at,
        unread: 0,
        online: false,
      }]);
      setShowNewMessageModal(false);
    } catch (err) {
      console.error("Failed to create conversation:", err);
    }
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-gray-800">Student Messaging</h1>
      <Card className="p-0 overflow-hidden">
        <div className="flex h-[calc(100vh-240px)] min-h-[500px]">
          {/* Conversations List */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent"
                value={searchQuery}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map(conversation => (
                <div
                  key={conversation.id}
                  className={`flex items-center p-4 border-b border-gray-100 cursor-pointer ${
                    activeConversation?.id === conversation.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveConversation(conversation)}
                >
                  <div className="w-10 h-10 rounded-full bg-[#0D47A1] flex items-center justify-center text-white">
                    {conversation.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 truncate">{conversation.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="p-4 bg-[#0D47A1] text-white rounded-md hover:bg-blue-800"
              onClick={() => setShowNewMessageModal(true)}
            >
              New Message
            </button>
          </div>

          {/* Active Conversation */}
          <div className="w-2/3 flex flex-col">
            {activeConversation ? (
              <>
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-medium">{activeConversation.name}</h3>
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                  {messages.map(message => (
                    <div key={message.id} className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-xs rounded-lg p-3 ${
                          message.isMe ? 'bg-[#0D47A1] text-white' : 'bg-white border border-gray-200'
                        }`}
                      >
                        <p>{message.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                  <textarea
                    placeholder="Type a message..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent"
                    value={newMessage}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewMessage(e.target.value)}
                  />
                  <button type="submit" className="p-2 bg-[#0D47A1] text-white rounded-md hover:bg-blue-800">
                    Send
                  </button>
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

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Select a User</h2>
            <ul>
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
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => setShowNewMessageModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentMessaging;