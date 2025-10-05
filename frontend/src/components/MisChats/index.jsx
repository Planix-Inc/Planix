import React, { useState, useEffect } from "react";
import { supabase } from "../../data/supabaseClient.js";
import ChatWindow from "../ChatWindow";
import "./MisChats.css";

const MisChats = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [openChatUserId, setOpenChatUserId] = useState(null);
  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioLogueado"));
  const usuarioActivoId = usuarioActivo ? usuarioActivo.id : null;

  useEffect(() => {
    if (!usuarioActivoId) {
      setLoading(false);
      return;
    }
    const fetchChats = async () => {
      // Fetch accepted chat requests where the user is involved
      const { data, error } = await supabase
        .from("Aceptacion")
        .select("*")
        .eq("Aceptar", true)
        .or(`usuario1_id.eq.${usuarioActivoId},usuario2_id.eq.${usuarioActivoId}`);

      if (error) {
        console.error("Error fetching chats:", error);
        setLoading(false);
        return;
      }

      // Fetch user data and last message for each chat
      const chatsWithUsers = await Promise.all(
        data.map(async (chat) => {
          const [user1Data, user2Data, lastMessageData] = await Promise.all([
            supabase.from("Usuario").select("id, nombre, apellido, razonSocial, categoriausuarioId, img").eq("id", chat.usuario1_id).single(),
            supabase.from("Usuario").select("id, nombre, apellido, razonSocial, categoriausuarioId, img").eq("id", chat.usuario2_id).single(),
            supabase.from("Conversacion")
              .select("*")
              .or(`and(IdUsuario1.eq.${chat.usuario1_id},IdUsuario2.eq.${chat.usuario2_id}),and(IdUsuario1.eq.${chat.usuario2_id},IdUsuario2.eq.${chat.usuario1_id})`)
              .order("TiempoMensaje", { ascending: false })
              .limit(1)
          ]);
          const lastMessage = lastMessageData.data ? lastMessageData.data[0] : null;
          const hasUnread = lastMessage && lastMessage.IdUsuario1 !== usuarioActivoId;
          return {
            ...chat,
            usuario1: user1Data.data || { id: chat.usuario1_id, nombre: "Usuario", apellido: "", razonSocial: "", categoriausuarioId: 1, img: "" },
            usuario2: user2Data.data || { id: chat.usuario2_id, nombre: "Usuario", apellido: "", razonSocial: "", categoriausuarioId: 1, img: "" },
            lastMessage: lastMessage ? lastMessage.Mensaje : "",
            hasUnread
          };
        })
      );

      setChats(chatsWithUsers);
      setLoading(false);
    };

    fetchChats();

    // Listen for chatAccepted event to refresh chats
    const handleChatAccepted = () => {
      fetchChats();
    };
    window.addEventListener('chatAccepted', handleChatAccepted);

    // Subscribe to real-time updates for new messages
    const channel = supabase
      .channel('chats-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Conversacion',
        },
        (payload) => {
          const newMessage = payload.new;
          // Check if the message involves the current user
          if (newMessage.IdUsuario1 === usuarioActivoId || newMessage.IdUsuario2 === usuarioActivoId) {
            // Refresh chats to update unread status
            fetchChats();
          }
        }
      )
      .subscribe();

    return () => {
      window.removeEventListener('chatAccepted', handleChatAccepted);
      supabase.removeChannel(channel);
    };
  }, [usuarioActivoId]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const getOtherUser = (chat) => {
    if (chat.usuario1_id === usuarioActivoId) {
      return chat.usuario2;
    } else {
      return chat.usuario1;
    }
  };

  const getUserName = (user) => {
    if (user.categoriausuarioId === 1 || user.categoriausuarioId === 4) {
      return `${user.nombre} ${user.apellido}`;
    } else {
      return user.razonSocial;
    }
  };

  const unreadCount = chats.filter(chat => chat.hasUnread).length;
  const displayCount = unreadCount > 9 ? "9+" : unreadCount > 0 ? unreadCount : "";

  if (loading) return <div>Cargando chats...</div>;

  return (
    <div className="mis-chats">
      <div className="chats-header" onClick={toggleCollapse}>
        <h3>Mis Chats {displayCount && `(${displayCount})`}</h3>
        <button className="toggle-btn">{isCollapsed ? "▼" : "▲"}</button>
      </div>
      {!isCollapsed && (
        <div className="chats-list">
          {chats.length > 0 ? (
            chats.map((chat) => {
              const otherUser = getOtherUser(chat);
              return (
                <div key={chat.Id} className="chat-item">
                  <div className="avatar-container">
                    <img src={otherUser.img} alt={getUserName(otherUser)} className="chat-avatar" />
                    {chat.hasUnread && <span className="unread-dot"></span>}
                  </div>
                  <div className="chat-info">
                    <p className="chat-name">{getUserName(otherUser)}</p>
                    <p className="chat-last-message">{truncateMessage(chat.lastMessage)}</p>
                  </div>
                  <button className="chat-btn" onClick={() => {
                    setOpenChatUserId(otherUser.id);
                    // Mark as read
                    setChats(prevChats => prevChats.map(c => c.Id === chat.Id ? { ...c, hasUnread: false } : c));
                  }}>Abrir</button>
                </div>
              );
            })
          ) : (
            <p>No hay chats activos.</p>
          )}
        </div>
      )}
      {openChatUserId && (
        <ChatWindow userId={openChatUserId} onClose={() => setOpenChatUserId(null)} />
      )}
    </div>
  );
};

const truncateMessage = (message, maxLength = 20) => {
  if (!message) return "";
  if (message.length <= maxLength) return message;
  return message.substring(0, maxLength) + "...";
};

export default MisChats;
