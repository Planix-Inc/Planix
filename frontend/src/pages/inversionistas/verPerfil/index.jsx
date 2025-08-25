import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../../data/supabaseClient.js";
import "./verPerfil.css";
import usuario1 from "../../../assets/VerPerfil/usuarioReseñaSim.jpg";
import usuario2 from "../../../assets/VerPerfil/usuario2ReseñaSim.jpg";

const VerPerfil = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioLogueado"));
  const usuarioActivoId = usuarioActivo.id;

  useEffect(() => {
    const fetchPerfil = async () => {
      const { data, error } = await supabase
        .from("Usuario")
        .select("*")
        .eq("id", id)
        .eq("categoriausuarioId", 4) 
        .single();

      if (error) {
        console.error("Error al obtener perfil:", error);
      } else {
        setPerfil(data);
      }
    };

    const fetchProyectos = async () => {
      const { data: participaciones, error: participacionesError } = await supabase
        .from("participacionproyecto")
        .select("proyectoid")
        .eq("usuarioid", id);

      if (participacionesError) {
        console.error("Error al obtener participaciones:", participacionesError);
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
    };

    const fetchData = async () => {
      await fetchPerfil();
      await fetchProyectos();
      setLoading(false);
    };

    fetchData();
  }, [id]);

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

  const handleClick = () => {
  navigate(`/inversionistas/editarPerfil/${id}`);
};

  

  if (loading) return <div>Cargando perfil...</div>;
  if (!perfil) return <div>Perfil no encontrado.</div>;

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <div className="perfil-info">
          <img src={perfil.img} className="perfil-avatar" alt="Avatar" />
          <div className="perfil-datos">
            <h1>{perfil.nombre} {perfil.apellido}</h1>
            <p className="profesion">{perfil.tipoProfesional?.descripcion}</p>
            <p className="perfil-contacto">📧 {perfil.Email}</p>
            <p className="perfil-contacto">📍 {perfil.localidad}, {perfil.Pais}</p>
            <p className="perfil-contacto">📱 {perfil.NumeroTelefono}</p>
          </div>
        </div>

        <div className="perfil-rating">
          <div className="estrella">⭐ {perfil.valoracion?.toFixed(1) || "4.3"}</div>
          <small>Marcar como favorito ❤️</small>
        </div>
      </div>

      {usuarioActivoId == id && (
        <div className="btn-editarPerfil">
          <button className="editarPerfil" onClick={handleClick}>
            Editar perfil
          </button>
        </div>
      )}

      <div className="proyectos-section">
        <h2>Mis proyectos</h2>
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
            <p>No hay proyectos aún.</p>
          )}
        </div>
      </div>

      <div className="reseñas-section">
        <h2>Reseñas</h2>

        <div className="reseña-card">
          <div className="reseña-header">
            <div className="reseña-usuario">
              <img src={usuario1} alt="Usuario" />
              <span>Jorge Martínez</span>
            </div>
            <div className="reseña-rating">⭐⭐⭐⭐⭐</div>
          </div>
          <p>
            Cumple a tiempo con sus propuestas y es transparente con la información.
            Siempre atento a los detalles.
          </p>
        </div>

        <div className="reseña-card">
          <div className="reseña-header">
            <div className="reseña-usuario">
              <img src={usuario2} alt="Usuario" />
              <span>Lautaro Moschini</span>
            </div>
            <div className="reseña-rating">⭐⭐⭐✩✩</div>
          </div>
          <p>
            Buen trabajo en general, pero con algunos detalles a mejorar.
            Comunicación y precisión podrían optimizarse.
          </p>
        </div>
      </div>

      <div className="scroll-indicator">
        <button>⬇</button>
      </div>
    </div>
  );
};

export default VerPerfil;
