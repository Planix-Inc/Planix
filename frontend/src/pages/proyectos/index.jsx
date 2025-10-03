import React, { useEffect, useState } from "react";
import { supabase } from "../../data/supabaseClient";
import "../proyectos/proyectos.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate, Link } from "react-router-dom";
import BotonBuscar from "../../components/BotonBuscar"; 


const Proyectos = () => {
  const [proyectos, setProyectos] = useState([]);
  const [proyectosDestacados, setProyectosDestacados] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDireccion, setSelectedDireccion] = useState("");
  const [uniqueDirecciones, setUniqueDirecciones] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProyectos = async () => {
      const { data: Usuario, error } = await supabase
        .from("Proyectos")
        .select("*")
        

      if (error) {
        console.error("Error al obtener proyectos:", error);
      } else {
        setProyectos(Usuario);
        const direcciones = [...new Set(Usuario.map(p => p.Barrio).filter(d => d))];
        setUniqueDirecciones(direcciones);
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

  const handleClick=(id)=>{
    navigate(`/proyectos/verPerfil/${id}`)
  }

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

  // Función para filtrar proyectos
  const filterProyectos = (proyectosList) => {
    let filtered = proyectosList;
    if (selectedDireccion) {
      filtered = filtered.filter(proyecto => proyecto.Barrio === selectedDireccion);
    }
    if (!searchTerm.trim()) return filtered;
    
    return filtered.filter((proyecto) => {
      const searchText = normalize(searchTerm);
      const nombre = normalize(proyecto.nombre || "");
      const apellido = normalize(proyecto.apellido || "");
      const direccion = normalize(proyecto.Barrio || "");
      const descripcion = normalize(proyecto.descripcion || "");
      
      return (
        nombre.includes(searchText) ||
        apellido.includes(searchText) ||
        direccion.includes(searchText) ||
        descripcion.includes(searchText) ||
        `${nombre} ${apellido}`.includes(searchText)
      );
    });
  };

  const filteredProyectos = filterProyectos(proyectos);
  const filteredProyectosDestacados = filterProyectos(proyectosDestacados);
  // When there is a search or filter, show all filtered projects in the search results section
  const hayBusqueda = searchTerm.trim() !== "" || selectedDireccion !== "";
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
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <BotonBuscar onClick={() => handleSearch(searchTerm)}/>
      </div>
      <div className="filter-direccion">
        <label>Filtrar por barrio:</label>
        <select value={selectedDireccion} onChange={(e) => setSelectedDireccion(e.target.value)}>
          <option value="">Todas los barrios</option>
          {uniqueDirecciones.map(bar => <option key={bar} value={bar}>{bar}</option>)}
        </select>
      </div>
    </div>
  </div>

  <div className="seccion-proyectos">
        {!hayBusqueda && (
          <>
            <h2 className="titulo-seccion">Proyectos Destacados</h2>
            <Slider {...configuracionCarrusel} className="carrusel-proyectos">
              {filteredProyectosDestacados.map((prof) => (
                <div key={prof.id} className="tarjeta-proyectos">
                  <div className="imagen-proyectos">
                    <img src={prof.img} alt={`${prof.nombre} ${prof.apellido}`} />
                  </div>
                  <h3 className="nombre-proyectos">
                    {prof.nombre} {prof.apellido}
                  </h3>
                  <p className="texto-localidad">📍 {prof.direccion} - ⭐ {prof.valoracion}</p>
                  <button className="boton-ver-perfil" onClick={()=>handleClick(prof.id)}>Ver proyecto</button>
                </div>
              ))}
            </Slider>
          </>
        )}

        {hayBusqueda && (
          <>
            <h2 className="titulo-seccion">Resultados de búsqueda</h2>
            <div className="grid-proyectos">
              {filteredProyectos.map((prof) => (
                <div key={prof.id} className="tarjeta-proyectos">
                  <div className="imagen-proyectos">
                    <img src={prof.img} alt={`${prof.nombre} ${prof.apellido}`} />
                  </div>
                  <h3 className="nombre-proyectos">
                    {prof.nombre} {prof.apellido}
                  </h3>
                  <p className="texto-localidad">📍 {prof.direccion} - ⭐ {prof.valoracion}</p>
                  <button className="boton-ver-perfil" onClick={()=>handleClick(prof.id)}>Ver proyecto</button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="seccion-inversion">
    <h2 className="titulo-inversion">
      ¿Queres crear tu propio proyecto? Empeza ahora mismo
    </h2>
    <p className="subtitulo-inversion">
      Subí tu idea y empezá hoy mismo a colaborar <br />
      con profesionales en el área
    </p>
    <Link to="/proyectos/subirProyecto" className="boton-inversion">
      Ir ya ➤
    </Link>
  </div>
</div>
  );
};
export default Proyectos;
