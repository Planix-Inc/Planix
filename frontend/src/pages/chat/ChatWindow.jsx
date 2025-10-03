import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../data/supabaseClient';
import './chatWindow.css';

const ChatWindow = ({ currentUser, otherUserId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!currentUser || !otherUserId) return;

    fetchMessages();

    const subscription = supabase
      .from(`Conversacion:or(emisorId.eq.${currentUser.id},receptorId.eq.${currentUser.id})`)
      .on('INSERT', payload => {
        if (
          (payload.new.emisorId === currentUser.id && payload.new.receptorId === otherUserId) ||
          (payload.new.emisorId === otherUserId && payload.new.receptorId === currentUser.id)
        ) {
          setMessages((prev) => [...prev, payload.new]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, [currentUser, otherUserId]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('Conversacion')
      .select('*')
      .or(
        `(and(emisorId.eq.${currentUser.id},receptorId.eq.${otherUserId}),and(emisorId.eq.${otherUserId},receptorId.eq.${currentUser.id}))`
      )
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }
    setMessages(data);
    scrollToBottom();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (input.trim() === '') return;

    const { error } = await supabase.from('Conversacion').insert({
      emisorId: currentUser.id,
      receptorId: otherUserId,
      mensaje: input.trim(),
    });

    if (error) {
      console.error('Error sending message:', error);
      return;
    }
    setInput('');
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat-window">
      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message ${msg.emisorId === currentUser.id ? 'sent' : 'received'}`}
          >
            <p>{msg.mensaje}</p>
            <span className="chat-timestamp">{new Date(msg.created_at).toLocaleTimeString()}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
