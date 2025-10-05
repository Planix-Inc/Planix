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

      // Fetch user data for each chat
      const chatsWithUsers = await Promise.all(
        data.map(async (chat) => {
          const [user1Data, user2Data] = await Promise.all([
            supabase.from("Usuario").select("id, nombre, apellido, razonSocial, categoriausuarioId, img, logo").eq("id", chat.usuario1_id).single(),
            supabase.from("Usuario").select("id, nombre, apellido, razonSocial, categoriausuarioId, img, logo").eq("id", chat.usuario2_id).single()
          ]);
          return {
            ...chat,
            usuario1: user1Data.data || { id: chat.usuario1_id, nombre: "Usuario", apellido: "", razonSocial: "", categoriausuarioId: 1, img: "", logo: "" },
            usuario2: user2Data.data || { id: chat.usuario2_id, nombre: "Usuario", apellido: "", razonSocial: "", categoriausuarioId: 1, img: "", logo: "" }
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

    return () => {
      window.removeEventListener('chatAccepted', handleChatAccepted);
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

  if (loading) return <div>Cargando chats...</div>;

  return (
    <div className="mis-chats">
      <div className="chats-header" onClick={toggleCollapse}>
        <h3>Mis Chats ({chats.length})</h3>
        <button className="toggle-btn">{isCollapsed ? "▼" : "▲"}</button>
      </div>
      {!isCollapsed && (
        <div className="chats-list">
          {chats.length > 0 ? (
            chats.map((chat) => {
              const otherUser = getOtherUser(chat);
              return (
                <div key={chat.Id} className="chat-item">
                  <img src={otherUser.img || otherUser.logo} alt={getUserName(otherUser)} className="chat-avatar" />
                  <div className="chat-info">
                    <p className="chat-name">{getUserName(otherUser)}</p>
                    <p className="chat-last-message">{truncateMessage(chat.lastMessage)}</p>
                  </div>
                  <button className="chat-btn" onClick={() => setOpenChatUserId(otherUser.id)}>Abrir</button>
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
