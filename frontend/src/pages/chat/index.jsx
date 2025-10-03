import React, { useState, useEffect } from 'react';
import { supabase } from '../../data/supabaseClient';
import ChatWindow from './ChatWindow';
import './chat.css';

const Chat = ({ currentUser }) => {
  const [requests, setRequests] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [tab, setTab] = useState('requests'); // 'requests' or 'conversations'

  useEffect(() => {
    if (!currentUser) return;

    fetchRequests();
    fetchConversations();

    const requestSubscription = supabase
      .from(`Aceptacion:solicitadoId=eq.${currentUser.id}`)
      .on('INSERT', payload => {
        fetchRequests();
      })
      .on('UPDATE', payload => {
        fetchRequests();
        fetchConversations();
      })
      .subscribe();

    const conversationSubscription = supabase
      .from(`Conversacion:receptorId=eq.${currentUser.id}`)
      .on('INSERT', payload => {
        fetchConversations();
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(requestSubscription);
      supabase.removeSubscription(conversationSubscription);
    };
  }, [currentUser]);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('Aceptacion')
      .select('id, solicitanteId, solicitante:Usuario(id, nombre, email), aceptado')
      .eq('solicitadoId', currentUser.id)
      .is('aceptado', null);

    if (error) {
      console.error('Error fetching requests:', error);
      return;
    }
    setRequests(data);
  };

  const fetchConversations = async () => {
    const { data, error } = await supabase
      .from('Conversacion')
      .select('id, emisorId, receptorId, mensaje, created_at')
      .or(`emisorId.eq.${currentUser.id},receptorId.eq.${currentUser.id}`);

    if (error) {
      console.error('Error fetching conversations:', error);
      return;
    }
    setConversations(data);
  };

  const handleAccept = async (requestId) => {
    const { error } = await supabase
      .from('Aceptacion')
      .update({ aceptado: true })
      .eq('id', requestId);

    if (error) {
      console.error('Error accepting request:', error);
      return;
    }
    fetchRequests();
    fetchConversations();
  };

  const handleReject = async (requestId) => {
    const { error } = await supabase
      .from('Aceptacion')
      .update({ aceptado: false })
      .eq('id', requestId);

    if (error) {
      console.error('Error rejecting request:', error);
      return;
    }
    fetchRequests();
  };

  const openChat = (userId) => {
    setSelectedChatId(userId);
    setTab('conversations');
  };

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <div className="chat-tabs">
          <button
            className={tab === 'requests' ? 'active' : ''}
            onClick={() => setTab('requests')}
          >
            Requests
          </button>
          <button
            className={tab === 'conversations' ? 'active' : ''}
            onClick={() => setTab('conversations')}
          >
            Conversations
          </button>
        </div>
        <div className="chat-list">
          {tab === 'requests' &&
            (requests.length === 0 ? (
              <p>No chat requests</p>
            ) : (
              requests.map((req) => (
                <div key={req.id} className="chat-request-item">
                  <p>{req.solicitante.nombre} wants to chat</p>
                  <button onClick={() => handleAccept(req.id)}>Accept</button>
                  <button onClick={() => handleReject(req.id)}>Reject</button>
                </div>
              ))
            ))}

          {tab === 'conversations' &&
            (conversations.length === 0 ? (
              <p>No conversations</p>
            ) : (
              conversations.map((conv) => {
                const otherUserId =
                  conv.emisorId === currentUser.id ? conv.receptorId : conv.emisorId;
                return (
                  <div
                    key={conv.id}
                    className="chat-conversation-item"
                    onClick={() => openChat(otherUserId)}
                  >
                    <p>Chat with User {otherUserId}</p>
                    <p>{conv.mensaje}</p>
                  </div>
                );
              })
            ))}
        </div>
      </div>
      <div className="chat-main">
        {selectedChatId ? (
          <ChatWindow currentUser={currentUser} otherUserId={selectedChatId} />
        ) : (
          <p>Select a conversation to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default Chat;
