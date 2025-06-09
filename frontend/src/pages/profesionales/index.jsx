import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { supabase } from "../../data/supabaseClient";
import "../profesionales/profesionales.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BotonInversion from "../../components/botonInversion"; 



const Profesionales = () => {
  const [profesionales, setProfesionales] = useState([]);

  useEffect(() => {
    const fetchProfesionales = async () => {
      const { data: Usuario, error } = await supabase
        .from("Usuario")
        .select("*, tipoProfesional: idTipoProfesional (descripcion)")
        .eq("categoriausuarioId", 1);

      if (error) {
        console.error("Error al obtener profesionales:", error);
      } else {
        setProfesionales(Usuario);
      }
    };

    fetchProfesionales();
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
  };

  const arquitectos = profesionales.filter((p) => p.idTipoProfesional === 1);
  const ingenieros = profesionales.filter((p) => p.idTipoProfesional === 2);
  const disenadores = profesionales.filter((p) => p.idTipoProfesional === 3);

  const mostrarTipoProfesional = (titulo, tipoProfesional) => (
    <div className="seccion-profesionales">
      <h2 className="titulo-seccion">{titulo}</h2>
      <Slider {...configuracionCarrusel} className="carrusel-profesionales">
        {tipoProfesional.map((prof) => (
          <div key={prof.id} className="tarjeta-profesional">
            <div className="imagen-profesional">
              <img src={prof.img} alt={`${prof.nombre} ${prof.apellido}`} />
            </div>
            <h3 className="nombre-profesional">
              {prof.nombre} {prof.apellido}
            </h3>
            <p className="texto-localidad">📍 {prof.localidad} - ⭐ {prof.valoracion}</p>
            
            <button className="boton-ver-perfil">Ver perfil</button>
          </div>
        ))}
      </Slider>
    </div>
  );

  return (
    <div>
      <div className="contenedor-portada">
        <div className="capa-oscura">
          <h1>Encontrá profesionales y conectá con ellos</h1>
          <div className="buscador">
            <input
              type="text"
              placeholder="Arquitecto, plomero, diseño de interior, albañil, etc"
            />
            <button className="boton-buscar">🔍</button>
          </div>
        </div>
      </div>
      {mostrarTipoProfesional("Arquitectos", arquitectos)}
      {mostrarTipoProfesional("Ingenieros", ingenieros)}
      {mostrarTipoProfesional("Diseñadores", disenadores)}
      <div>
      <BotonInversion/>
      </div>
    </div>
  );
};

export default Profesionales;
