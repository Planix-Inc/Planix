import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Slider from "react-slick";
import { supabase } from "../../data/supabaseClient";
import "../profesionales/profesionales.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BotonInversion from "../../components/botonInversion"; 



const Profesionales = () => {
  const navigate = useNavigate();
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

  const handleClick = (id) => {
    navigate(`/profesionales/verPerfil/${id}`);
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
  };

  const arquitectos = profesionales.filter((p) => p.idTipoProfesional === 1);
  const ingenieros = profesionales.filter((p) => p.idTipoProfesional === 2);
  const disenadores = profesionales.filter((p) => p.idTipoProfesional === 3);
  const directoresdeobra = profesionales.filter((p) => p.idTipoProfesional === 4);

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
            <p className="texto-localidad">
              📍 {prof.localidad} - ⭐ {prof.valoracion}
            </p>

<button className="boton-ver-perfil" onClick={() => handleClick(prof.id)}>Ver perfil</button>

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
            <button className="boton-buscar">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 50 50">
                <path d="M 21 3 C 11.601563 3 4 10.601563 4 20 C 4 29.398438 11.601563 37 21 37 C 24.355469 37 27.460938 36.015625 30.09375 34.34375 L 42.375 46.625 L 46.625 42.375 L 34.5 30.28125 C 36.679688 27.421875 38 23.878906 38 20 C 38 10.601563 30.398438 3 21 3 Z M 21 7 C 28.199219 7 34 12.800781 34 20 C 34 27.199219 28.199219 33 21 33 C 13.800781 33 8 27.199219 8 20 C 8 12.800781 13.800781 7 21 7 Z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      {mostrarTipoProfesional("Arquitectos", arquitectos)}
      {mostrarTipoProfesional("Ingenieros", ingenieros)}
      {mostrarTipoProfesional("Diseñadores", disenadores)}
      {mostrarTipoProfesional("Director de Obra", directoresdeobra)}

      <div className="seccion-inversion">
        <h2 className="titulo-inversion">
          ¿Queres ser parte de un proyecto? Postulate ahora mismo
        </h2>
        <p className="subtitulo-inversion">
          Sumate y empezá hoy mismo a colaborar <br />
          con profesionales en el área
        </p>
        <Link to="/profesionales/postularse" className="boton-inversion">
          Ir ya ➤
        </Link>
      </div>
    </div>
  );
};

export default Profesionales;

