import React, { useEffect, useState } from "react";
import { supabase } from "../../data/supabaseClient";
import Slider from "react-slick";
import "../constructoras/constructoras.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BotonInversion from "../../components/botonInversion";
import { useNavigate } from "react-router-dom";
import BotonBuscar from "../../components/BotonBuscar";

// Componente burbuja con dropdown
const FilterChip = ({ label, options, selected, onSelect }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="filter-chip">
      <button onClick={() => setOpen(!open)} className="chip-btn">
        {label}
      </button>
      {open && (
        <div className="dropdown">
          {options.map((opt) => (
            <div
              key={opt}
              className={`dropdown-item ${selected === opt ? "active" : ""}`}
              onClick={() => {
                onSelect(opt);
                setOpen(false);
              }}
            >
              <p className="dropdown-item-text">{opt}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Constructoras = () => {
  const [constructoras, setConstructoras] = useState([]);
  const [constructorasDestacado, setConstructorasDestacado] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocalidad, setSelectedLocalidad] = useState("");
  const [selectedValoracion, setSelectedValoracion] = useState("");

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

  // normalizar texto
  const normalize = (text) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
  };

  // aplicar filtros
  const filterConstructoras = (constructorasList) => {
    let filtered = [...constructorasList];

    // búsqueda
    if (searchTerm.trim()) {
      const searchText = normalize(searchTerm);
      filtered = filtered.filter((constructora) => {
        const razonSocial = normalize(constructora.razonSocial || "");
        const localidad = normalize(constructora.localidad || "");
        const descripcion = normalize(constructora.descripcion || "");
        return (
          razonSocial.includes(searchText) ||
          localidad.includes(searchText) ||
          descripcion.includes(searchText)
        );
      });
    }

    // filtro localidad
    if (selectedLocalidad) {
      filtered = filtered.filter(
        (c) => c.localidad === selectedLocalidad
      );
    }

    // filtro valoración
    if (selectedValoracion) {
      const minVal = parseInt(selectedValoracion.replace("≥", ""));
      filtered = filtered.filter(
        (c) => c.valoracion && c.valoracion >= minVal
      );
    }

    return filtered;
  };

  // valores únicos de localidad para dropdown
  const uniqueLocalidades = [
    ...new Set(constructoras.map((c) => c.localidad).filter(Boolean)),
  ];

  const filteredConstructoras = filterConstructoras(constructoras);
  const filteredConstructorasDestacados =
    filterConstructoras(constructorasDestacado);

  const hayBusqueda = searchTerm.trim() !== "" || selectedLocalidad !== "" || selectedValoracion !== "";

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
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
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
            <BotonBuscar onClick={() => handleSearch(searchTerm)} />
          </div>
        </div>
      </div>

      {/* filtros estilo burbuja */}
      <div className="filters-bar">
        <FilterChip
          label="Localidad ▼"
          options={["Todos", ...uniqueLocalidades]}
          selected={selectedLocalidad}
          onSelect={(val) => setSelectedLocalidad(val === "Todos" ? "" : val)}
        />
        <FilterChip
          label="Valoración ▼"
          options={["Todos", "≥4", "≥3", "≥2"]}
          selected={selectedValoracion}
          onSelect={(val) => setSelectedValoracion(val === "Todos" ? "" : val)}
        />
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
                  <button
                    className="boton-ver-perfil"
                    onClick={() => handleClick(prof.id)}
                  >
                    Ver perfil
                  </button>
                </div>
              ))}
            </Slider>
          </>
        )}

        {hayBusqueda && (
          <>
            <h2 className="titulo-seccion">Resultados de búsqueda</h2>
            <div className="grid-constructoras">
              {filteredConstructoras.map((prof) => (
                <div key={prof.id} className="tarjeta-constructoras">
                  <div className="imagen-constructoras">
                    <img src={prof.img} />
                  </div>
                  <h3 className="nombre-constructoras">{prof.razonSocial}</h3>
                  <p className="texto-localidad">
                    📍 {prof.localidad} - ⭐ {prof.valoracion}
                  </p>
                  <button
                    className="boton-ver-perfil"
                    onClick={() => handleClick(prof.id)}
                  >
                    Ver perfil
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <BotonInversion />
    </div>
  );
};

export default Constructoras;
