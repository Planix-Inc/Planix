import React, { useEffect, useState } from "react";
import { supabase } from "../../data/supabaseClient";
import "../proyectos/proyectos.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


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

  const configuracionCarrusel = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 2000,
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
        <h2 className="titulo-seccion">Proyectos</h2>
        <Slider {...configuracionCarrusel} className="carrusel-proyectos">
          {proyectos.map((prof) => (
            <div key={prof.id} className="tarjeta-proyectos">
              <div className="imagen-proyectos">
                <img src={prof.img} alt={`${prof.nombre} ${prof.apellido}`} />
              </div>
              <h3 className="nombre-proyectos">
                {prof.nombre} {prof.apellido}
              </h3>
              <p className="texto-localidad">{prof.localidad}</p>
              <button className="boton-ver-perfil">Ver perfil</button>
            </div>
          ))}
        </Slider>
      </div>
</div>
  );
};


export default Proyectos;
