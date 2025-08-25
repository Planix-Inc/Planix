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
  const [searchTerm, setSearchTerm] = useState("");
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

  // Función para normalizar texto (quitar acentos y convertir a minúsculas)
  const normalize = (text) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  // Función para manejar la búsqueda
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
  };

  // Función para filtrar constructoras
  const filterConstructoras = (constructorasList) => {
    if (!searchTerm.trim()) return constructorasList;
    
    return constructorasList.filter((constructora) => {
      const searchText = normalize(searchTerm);
      const razonSocial = normalize(constructora.razonSocial || "");
      const localidad = normalize(constructora.localidad || "");
      const descripcion = normalize(constructora.descripcion || "");
      
      return (
        razonSocial.includes(searchText) ||
        localidad.includes(searchText) ||
        descripcion.includes(searchText)
      );
    });
  };

  const filteredConstructoras = filterConstructoras(constructoras);
  const filteredConstructorasDestacados = filterConstructoras(constructorasDestacado);
  const hayBusqueda = searchTerm.trim() !== "";

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
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <BotonBuscar onClick={() => handleSearch(searchTerm)}/>
          </div>
        </div>
      </div>

      <div className="seccion-constructoras">
        {!hayBusqueda && (
          <>
            <h2 className="titulo-seccion">Constructoras Destacados</h2>
            <Slider {...configuracionCarrusel} className="carrusel-constructoras">
              {filteredConstructorasDestacados.map((prof) => (
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
          </>
        )}

        <h2 className="titulo-seccion">{hayBusqueda ? "Resultados de búsqueda" : "Constructoras"}</h2>
        <Slider {...configuracionCarrusel} className="carrusel-constructoras">
          {filteredConstructoras.map((prof) => (
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
