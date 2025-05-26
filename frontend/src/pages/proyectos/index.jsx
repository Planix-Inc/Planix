import React from 'react';
import './proyectos.css'

const Proyectos = () => {
  return (
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
  );
};


export default Proyectos;
