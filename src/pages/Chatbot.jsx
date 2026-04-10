import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hello! I'm your StudentAlly Assistant. How can I help you with queries regarding alumni, jobs, or events today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.message }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-page">
      <div className="chat-container">
        <div className="chat-header">
          <h2>StudentAlly AI Support</h2>
        </div>
        <div className="chat-box">
          {messages.map((msg, index) => (
            <div key={index} className={`message-wrapper ${msg.role}`}>
              <div className="message-bubble">
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="message-wrapper bot">
              <div className="message-bubble loading">
                <span>.</span><span>.</span><span>.</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div className="chat-input-area">
          <input
            type="text"
            placeholder="Type your query here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend} disabled={loading}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;