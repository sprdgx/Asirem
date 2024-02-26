import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../index.css'

function ChatBot() {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:3000/ask', { question });
      const userMessage = { sender: 'USER', content: question, timestamp: new Date() };
      const botResponse = { sender: 'YAZBOT', content: res.data.answer, timestamp: new Date() };
      setMessages([...messages, userMessage, botResponse]);
      setQuestion('');
    } catch (error) {
      console.error('Error fetching response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-black text-white rounded-lg shadow-lg p-4 backdrop-blur-md bg-opacity-20">
      <div ref={chatContainerRef} className="custom-scrollbar overflow-y-auto max-h-64 mb-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.sender === 'USER' ? 'justify-end' : 'justify-start'} mb-2`}>
            <div className={`rounded-lg py-2 px-4 ${message.sender === 'USER' ? 'bg-[#7F2C36] text-gray-300 self-end bg-opacity-50' : 'bg-[#7c470d] bg-opacity-25 text-gray-300 self-start'}`}>
              <p className="text-sm">{message.sender}:</p>
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-end">
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={question}
            onChange={handleChange}
            placeholder="Type a message"
            className="flex-grow border border-[#7F2C36] rounded-lg py-2 px-4 focus:outline-none focus:border-[#7F2C36] text-black"
          />
          <button type="submit" className="ml-2 bg-[#7F2C36]  text-gray-300 rounded-lg py-2 px-4 bg-opacity-50 hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
            {isLoading ? 'Loading...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatBot;
