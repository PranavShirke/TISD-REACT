import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { GEMINI_API_KEY } from '../config/api';
import './Chatbot.css';

const Chatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm Sushruta, your AI health assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    // Add user message
    setMessages(prev => [...prev, { text: inputMessage, sender: 'user' }]);
    setInputMessage('');
    setIsTyping(true);
    setError(null);

    try {
      console.log('Sending request to Gemini API...');
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              role: "user",
              parts: [{
                text: `You are Sushruta, an AI health assistant. Please provide helpful and accurate health information. 
                If the question is about specific medical conditions or treatments, remind the user to consult a healthcare professional.
                User's question: ${inputMessage}`
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              }
            ]
          }),
        }
      );

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}: ${responseText}`);
      }

      const data = JSON.parse(responseText);
      console.log('Parsed response:', data);
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error("Invalid response format from API");
      }

      const botResponse = data.candidates[0].content.parts[0].text;
      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
    } catch (error) {
      console.error("Detailed error:", error);
      setError(error.message);
      setMessages(prev => [...prev, { 
        text: `I apologize, but I'm having trouble connecting right now. Error: ${error.message}. Please try again later or consult with your healthcare provider.`, 
        sender: 'bot' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="chatbot-title">
          <FaRobot className="chatbot-icon" />
          <h3>Sushruta AI Assistant</h3>
        </div>
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            {message.text}
          </div>
        ))}
        {isTyping && (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
        {error && (
          <div className="error-message">
            {error}
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
          className="message-input"
          disabled={isTyping}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={isTyping || !inputMessage.trim()}
        >
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
