import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../data/supabaseClient.js";
import "./ChatWindow.css";

const ChatWindow = ({ userId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState(null);
  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioLogueado"));
  const usuarioActivoId = usuarioActivo ? usuarioActivo.id : null;
  const messagesEndRef = useRef(null);
  const channelRef = useRef(null);

  useEffect(() => {
    const fetchOtherUser = async () => {
      const { data, error } = await supabase
        .from("Usuario")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user:", error);
      } else {
        setOtherUser(data);
      }
    };

    const fetchMessages = async () => {
      // Fetch messages between current user and other user
      const { data, error } = await supabase
        .from("Conversacion")
        .select("*")
        .or(`and(IdUsuario1.eq.${usuarioActivoId},IdUsuario2.eq.${userId}),and(IdUsuario1.eq.${userId},IdUsuario2.eq.${usuarioActivoId})`)
        .order("TiempoMensaje", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
      } else {
        setMessages(data);
      }
      setLoading(false);
    };

    fetchOtherUser();
    fetchMessages();
  }, [userId, usuarioActivoId]);

  useEffect(() => {
    if (!usuarioActivoId || !userId) return;

    // Subscribe to real-time updates for new messages
    channelRef.current = supabase
      .channel(`messages-${usuarioActivoId}-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Conversacion',
        },
        (payload) => {
          // Check if the message is between these users
          const msg = payload.new;
          if (
            (msg.IdUsuario1 === usuarioActivoId && msg.IdUsuario2 === userId) ||
            (msg.IdUsuario1 === userId && msg.IdUsuario2 === usuarioActivoId)
          ) {
            setMessages((prevMessages) => [...prevMessages, msg]);
          }
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [userId, usuarioActivoId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const { error } = await supabase
      .from("Conversacion")
      .insert({
        IdUsuario1: usuarioActivoId,
        IdUsuario2: userId,
        Mensaje: newMessage,
        FechaMensaje: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        TiempoMensaje: new Date().toISOString()
      });

    if (error) {
      console.error("Error sending message:", error);
    } else {
      setMessages([...messages, {
        Id: Date.now(), // Temporary ID
        IdUsuario1: usuarioActivoId,
        IdUsuario2: userId,
        Mensaje: newMessage,
        FechaMensaje: new Date().toISOString().split('T')[0],
        TiempoMensaje: new Date().toISOString()
      }]);
      setNewMessage("");
    }
  };

  const getUserName = (user) => {
    if (user.categoriausuarioId === 1 || user.categoriausuarioId === 4) {
      return `${user.nombre} ${user.apellido}`;
    } else {
      return user.razonSocial;
    }
  };

  if (loading) return <div className="chat-window">Cargando chat...</div>;

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>{otherUser ? getUserName(otherUser) : "Chat"}</h3>
        <button onClick={onClose} className="close-btn">✕</button>
      </div>
      <div className="messages-container">
        {messages.map((msg) => (
          <div key={msg.Id} className={`message ${msg.IdUsuario1 === usuarioActivoId ? "own" : "other"}`}>
            <p>{msg.Mensaje}</p>
            <span className="timestamp">{new Date(msg.TiempoMensaje).toLocaleTimeString()}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Escribe un mensaje..."
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
};

export default ChatWindow;
