import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../data/supabaseClient";
import "../profesionales/profesionales.css";

const VerPerfil = () => {
  const { id } = useParams();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerfil = async () => {
      const { data, error } = await supabase
        .from("Usuario")
        .select("*, tipoProfesional: idTipoProfesional (descripcion)")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error al obtener perfil:", error);
      } else {
        setPerfil(data);
      }
      setLoading(false);
    };

    fetchPerfil();
  }, [id]);

  if (loading) {
    return <div>Cargando perfil...</div>;
  }

  if (!perfil) {
    return <div>Perfil no encontrado.</div>;
  }

  return (
    <div className="perfil-container">
      <h1>{perfil.nombre} {perfil.apellido}</h1>
      <p>Email: {perfil.email}</p>
      <p>Localidad: {perfil.localidad}</p>
      <p>Tipo Profesional: {perfil.tipoProfesional.descripcion}</p>
      <p>Valoración: {perfil.valoracion}</p>
      {/* Add more profile details as needed */}
    </div>
  );
};

export default VerPerfil;
