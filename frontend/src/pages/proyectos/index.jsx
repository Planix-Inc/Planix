import React, { useEffect, useState } from "react";
import { supabase } from "../../data/supabaseClient";
import "../proyectos/proyectos.css";

const Proyectos = () => {
  const [proyectos, setProyectos] = useState([]);

  useEffect(() => {
    const fetchProyectos = async () => {
      const { data: Usuario, error } = await supabase
        .from("Proyectos")
        .select("*")
        

      if (error) {
        console.error("Error al obtener proyectos:", error);
      } else {
        setProyectos(Usuario);
      }
    };

    fetchProyectos();
  }, []);
  return (
    <div>
    <div className="proyectos-container">
    <div className="overlay">
      <h1>Encontrá proyectos y conectá con ellos</h1>
      <div className="search-box">
        <input 
          type="text" 
          placeholder="Buscá proyectos" 
        />
        <button className="filter-button">🔍</button>
      </div>
    </div>
  </div>
  <div className="seccion-proyectos">
  <h2>Proyectos</h2>
  <div className="carrusel-proyectos">
    {proyectos.map((proy) => (
      <div key={proy.id} className="card-proyectos">
        <h3>Nombre Proyecto: </h3>
        <h4>{proy.nombre}</h4>
        <p>Dirección: {proy.direccion}</p>
      </div>
    ))}
  </div>
</div>
</div>
  );
};


export default Proyectos;
