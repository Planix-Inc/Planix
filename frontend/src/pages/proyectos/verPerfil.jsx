import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../data/supabaseClient";
import "./proyectos.css";

const VerPerfil = () => {
  const { id } = useParams();
  const [proyecto, setProyecto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerfil = async () => {
      const { data, error } = await supabase
        .from("Proyectos")
        .select("id, nombre, direccion, img, valoracion")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error al obtener proyecto:", error);
      } else {
        console.log("Proyecto data fetched:", data);
        setProyecto(data);
      }
      setLoading(false);
    };

    fetchPerfil();
  }, [id]);

  if (loading) return <div>Cargando perfil...</div>;
  if (!proyecto) return <div>Perfil no encontrado.</div>;

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

  return (
    <>
      <img src={proyecto.img || ""} alt={`Imagen de ${proyecto.nombre}`} />
      <div>
        <p>Nombre proyecto: {proyecto.nombre}</p>
        <p>Dirección proyecto: {proyecto.direccion}</p>
        <p>
          Valoración proyecto: {proyecto.valoracion} {renderStars(proyecto.valoracion)}
        </p>
      </div>
    </>
  );
};

export default VerPerfil;
