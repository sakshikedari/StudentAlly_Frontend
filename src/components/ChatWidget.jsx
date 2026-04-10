import React, { useState, useEffect, useRef } from 'react';
import './ChatWidget.css';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! How can I help you today?' }
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'bot', text: data.message }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'bot', text: 'Error connecting to AI.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-widget-wrapper">
      {/* Floating Chat Window */}
      {isOpen && (
        <div className="ai-chat-window">
          <div className="ai-chat-header">
            <span>StudentAlly AI</span>
            <button onClick={() => setIsOpen(false)}>×</button>
          </div>
          <div className="ai-chat-body">
            {messages.map((msg, i) => (
              <div key={i} className={`ai-msg ${msg.role}`}>
                <div className="ai-bubble">{msg.text}</div>
              </div>
            ))}
            {loading && <div className="ai-msg bot"><div className="ai-bubble loading">...</div></div>}
            <div ref={chatEndRef} />
          </div>
          <div className="ai-chat-footer">
            <input 
              placeholder="Ask me anything..." 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}>➤</button>
          </div>
        </div>
      )}

      {/* Floating Button Icon */}
      <button className="ai-trigger-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '↓' : 'AI'}
      </button>
    </div>
  );
};

export default ChatWidget;