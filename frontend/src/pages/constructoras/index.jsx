import React, { useEffect, useState } from "react";
import { supabase } from "../../data/supabaseClient";
import Slider from "react-slick";
import "../constructoras/constructoras.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BotonInversion from "../../components/botonInversion";
import { useNavigate } from "react-router-dom";
import BotonBuscar from "../../components/BotonBuscar"; 

const Constructoras = () => {
  const [constructoras, setConstructoras] = useState([]);
  const [constructorasDestacado, setConstructorasDestacado] = useState([]);
  const navigate = useNavigate();

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

    const fetchConstructorasDestacados = async () => {
      const { data: Usuario, error } = await supabase
        .from("Usuario")
        .select("*")
        .eq("categoriausuarioId", 3)
        .eq("destacado", true);

      if (error) {
        console.error("Error al obtener constructoras:", error);
      } else {
        setConstructorasDestacado(Usuario);
      }
    };

    fetchConstructoras();
    fetchConstructorasDestacados();
  }, []);
  
  const handleClick = (id) => {
    navigate(`/constructoras/verPerfil/${id}`);
  };

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
            <BotonBuscar/>
          </div>
        </div>
      </div>

      <div className="seccion-constructoras">
        <h2 className="titulo-seccion">Constructoras</h2>
        <Slider {...configuracionCarrusel} className="carrusel-constructoras">
          {constructoras.map((prof) => (
            <div key={prof.id} className="tarjeta-constructoras">
              <div className="imagen-constructoras">
                <img src={prof.img} />
              </div>
              <h3 className="nombre-constructoras">{prof.razonSocial}</h3>
              <p className="texto-localidad">
                📍 {prof.localidad} - ⭐ {prof.valoracion}
              </p>
              <button className="boton-ver-perfil" onClick={()=>handleClick(prof.id)}>Ver perfil</button>
            </div>
          ))}
        </Slider>

        <h2 className="titulo-seccion">Constructoras Destacados</h2>
        <Slider {...configuracionCarrusel} className="carrusel-constructoras">
          {constructorasDestacado.map((prof) => (
            <div key={prof.id} className="tarjeta-constructoras">
              <div className="imagen-constructoras">
                <img src={prof.img} />
              </div>
              <h3 className="nombre-constructoras">{prof.razonSocial}</h3>
              <p className="texto-localidad">
                📍 {prof.localidad} - ⭐ {prof.valoracion}
              </p>
              <button className="boton-ver-perfil" onClick={()=>handleClick(prof.id)}>Ver perfil</button>
            </div>
          ))}
        </Slider>
      </div>
      <BotonInversion />
    </div>
  );
};

export default Constructoras;
