import React, { useState, useEffect, useRef } from 'react';
import { SendIcon, BotIcon, UserIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';
import 'tailwindcss/tailwind.css';

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const AiTutorChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'ai',
      text: "Hi there! I'm your AI coding tutor. How can I help you with your code today?",
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          history: messages.map(m => ({
            role: m.sender === 'ai' ? 'assistant' : 'user',
            content: m.text,
          })),
        }),
      });

      const data = await response.json();

      const aiMessage: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        text: data.reply,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI chat error:', error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 2,
          sender: 'ai',
          text: 'Sorry, something went wrong. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#1e1e2e]">
      {/* Header */}
      <div className="flex items-center px-4 py-3 bg-[#181825] border-b border-[#313244] flex-shrink-0">
        <BotIcon size={18} className="mr-2 text-teal-500" />
        <h2 className="font-medium text-white">AI Tutor</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 break-words ${
                msg.sender === 'user' ? 'bg-teal-600 text-white' : 'bg-[#313244] text-gray-200'
              }`}
            >
              {/* Sender Info */}
              <div className="flex items-center mb-1">
                {msg.sender === 'ai' ? (
                  <BotIcon size={14} className="mr-1.5 text-teal-400" />
                ) : (
                  <UserIcon size={14} className="mr-1.5" />
                )}
                <span className="text-xs font-medium">
                  {msg.sender === 'ai' ? 'AI Tutor' : 'You'}
                </span>
              </div>

              {/* Message Content */}
              {msg.sender === 'ai' ? (
              <ReactMarkdown
                children={msg.text}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  p: ({ children, ...props }) => (
                    <p
                      {...props}
                      className="text-sm text-gray-200 break-words whitespace-pre-wrap"
                    >
                      {children}
                    </p>
                  ),
                  code({ node, inline, className, children, ...props }: any) {
                    if (inline) {
                      return (
                        <code
                          {...props}
                          className={`bg-gray-800 rounded px-1 py-0.5 text-sm ${className || ""}`}
                        >
                          {children}
                        </code>
                      );
                    }
                    return (
                      <pre
                        {...props}
                        className="bg-gray-800 rounded p-2 my-2 overflow-x-auto text-sm"
                      >
                        <code className={className}>{children}</code>
                      </pre>
                    );
                  },
                }}
              />
              ) : (
                <p className="text-sm">{msg.text}</p>
              )}
            </div>
          </div>
        ))}

        {/* AI Typing Indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="w-[80%] rounded-lg px-4 py-2 bg-[#313244] text-gray-200 animate-pulse">
              AI is typing...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 p-4 border-t border-[#313244] bg-[#1e1e2e]">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask for help or guidance..."
            className="flex-1 px-4 py-2 bg-[#181825] border border-[#313244] rounded-l-md text-gray-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={loading}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-r-md transition-colors disabled:opacity-50"
          >
            <SendIcon size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiTutorChat;