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

  const selectedOption = options.find(opt => opt.value === selected);
  const displayLabel = selected && selectedOption ? `${label.replace(' ▼', '')}: ${selectedOption.label} ▼` : label;

  return (
    <div className="filter-chip">
      <button onClick={() => setOpen(!open)} className="chip-btn">
        {displayLabel}
      </button>
      {open && (
        <div className="dropdown">
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`dropdown-item ${selected === opt.value ? "active" : ""}`}
              onClick={() => {
                if (opt.value === selected) {
                  onSelect("");  // Clear selection if the same option is clicked
                } else {
                  onSelect(opt.value);
                }
                setOpen(false);
              }}
            >
              <p className="dropdown-item-text">{opt.label}</p>
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
  const [selectedAlfabetiacamente, setSelectedAlfabetiacamente] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchConstructoras = async () => {
      const { data: Usuario, error } = await supabase
        .from("Usuario")
        .select("*")
        .eq("categoriausuarioId", 3)
        .order("razonSocial", { ascending: true });

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
        .eq("destacado", true)
        .order("razonSocial", { ascending: true });

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
      const minVal = parseInt(selectedValoracion.replace("⭐", ""));
      filtered = filtered.filter(
        (c) => c.valoracion && c.valoracion >= minVal
      );
    }

    if (!searchTerm.trim()) {
      // Apply alphabetical sorting if selected
      if (selectedAlfabetiacamente === "A-Z") {
        filtered = filtered.sort((a, b) => (a.razonSocial || "").localeCompare(b.razonSocial || ""));
      } else if (selectedAlfabetiacamente === "Z-A") {
        filtered = filtered.sort((a, b) => (b.razonSocial || "").localeCompare(a.razonSocial || ""));
      }
      return filtered;
    }

    // Apply alphabetical sorting after search filtering
    if (selectedAlfabetiacamente === "A-Z") {
      filtered = filtered.sort((a, b) => (a.razonSocial || "").localeCompare(b.razonSocial || ""));
    } else if (selectedAlfabetiacamente === "Z-A") {
      filtered = filtered.sort((a, b) => (b.razonSocial || "").localeCompare(a.razonSocial || ""));
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

  const hayBusqueda = searchTerm.trim() !== "" || selectedLocalidad !== "" || selectedValoracion !== "" || selectedAlfabetiacamente !== "";

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
          options={[{value: "", label: "Todos"}, ...uniqueLocalidades.map(l => ({value: l, label: l}))]}
          selected={selectedLocalidad}
          onSelect={(val) => setSelectedLocalidad(val)}
        />
        <FilterChip
          label="Valoración ▼"
          options={[{value: "", label: "Todos"}, {value: "4⭐", label: "4⭐"}, {value: "3⭐", label: "3⭐"}, {value: "2⭐", label: "2⭐"}]}
          selected={selectedValoracion}
          onSelect={(val) => setSelectedValoracion(val)}
        />
        <FilterChip
          label="Alfabéticamente ▼"
          options={[{value: "", label: "Todos"}, {value: "A-Z", label: "A-Z"}, {value: "Z-A", label: "Z-A"}]}
          selected={selectedAlfabetiacamente}
          onSelect={(val)=>setSelectedAlfabetiacamente(val)}
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
