import React from 'react';
import './profesionales.css';

const Profesionales = () => {
  return (
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
  );
};

export default Profesionales;
