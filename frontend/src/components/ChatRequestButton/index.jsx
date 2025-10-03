import React, { useState, useEffect } from 'react';
import { supabase } from '../../data/supabaseClient';
import './chatRequestButton.css';

const ChatRequestButton = ({ targetUserId, currentUserId }) => {
  const [requestStatus, setRequestStatus] = useState(null); // null, 'pending', 'accepted', 'rejected'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkExistingRequest();
  }, [targetUserId, currentUserId]);

  const checkExistingRequest = async () => {
    try {
      const { data, error } = await supabase
        .from('Aceptacion')
        .select('*')
        .or(`and(usuario1_id.eq.${currentUserId},usuario2_id.eq.${targetUserId}),and(usuario1_id.eq.${targetUserId},usuario2_id.eq.${currentUserId})`)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error checking request:', error);
        return;
      }

      if (data) {
        if (data.Aceptar === null) {
          setRequestStatus('pending');
        } else if (data.Aceptar) {
          setRequestStatus('accepted');
        } else {
          setRequestStatus('rejected');
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleRequestChat = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('Aceptacion')
        .insert({
          usuario1_id: currentUserId,
          usuario2_id: targetUserId,
          Aceptar: null,
          Aviso: true,
          Conversacion_id: null
        });

      if (error) throw error;

      setRequestStatus('pending');
      alert('Chat request sent!');
    } catch (error) {
      console.error('Error sending request:', error);
      alert('Error sending request');
    } finally {
      setLoading(false);
    }
  };

  const renderButton = () => {
    if (requestStatus === 'pending') {
      return <button className="chat-btn pending" disabled>Request Pending</button>;
    }
    if (requestStatus === 'accepted') {
      return <button className="chat-btn accepted" onClick={() => window.location.href = `/chat/${targetUserId}`}>Start Chat</button>;
    }
    if (requestStatus === 'rejected') {
      return <button className="chat-btn rejected" disabled>Request Rejected</button>;
    }
    return (
      <button
        className="chat-btn request"
        onClick={handleRequestChat}
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Request Chat'}
      </button>
    );
  };

  return (
    <div className="chat-request-container">
      {renderButton()}
    </div>
  );
};

export default ChatRequestButton;
