import React, { useRef, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAiStore } from '../store/useAiStore';
import { Send } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const AiChat = () => {
  const { answers, Aimessage } = useAiStore();
  const { authUser } = useAuthStore();
  const [messages, setMessages] = useState([]);

  const bottomRef = useRef(null);

  useEffect(() => {
    if (answers?.message?.candidates?.[0]?.content?.parts?.[0]?.text) {
      const aiText = answers.message.candidates[0].content.parts[0].text;
      setMessages(prev => [...prev, { sender: 'ai', prompt: aiText }]);
    }
  }, [answers]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (msg) => {
    setMessages(prev => [...prev, msg]);
  };

  return (
    <div className="flex flex-col gap-4 p-4 w-full overflow-y-auto max-h-[80vh]">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`chat ${msg.sender === 'user' ? 'chat-end' : 'chat-start'}`}
        >
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img
                alt={`${msg.sender} avatar`}
                src={msg.sender === 'user'?(authUser?.profilePic) : ("/tChat.jpg")}
              />
            </div>
          </div>
          <div className="chat-bubble">{msg.prompt}</div>
        </div>
      ))}
      <div ref={bottomRef} />
      <AiChatInput onNewMessage={addMessage} />
    </div>
  );
};

const AiChatInput = ({ onNewMessage }) => {
  const [prompt, setPrompt] = useState('');
  const { Aimessage } = useAiStore();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const messageText = prompt.trim();
    if (!messageText) return;

    try {
      // Add user message to chat
      onNewMessage({ sender: 'user', prompt: messageText });

      // Send request to Gemini
      await Aimessage(messageText);

      // Clear input
      setPrompt('');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Something went wrong!');
    }
  };

  return (
    <form onSubmit={handleSendMessage} className="flex items-center gap-2 mt-4">
      <input
        type="text"
        className="w-full input input-bordered rounded-lg input-sm sm:input-md"
        placeholder="Type a message..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button type="submit" className="btn btn-sm btn-circle" disabled={!prompt.trim()}>
        <Send size={22} />
      </button>
    </form>
  );
};

export default AiChat;
