import React from 'react';
import './proveedores.css'


const Proveedores = () => {
  return (
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
  );
};


export default Proveedores;
