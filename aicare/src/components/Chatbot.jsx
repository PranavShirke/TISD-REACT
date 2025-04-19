



















import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane, FaTimes, FaSpinner } from 'react-icons/fa';
import './Chatbot.css';

// ⚠️ Replace this with your actual Gemini API Key (for testing only; NOT for production)
const GEMINI_API_KEY = 'AIzaSyAwxsDRg2ZsOHRlr6wj88IQQ1jwQpXnkDM'; // <-- Replace with real key

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    return savedMessages ? JSON.parse(savedMessages) : [
      { text: "Hello! I'm your AI health assistant powered by Gemini. How can I help you today?", sender: 'bot' }
    ];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setIsTyping(true);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=GEMINI_API_KEY`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a helpful and friendly AI health assistant. Provide accurate, concise, and professional responses about health-related topics. If you're unsure about something, say so rather than providing potentially incorrect information.

Previous conversation:
${messages.map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`).join('\n')}

User: ${userMessage}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
            topP: 0.8,
            topK: 40
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'API Error');
      }

      const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!botResponse) {
        throw new Error('Invalid response from Gemini API');
      }

      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setMessages(prev => [...prev, { 
        text: `Error: ${error.message || 'Something went wrong'}. Please try again later.`, 
        sender: 'bot' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChatHistory = () => {
    setMessages([
      { text: "Hello! I'm your AI health assistant powered by Gemini. How can I help you today?", sender: 'bot' }
    ]);
    localStorage.removeItem('chatHistory');
  };

  return (
    <>
      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        <FaRobot className="chatbot-icon" />
      </button>

      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <FaRobot className="chatbot-icon" />
              <h3>AI Health Assistant (Gemini)</h3>
            </div>
            <div className="chatbot-actions">
              <button className="clear-button" onClick={clearChatHistory} title="Clear chat history">
                Clear
              </button>
              <button className="close-button" onClick={() => setIsOpen(false)}>
                <FaTimes />
              </button>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {message.text}
              </div>
            ))}
            {isTyping && (
              <div className="message bot typing">
                <FaSpinner className="spinner-icon" />
                <span>AI is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={isTyping}
              required
            />
            <button type="submit" disabled={isTyping}>
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
