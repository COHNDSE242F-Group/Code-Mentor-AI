import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Card from '../components/ui/Card';
import { fetchWithAuth } from '../utils/auth';

interface Conversation {
  conversation_id: number;
  name: string;
  is_group: boolean;
  created_at: string;
  participants: any[];
  messages: any[];
}

interface Message {
  message_id: number;
  sender_id: number;
  text: string;
  sent_at: string;
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
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetchWithAuth("http://localhost:8000/student-get/get-conversations");
        if (!res.ok) {
          throw new Error("Failed to fetch conversations");
        }
        const data = await res.json();
        setConversations(data);
      } catch (err) {
        console.error(err);
        alert("An error occurred while fetching conversations. Please try again.");
      }
    };
    fetchConversations();
  }, []);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (!activeConversation) return;

    const fetchMessages = async () => {
      try {
        const res = await fetchWithAuth(
          `http://localhost:8000/student/conversations/${activeConversation.conversation_id}/messages`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch messages");
        }
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, [activeConversation]);

  // Fetch users for new conversation modal
  useEffect(() => {
    if (showNewMessageModal) {
      const fetchUsers = async () => {
        try {
          const res = await fetchWithAuth("http://localhost:8000/get-student/users");
          if (!res.ok) {
            throw new Error(`Failed to fetch users: ${res.status} ${res.statusText}`);
          }
          const data = await res.json();
          if (Array.isArray(data)) {
            setUsers(data);
          } else {
            console.error("Invalid response format:", data);
            setUsers([]);
          }
        } catch (err) {
          console.error("Error fetching users:", err);
          alert("An error occurred while fetching users. Please try again.");
          setUsers([]);
        }
      };
      fetchUsers();
    }
  }, [showNewMessageModal]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!activeConversation || !newMessage.trim()) return;

    try {
      const res = await fetchWithAuth(
        `http://localhost:8000/student/add-conversations/${activeConversation.conversation_id}/messages`,
        {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: newMessage }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      const savedMessage = await res.json();
      
      // Add the new message to the local state
      setMessages(prev => [...prev, savedMessage]);
      setNewMessage("");
      
      // Update the conversations list to show the latest message
      setConversations(prev => 
        prev.map(conv => 
          conv.conversation_id === activeConversation.conversation_id
            ? {
                ...conv,
                messages: [...(conv.messages || []), savedMessage]
              }
            : conv
        )
      );
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Failed to send message. Please try again.");
    }
  };

  const handleUserSelect = async (user: User) => {
    try {
      const res = await fetchWithAuth("http://localhost:8000/student/conversations", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: user.name,
          participants: [{ user_id: user.id }],
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create conversation");
      }

      const newConversation = await res.json();
      
      // Add the new conversation to the list
      setConversations(prev => [...prev, newConversation]);
      
      // Set it as active
      setActiveConversation(newConversation);
      setShowNewMessageModal(false);
    } catch (err) {
      console.error("Failed to create conversation:", err);
      alert("Failed to create conversation. Please try again.");
    }
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get last message for display in conversation list
  const getLastMessage = (conversation: Conversation) => {
    if (!conversation.messages || conversation.messages.length === 0) {
      return "No messages yet";
    }
    return conversation.messages[conversation.messages.length - 1].text;
  };

  // Get last message time for display
  const getLastMessageTime = (conversation: Conversation) => {
    if (!conversation.messages || conversation.messages.length === 0) {
      return conversation.created_at;
    }
    return conversation.messages[conversation.messages.length - 1].sent_at;
  };

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
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent"
                value={searchQuery}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map(conversation => (
                <div
                  key={conversation.conversation_id}
                  className={`flex items-center p-4 border-b border-gray-100 cursor-pointer ${
                    activeConversation?.conversation_id === conversation.conversation_id ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveConversation(conversation)}
                >
                  <div className="w-10 h-10 rounded-full bg-[#0D47A1] flex items-center justify-center text-white">
                    {conversation.name.charAt(0)}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{conversation.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{getLastMessage(conversation)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200">
              <button
                className="w-full p-3 bg-[#0D47A1] text-white rounded-md hover:bg-blue-800 transition-colors"
                onClick={() => setShowNewMessageModal(true)}
              >
                New Message
              </button>
            </div>
          </div>

          {/* Active Conversation */}
          <div className="w-2/3 flex flex-col">
            {activeConversation ? (
              <>
                <div className="p-4 border-b border-gray-200 bg-white">
                  <h3 className="font-medium text-lg">{activeConversation.name}</h3>
                </div>
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                  {messages.map(message => {
                    const token = localStorage.getItem("token");
                    const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;
                    const isMe = payload && message.sender_id === payload.user_id;
                    
                    return (
                      <div key={message.message_id} className={`flex mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-xs lg:max-w-md rounded-lg p-3 ${
                            isMe 
                              ? 'bg-[#0D47A1] text-white rounded-br-none' 
                              : 'bg-white border border-gray-200 rounded-bl-none'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className={`text-xs mt-1 ${isMe ? 'text-blue-100' : 'text-gray-500'}`}>
                            {new Date(message.sent_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:border-transparent"
                      value={newMessage}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
                    />
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-[#0D47A1] text-white rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50"
                      disabled={!newMessage.trim()}
                    >
                      Send
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-96 overflow-hidden flex flex-col">
            <h2 className="text-lg font-bold mb-4">Select an Instructor</h2>
            <div className="flex-1 overflow-y-auto">
              {users.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No instructors found</p>
              ) : (
                <ul className="space-y-2">
                  {users.map(user => (
                    <li
                      key={user.id}
                      className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleUserSelect(user)}
                    >
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.role}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              className="mt-4 w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
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