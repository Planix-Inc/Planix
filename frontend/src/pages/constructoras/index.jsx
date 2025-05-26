import React from 'react';
import './constructoras.css'

const Constructoras = () => {
  return (
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
  );
};


export default Constructoras;
