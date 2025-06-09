import React, { useEffect, useState } from "react";
import { supabase } from "../../data/supabaseClient";
import Slider from "react-slick";
import "../constructoras/constructoras.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
        <h2 className="titulo-seccion">Constructoras</h2>
        <Slider {...configuracionCarrusel} className="carrusel-constructoras">
          {constructoras.map((prof) => (
            <div key={prof.id} className="tarjeta-constructoras">
              <div className="imagen-constructoras">
                <img src={prof.img} alt={`${prof.nombre} ${prof.apellido}`} />
              </div>
              <h3 className="nombre-constructoras">
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


export default Constructoras;
