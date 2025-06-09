import React, { useEffect, useState } from "react";
import { supabase } from "../../data/supabaseClient";
import "../proyectos/proyectos.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const Proyectos = () => {
  const [proyectos, setProyectos] = useState([]);
  const [proyectosDestacados, setProyectosDestacados] = useState([]);

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

    const fetchProyectosDestacados = async () => {
      const { data: Usuario, error } = await supabase
        .from("Proyectos")
        .select("*")
        .eq("destacado", true);
        

      if (error) {
        console.error("Error al obtener proyectos:", error);
      } else {
        setProyectosDestacados(Usuario);
      }
    };

    fetchProyectos();
    fetchProyectosDestacados();
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
        <button className="filter-button"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 50 50"><path d="M 21 3 C 11.601563 3 4 10.601563 4 20 C 4 29.398438 11.601563 37 21 37 C 24.355469 37 27.460938 36.015625 30.09375 34.34375 L 42.375 46.625 L 46.625 42.375 L 34.5 30.28125 C 36.679688 27.421875 38 23.878906 38 20 C 38 10.601563 30.398438 3 21 3 Z M 21 7 C 28.199219 7 34 12.800781 34 20 C 34 27.199219 28.199219 33 21 33 C 13.800781 33 8 27.199219 8 20 C 8 12.800781 13.800781 7 21 7 Z"></path></svg></button>
      </div>
    </div>
  </div>

  <div className="seccion-proyectos">
        <h2 className="titulo-seccion">Proyectos Destacados</h2>
              <Slider {...configuracionCarrusel} className="carrusel-proyectos">
                {proyectosDestacados.map((prof) => (
                  <div key={prof.id} className="tarjeta-proyectos">
                    <div className="imagen-proyectos">
                      <img src={prof.img} alt={`${prof.nombre} ${prof.apellido}`} />
                    </div>
                    <h3 className="nombre-proyectos">
                      {prof.nombre} {prof.apellido}
                    </h3>
                    <p className="texto-localidad">📍 {prof.direccion} - ⭐ {prof.valoracion}</p>
                    <button className="boton-ver-perfil">Ver perfil</button>
                  </div>
                ))}
              </Slider>

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
              <p className="texto-localidad">📍 {prof.direccion} - ⭐ {prof.valoracion}</p>
              <button className="boton-ver-perfil">Ver perfil</button>
            </div>
          ))}
        </Slider>
      </div>

      
</div>
  );
};


export default Proyectos;
