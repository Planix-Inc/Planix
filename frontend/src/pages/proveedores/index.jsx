import React, { useEffect, useState } from "react";
import { supabase } from "../../data/supabaseClient";
import "../proveedores/proveedores.css";


const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    const fetchProveedores = async () => {
      const { data: Usuario, error } = await supabase
        .from("Usuario")
        .select("*")
        .eq("categoriausuarioId", 2);

      if (error) {
        console.error("Error al obtener proveedores:", error);
      } else {
        setProveedores(Usuario);
      }
    };

    fetchProveedores();
  }, []);
  return (
    <div>
    <div className="proveedores-container">
    <div className="overlay">
      <h1>Encontrá proveedores y conectá con ellos</h1>
      <div className="search-box">
        <input 
          type="text" 
          placeholder="Buscar materiales de construcción para tus proyectos" 
        />
        <button className="filter-button">🔍</button>
      </div>
    </div>
  </div>
  <div className="seccion-proveedores">
  <h2>Proveedor</h2>
  <div className="carrusel-proveedores">
    {proveedores.map((prov) => (
      <div key={prov.id} className="card-proveedores">
        <h3>
          {prov.razonSocial}
        </h3>
        <p>CUIT: {prov.cuit}</p>  
        <p>Localidad: {prov.localidad}</p>
        <p>Dirección: {prov.direccion}</p>
      </div>
    ))}
  </div>
</div>
</div>
  );
};


export default Proveedores;
