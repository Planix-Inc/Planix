import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../../data/supabaseClient.js";
import "./Notificaciones.css";

const Notificaciones = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioLogueado"));
  const usuarioId = usuarioActivo?.id;
  const channelRef = useRef(null);

  useEffect(() => {
    const fetchNotificaciones = async () => {
      if (!usuarioId) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("Aceptacion")
        .select("*")
        .eq("usuario2_id", usuarioId)
        .is("Aceptar", null)
        .eq("Aviso", true);

      if (error) {
        console.error("Error fetching notifications:", error);
        setLoading(false);
        return;
      }

      // Fetch user data para cada notificación
      const notifsWithUsers = await Promise.all(
        data.map(async (notif) => {
          const { data: userData, error: userError } = await supabase
            .from("Usuario")
            .select("id, nombre, apellido, img")
            .eq("id", notif.usuario1_id)
            .single();
          if (userError) {
            console.error("Error fetching user:", userError);
            return {
              ...notif,
              usuario1: {
                id: notif.usuario1_id,
                nombre: "Usuario",
                apellido: "",
                img: "",
              },
            };
          }
          return { ...notif, usuario1: userData };
        })
      );

      setNotificaciones(notifsWithUsers);
      setLoading(false);
    };
    fetchNotificaciones();
  }, [usuarioId]);

  useEffect(() => {
    if (!usuarioId) return;

    // Suscribirse a cambios en tiempo real
    channelRef.current = supabase
      .channel(`notifications-${usuarioId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Aceptacion",
          filter: `usuario2_id=eq.${usuarioId}`,
        },
        async (payload) => {
          if (payload.new.Aviso && payload.new.Aceptar === null) {
            const { data: userData } = await supabase
              .from("Usuario")
              .select("id, nombre, apellido, img")
              .eq("id", payload.new.usuario1_id)
              .single();

            setNotificaciones((prev) => {
              const exists = prev.some((n) => n.Id === payload.new.Id);
              if (exists) return prev; // Evita duplicados
              return [
                ...prev,
                {
                  ...payload.new,
                  usuario1:
                    userData || {
                      id: payload.new.usuario1_id,
                      nombre: "Usuario",
                      apellido: "",
                      img: "",
                    },
                },
              ];
            });
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Aceptacion",
          filter: `usuario2_id=eq.${usuarioId}`,
        },
        (payload) => {
          setNotificaciones((prev) =>
            prev.filter((notif) => notif.Id !== payload.new.Id)
          );
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [usuarioId]);

  const handleAccept = async (notifId) => {
    const { error } = await supabase
      .from("Aceptacion")
      .update({ Aceptar: true, Aviso: false })
      .eq("Id", notifId);

    if (error) {
      console.error("Error accepting request:", error);
    } else {
      setNotificaciones(notificaciones.filter((n) => n.Id !== notifId));
      window.dispatchEvent(new Event("chatAccepted"));
    }
  };

  const handleReject = async (notifId) => {
    const { error } = await supabase
      .from("Aceptacion")
      .update({ Aceptar: false })
      .eq("Id", notifId);

    if (error) {
      console.error("Error rejecting request:", error);
    } else {
      setNotificaciones(notificaciones.filter((n) => n.Id !== notifId));
    }
  };

  if (loading) return <div>Cargando notificaciones...</div>;

  return (
    <div className="notificaciones-container">
      <h2>Notificaciones de Chat</h2>
      {notificaciones.length === 0 ? (
        <p>No hay notificaciones pendientes.</p>
      ) : (
        <div className="notificaciones-list">
          {notificaciones.map((notif) => (
            <div key={notif.Id} className="notificacion-item">
              <img
                src={notif.usuario1.img}
                alt="Usuario"
                className="notif-avatar"
              />
              <div className="notif-content">
                <p>
                  {notif.usuario1.nombre} {notif.usuario1.apellido} quiere
                  chatear contigo.
                </p>
                <div className="notif-buttons">
                  <button
                    onClick={() => handleAccept(notif.Id)}
                    className="btn-accept"
                  >
                    Aceptar
                  </button>
                  <button
                    onClick={() => handleReject(notif.Id)}
                    className="btn-reject"
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notificaciones;
