import React, { useEffect, useState } from "react";
import { supabase } from "../../data/supabaseClient";
import "../profesionales/profesionales.css";

const Profesionales = () => {
  const [profesionales, setProfesionales] = useState([]);

  useEffect(() => {
    const fetchProfesionales = async () => {
      const { data: Usuario, error } = await supabase
        .from("Usuario")
        .select("*")
        .eq("categoriausuarioId", 1);

      if (error) {
        console.error("Error al obtener profesionales:", error);
      } else {
        setProfesionales(Usuario);
      }
    };

    fetchProfesionales();
  }, []);

  return (
    <div>
      <div className="profesionales-container">
        <div className="overlay">
          <h1>Encontrá profesionales y conectá con ellos</h1>
          <div className="search-box">
            <input
              type="text"
              placeholder="Arquitecto, plomero, diseño de interior, albañil, etc"
            />
            <button className="filter-button">🔍</button>
          </div>
        </div>
      </div>
      <div className="seccion-profesionales">
        <h2>Profesionales</h2>
        <div className="carrusel-profesionales">
          {profesionales.map((prof) => (
            <div key={prof.id} className="card-profesional">
              <h3>
                {prof.nombre} {prof.apellido}
              </h3>
              <p>CUIT: {prof.cuit}</p>
              <p>Localidad: {prof.localidad}</p>
              <p>Dirección: {prof.direccion}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profesionales;
