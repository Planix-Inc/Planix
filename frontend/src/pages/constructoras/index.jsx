import React, { useEffect, useState } from "react";
import { supabase } from "../../data/supabaseClient";
import "../constructoras/constructoras.css";

const Constructoras = () => {
  const [constructoras, setConstructoras] = useState([]);

  useEffect(() => {
    const fetchConstructoras = async () => {
      const { data: Usuario, error } = await supabase
        .from("Usuario")
        .select("*")
        .eq("categoriausuarioId", 3);

      if (error) {
        console.error("Error al obtener constructoras:", error);
      } else {
        setConstructoras(Usuario);
      }
    };

    fetchConstructoras();
  }, []);
  return (
    <div>
    <div className="constructoras-container">
    <div className="overlay">
      <h1>Encontrá constructoras y conectá con ellos</h1>
      <div className="search-box">
        <input 
          type="text" 
          placeholder="Buscar constructoras para tus proyectos" 
        />
        <button className="filter-button">🔍</button>
      </div>
    </div>
  </div>
  <div className="seccion-constructoras">
  <h2>Constructoras</h2>
  <div className="carrusel-constructoras">
    {constructoras.map((cons) => (
      <div key={cons.id} className="card-constructoras">
        <h3>
          {cons.razonSocial} 
        </h3>
        <p>CUIT: {cons.cuit}</p>
        <p>Localidad: {cons.localidad}</p>
        <p>Dirección: {cons.direccion}</p>
      </div>
    ))}
  </div>
</div>
</div>
  );
};


export default Constructoras;
