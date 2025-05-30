import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { supabase } from "../../data/supabaseClient";
import "../profesionales/profesionales.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

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
        <Slider {...settings} className="carrusel-profesionales">
          {profesionales.map((prof) => (
            <div key={prof.id} className="card-profesional">
              <div className="card-image">
                <img
                  src={prof.imagen || "https://via.placeholder.com/150"}
                  alt={`${prof.nombre} ${prof.apellido}`}
                />
              </div>
              <h3>
                {prof.nombre} {prof.apellido}
              </h3>
              <p>{prof.localidad}</p>
              <button className="view-profile-button">Ver perfil</button>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Profesionales;




/* Hice un cambio en las card este es el codigo viejo por si lo quieren volver a utilizar.


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


CSS:
Y este es el css viejo

.profesionales-container {
  background-image: url("../../assets/Profesionales/PortadaProfesionales.png");
  background-size: cover;
  background-position: center;
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay {
  background-color: rgba(0, 0, 0, 0.4); 
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  color: white;
  max-width: 800px;
  width: 100%;
}

.search-box {
  display: flex;
  margin-top: 20px;
  justify-content: center;
}

.search-box input {
  padding: 12px 20px;
  border-radius: 30px 0 0 30px;
  border: none;
  width: 60%;
  font-size: 16px;
}

.filter-button {
  padding: 12px 20px;
  border: none;
  background-color: #fcb900;
  color: white;
  font-weight: bold;
  border-radius: 0 30px 30px 0;
  cursor: pointer;
}

.seccion-profesionales {
  padding: 20px;
  background-color: #f5f5f5;
}

.seccion-profesionales h2 {
  margin-bottom: 15px;
  font-family: Arial, sans-serif;
  color: #333;
}

.carrusel-profesionales {
  display: flex;
  overflow-x: auto;
  gap: 15px;
  padding-bottom: 10px;
}


.card-profesional {
  flex: 0 0 250px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  padding: 15px;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #222;
  user-select: none;
  cursor: grab;
  transition: transform 0.3s ease;
}

.card-profesional:active {
  cursor: grabbing;
  transform: scale(1.05);
}

.card-profesional h3 {
  margin: 0 0 8px;
  font-size: 1.2rem;
  color: #005f73;
}

.card-profesional p {
  margin: 4px 0;
  font-size: 0.9rem;
  line-height: 1.3;
  color: #444;
}*/