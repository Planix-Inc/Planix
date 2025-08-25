import React, { useState } from 'react';
import './chatbot.css';
import { CONFIG } from '../../config';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: CONFIG.chatbot.initialMessage }
  ]);
  const [input, setInput] = useState('');

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = async (customInput) => {
    const value = typeof customInput === 'string' ? customInput : input;
    if (value.trim() === '') return;

    const userMessage = { from: 'user', text: value };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');

    const lowerCaseInput = value.toLowerCase().trim();

    // 1. Comprobar si es una FAQ
    const faqAnswer = CONFIG.chatbot.faqs[lowerCaseInput];
    if (faqAnswer) {
      const botMessage = { from: 'bot', text: faqAnswer };
      setMessages(prevMessages => [...prevMessages, botMessage]);
      return;
    }

    // 2. Si no es una FAQ, llamar a la IA
    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: value,
          systemPrompt: CONFIG.chatbot.systemPrompt
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botMessage = { from: 'bot', text: '' };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);

      reader.read().then(function processText({ done, value }) {
        if (done) {
          return;
        }
        const chunk = decoder.decode(value, { stream: true });
        botMessage.text += chunk;

        setMessages(prevMessages => {
          const newMessages = [...prevMessages];
          newMessages[newMessages.length - 1] = { ...botMessage };
          return newMessages;
        });

        return reader.read().then(processText);
      });

    } catch (error) {
      console.error('Error sending message:', error);
      const fallback = CONFIG.chatbot.fallbackResponses[2];
      const errorMessage = { from: 'bot', text: fallback };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }
  };

  // Renderizado de globitos de FAQ
  const renderFaqBubbles = () => (
    <div className="faq-bubbles">
      {Object.keys(CONFIG.chatbot.faqs).map((faq, idx) => (
        <button
          key={idx}
          className="faq-bubble"
          onClick={() => handleSend(faq)}
        >
          {faq.charAt(0).toUpperCase() + faq.slice(1)}
        </button>
      ))}
    </div>
  );

  return (
    <div className="chatbot-container">
      <div className={`chatbot-icon ${isOpen ? 'open' : ''}`} onClick={toggleChat}>
        {isOpen ? 'X' : <img src="/src/assets/icons/chat.png" alt="Chat Icon" />}
      </div>
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <img src="/src/assets/Logos/logo.png" alt="Logo" className="chatbot-logo" />
            <span>{CONFIG.chatbot.name}</span>
          </div>
          <div className="chatbot-messages">
            
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.from}`}>
                {msg.text}
              </div>
            ))}
            {renderFaqBubbles()}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escribe aquí..."
            />
            <button onClick={() => handleSend()}>Enviar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;