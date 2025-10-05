import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../../data/supabaseClient";
import "./verConstructora.css";


  const VerConstructora = () => {
    const { id } = useParams();
    const [perfil, setPerfil] = useState(null);
    const [proyectos, setProyectos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasRequest, setHasRequest] = useState(false);
    const navigate = useNavigate();
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioLogueado"));
    const usuarioActivoId = usuarioActivo.id;

    useEffect(() => {
      const fetchPerfilYProyectos = async () => {
        // Traer datos del usuario (constructora)
        const { data: usuarioData, error: usuarioError } = await supabase
          .from("Usuario")
          .select("*")
          .eq("id", id)
          .eq("categoriausuarioId", 3) 
          .single();

        if (usuarioError) {
          console.error("Error al obtener perfil:", usuarioError);
          setLoading(false);
          return;
        }

        setPerfil(usuarioData);

        // Traer proyectos en los que participa
        const { data: participaciones, error: participacionesError } = await supabase
          .from("participacionproyecto")
          .select("proyectoid")
          .eq("usuarioid", id);

        if (participacionesError) {
          console.error("Error al obtener participaciones:", participacionesError);
          setLoading(false);
          return;
        }

        const proyectoIds = participaciones.map((p) => p.proyectoid);

        if (proyectoIds.length > 0) {
          const { data: proyectosData, error: proyectosError } = await supabase
            .from("Proyectos")
            .select("id, nombre, direccion, img, valoracion")
            .in("id", proyectoIds);

          if (proyectosError) {
            console.error("Error al obtener proyectos:", proyectosError);
          } else {
            setProyectos(proyectosData);
          }
        }

        setLoading(false);
      };

      fetchPerfilYProyectos();
    }, [id]);

    useEffect(() => {
      const checkRequest = async () => {
        if (!usuarioActivoId || usuarioActivoId == id) return;
        const { data, error } = await supabase
          .from("Aceptacion")
          .select("*")
          .or(`and(usuario1_id.eq.${usuarioActivoId},usuario2_id.eq.${id}),and(usuario1_id.eq.${id},usuario2_id.eq.${usuarioActivoId})`);
        if (error) {
          console.error("Error checking request:", error);
        } else {
          setHasRequest(data.length > 0);
        }
      };
      checkRequest();
    }, [id, usuarioActivoId]);

    const handleClick = () => {
      navigate(`/constructoras/editarPerfil/${id}`);
    };

    const handleSendRequest = async () => {
      const { error } = await supabase
        .from("Aceptacion")
        .insert({
          usuario1_id: usuarioActivoId,
          usuario2_id: id,
          Aceptar: null,
          Aviso: true,
          Conversacion_id: null // Assuming null for now
        });
      if (error) {
        console.error("Error sending request:", error);
      } else {
        setHasRequest(true);
        alert("Petición de chat enviada.");
      }
    };

    const renderStars = (rating) => {
      const stars = [];
      for (let i = 1; i <= 5; i++) {
        stars.push(
          <span key={i} className="estrella" style={{ color: i <= rating ? "#ffc107" : "#e4e5e9" }}>
            ★
          </span>
        );
      }
      return stars;
    };

    if (loading) return <div>Cargando perfil...</div>;
    if (!perfil) return <div>Perfil no encontrado.</div>;

    return (
      <div className="perfil-container">
        <div className="perfil-header">
          <div className="perfil-info">
            <img
              src={perfil.img || perfil.logo}
              className="perfil-avatar"
              alt="Logo constructora"
            />
            <div className="perfil-datos">
              <h1>{perfil.razonSocial}</h1>
              <p className="profesion">Constructora</p>
              <p className="perfil-contacto">📧 {perfil.Email || "-"}</p>
              <p className="perfil-contacto">📍 {perfil.localidad}, {perfil.direccion || "Dirección no especificada"}</p>
              <p className="perfil-contacto">📱 {perfil.NumeroTelefono || "-"}</p>
            </div>
          </div>

          <div className="perfil-rating">
            <div className="estrella">
              ⭐ {perfil.valoracion ? perfil.valoracion.toFixed(1) : "4.5"}
            </div>
            <small>Marcar como favorita ❤️</small>
          </div>
        </div>

        {usuarioActivoId != id && !hasRequest && (
          <div className="btn-chat">
            <button className="enviar-peticion-chat" onClick={handleSendRequest}>
              Enviar petición de chat
            </button>
          </div>
        )}

        {usuarioActivoId == id && (
        <div className="btn-editarPerfil">
          <button className="editarPerfil" onClick={handleClick}>
            Editar perfil
          </button>
        </div>
      )}



        <div className="proyectos-section">
          <h2>Proyectos en los que participa</h2>
          <div className="proyectos-grid">
            {proyectos.length > 0 ? (
              proyectos.map((proyecto) => (
                <div key={proyecto.id} className="proyecto-card">
                  <img src={proyecto.img} alt={proyecto.nombre} />
                  <h4>{proyecto.nombre}</h4>
                  <p>{proyecto.direccion}</p>
                  <p>{renderStars(Math.round(proyecto.valoracion || 0))}</p>
                  <button className="boton-ver-proyecto" onClick={() => navigate(`/proyectos/verPerfil/${proyecto.id}`)}>
                    Ver
                  </button>
                </div>
              ))
            ) : (
              <p>No hay proyectos asociados aún.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  export default VerConstructora;
