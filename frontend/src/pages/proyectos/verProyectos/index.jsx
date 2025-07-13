import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../../data/supabaseClient";
import "./verProyectos.css";

const VerProyectos = () => {
  const { id } = useParams();
  const [proyecto, setProyecto] = useState(null);
  const [participantes, setParticipantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      // Obtener datos del proyecto
      const { data: proyectoData, error: proyectoError } = await supabase
        .from("Proyectos")
        .select("id, nombre, direccion, img, valoracion, descripcion")
        .eq("id", id)
        .single();

      if (proyectoError) {
        console.error("Error al obtener proyecto:", proyectoError);
        setLoading(false);
        return;
      }

      setProyecto(proyectoData);

      // Obtener los participantes
      const { data: participaciones, error: participacionesError } =
        await supabase
          .from("participacionproyecto")
          .select("usuarioid")
          .eq("proyectoid", id);

      if (participacionesError) {
        console.error(
          "Error al obtener participaciones:",
          participacionesError
        );
        setLoading(false);
        return;
      }

      const usuarioIds = participaciones.map((p) => p.usuarioid);

      if (usuarioIds.length > 0) {
        const { data: usuarios, error: usuariosError } = await supabase
          .from("Usuario")
          .select("id, razonSocial, Email, img, categoriausuarioId")
          .in("id", usuarioIds);

        if (usuariosError) {
          console.error(
            "Error al obtener usuarios participantes:",
            usuariosError
          );
        } else {
          setParticipantes(usuarios);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [id]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= rating ? "#ffc107" : "#e4e5e9" }}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) return <div>Cargando proyecto...</div>;
  if (!proyecto) return <div>Proyecto no encontrado.</div>;

  return (
    <div className="contenedor-ver-proyecto">
      <img className="img-proyecto" src={proyecto.img} alt={proyecto.nombre} />

      <div className="info-proyecto">
        <h2>{proyecto.nombre}</h2>
        <p>{proyecto.direccion}</p>
        <div className="valoracion-proyecto">
          <strong>{proyecto.valoracion?.toFixed(1) ?? "0.0"}</strong>{" "}
          {renderStars(Math.round(proyecto.valoracion))}
        </div>
        <p className="descripcion">
          {proyecto.descripcion || "Descripción no disponible."}
        </p>
      </div>

      <h3 className="titulo-participantes">Participantes</h3>
      <div className="grid-participantes">
        {participantes.map((p) => (
          <div key={p.id} className="card-participante">
            <img
              className="img-participante"
              src={p.img}
              alt={p.razonSocial}
              onError={(e) => (e.target.style.display = "none")}
            />
            <p className="tipo-participante">
              {p.categoriausuarioId === 1
                ? "Profesional"
                : p.categoriausuarioId === 2
                ? "Proveedor"
                : "Constructora"}
            </p>
            <p>{p.Email}</p>
            <button
              className="boton-ver-participante"
              onClick={() => {
                if (p.categoriausuarioId === 1) {
                  navigate(`/profesionales/verPerfil/${p.id}`);
                } else if (p.categoriausuarioId === 2) {
                  navigate(`/proveedores/verPerfil/${p.id}`);
                } else {
                  navigate(`/constructoras/verPerfil/${p.id}`);
                }
              }}
            >
              Ver
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerProyectos;
