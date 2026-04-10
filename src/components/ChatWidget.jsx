import React, { useState, useEffect, useRef } from 'react';
import './ChatWidget.css';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I'm Ally. How can I help you with your career or StudentAlly today?" }
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
    const currentInput = input; // Store input for the API call
    setInput('');
    setLoading(true);

    try {
  const backendBaseUrl = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000').replace(/\/$/, "");
  
  const response = await fetch(`${backendBaseUrl}/api/chat/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: currentInput }),
  });

  const data = await response.json(); // Move this up

  if (!response.ok) {
    // This will print the actual error message from the server to your console
    console.error("Backend Error Details:", data); 
    throw new Error(data.error || 'Server error');
  }

  setMessages((prev) => [...prev, { role: 'bot', text: data.message }]);
} catch (error) {
  console.error("Chat Error:", error);
  setMessages((prev) => [...prev, { role: 'bot', text: `Ally is stuck: ${error.message}` }]);
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
            {loading && (
              <div className="ai-msg bot">
                <div className="ai-bubble loading">
                   <span>.</span><span>.</span><span>.</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="ai-chat-footer">
            <input 
              placeholder="Ask Ally anything..." 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={loading}
            />
            <button onClick={handleSend} disabled={loading}>
              {loading ? '...' : '➤'}
            </button>
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