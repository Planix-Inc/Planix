import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Slider from "react-slick";
import { supabase } from "../../data/supabaseClient";
import "../profesionales/profesionales.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BotonInversion from "../../components/botonInversion"; 
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
              key={opt.value || opt}
              className={`dropdown-item ${selected === (opt.value || opt) ? "active" : ""}`}
              onClick={() => {
                onSelect(opt.value || opt);
                setOpen(false);
              }}
            >
              <p className="dropdown-item-text">{opt.label || opt}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Profesionales = () => {
  const navigate = useNavigate();
  const [profesionales, setProfesionales] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvincia, setSelectedProvincia] = useState("");
  const [selectedValoracion, setSelectedValoracion] = useState("");
  const [selectedTipoProfesional, setSelectedTipoProfesional] = useState("");
  const [selectedAlfabetiacamente,setSelectedAlfabetiacamente]=useState("")
  const [UniqueProvincias, setUniqueProvincias] = useState([]);
  const [tiposProfesional, setTiposProfesional] = useState([]);

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
        // Obtener localidades únicas
        const provincias = [...new Set(Usuario.map(p => p.provincias).filter(l => l))];
        setUniqueProvincias(provincias);
        
        // Obtener tipos de profesional únicos
        const tiposMap = new Map();
        Usuario.forEach(p => {
          if (p.idTipoProfesional && !tiposMap.has(p.idTipoProfesional)) {
            tiposMap.set(p.idTipoProfesional, {
              value: p.idTipoProfesional,
              label: p.tipoProfesional?.descripcion || `Tipo ${p.idTipoProfesional}`
            });
          }
        });
        const tipos = Array.from(tiposMap.values());
        setTiposProfesional(tipos);
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

  const normalize = (text) =>
    (text || "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
  };

  // Función de filtrado completa
  const filterProfesionales = (profesionalesList) => {
    let filtered = [...profesionalesList];

    // Filtro por búsqueda de texto
    if (searchTerm.trim()) {
      const searchText = normalize(searchTerm);
      filtered = filtered.filter((prof) => {
        const fullName = `${prof.nombre || ""} ${prof.apellido || ""}`;
        const localidad = normalize(prof.provincias || "");
        const tipoProfesional = normalize(prof.tipoProfesional?.descripcion || "");
        return (
          normalize(fullName).includes(searchText) ||
          localidad.includes(searchText) ||
          tipoProfesional.includes(searchText)
        );
      });
    }

    // Filtro por localidad
    if (selectedProvincia) {
      filtered = filtered.filter(prof => prof.provincias === selectedProvincia);
    }

    // Filtro por valoración
    if (selectedValoracion) {
      const minVal = parseInt(selectedValoracion.replace("⭐", ""));
      filtered = filtered.filter(prof => prof.valoracion && prof.valoracion >= minVal);
    }

    // Filtro por tipo de profesional
    if (selectedTipoProfesional) {
      filtered = filtered.filter(prof => prof.idTipoProfesional === parseInt(selectedTipoProfesional));
    }

    if (!searchTerm.trim()) {
      // Apply alphabetical sorting if selected
      if (selectedAlfabetiacamente === "A-Z") {
        filtered = filtered.sort((a, b) => (a.nombre || "").localeCompare(b.nombre || ""));
      } else if (selectedAlfabetiacamente === "Z-A") {
        filtered = filtered.sort((a, b) => (b.nombre || "").localeCompare(a.nombre || ""));
      }
      return filtered;
    }

    // Apply alphabetical sorting after search filtering
    if (selectedAlfabetiacamente === "A-Z") {
      filtered = filtered.sort((a, b) => (a.nombre || "").localeCompare(b.nombre || ""));
    } else if (selectedAlfabetiacamente === "Z-A") {
      filtered = filtered.sort((a, b) => (b.nombre || "").localeCompare(a.nombre || ""));
    }

    return filtered;
  };

  const filteredProfesionales = filterProfesionales(profesionales);
  const hayBusqueda = searchTerm.trim() !== "" || selectedProvincia !== "" || selectedValoracion !== "" || selectedTipoProfesional !== "" || selectedAlfabetiacamente !== "";

  // Solo profesionales con valoración mayor a 4 para destacados
  const mejoresValorados = profesionales.filter((p) => p.valoracion && p.valoracion > 4);



    return (
    <div>
      <div className="contenedor-portada">
        <div className="capa-oscura">
          <h1>Encontrá profesionales y conectá con ellos</h1>
          <div className="buscador">
            <input
              type="text"
              placeholder="Buscar por nombre, apellido o especialidad"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <BotonBuscar onClick={() => handleSearch(searchTerm)} />
          </div>
        </div>
      </div>

      {/* FILTROS */}
      <div className="filters-bar">
        <FilterChip
          label="Provincias ▼"
          options={["Todos", ...UniqueProvincias]}
          selected={selectedProvincia}
          onSelect={(val) => setSelectedProvincia(val === "Todos" ? "" : val)}
        />
        <FilterChip
          label="Valoración ▼"
          options={["Todos", "4⭐", "3⭐", "2⭐"]}
          selected={selectedValoracion}
          onSelect={(val) => setSelectedValoracion(val === "Todos" ? "" : val)}
        />
        <FilterChip
          label="Tipo Profesional ▼"
          options={[
            { label: "Todos", value: "" },
            ...tiposProfesional
          ]}
          selected={selectedTipoProfesional}
          onSelect={(val) => setSelectedTipoProfesional(val === "" ? "" : val)}
        />
        <FilterChip
        label="Alfabéticamente ▼"
        options={["Todos", "A-Z", "Z-A"]}
        selected={selectedAlfabetiacamente}
        onSelect={(val)=>setSelectedAlfabetiacamente(val==="Todos"?"": val)}
        />
      </div>

      <div className="seccion-profesionales">
        {!hayBusqueda && (
          <>
            <h2 className="titulo-seccion">Mejores Valorados</h2>
            <Slider {...configuracionCarrusel} className="carrusel-profesionales">
              {mejoresValorados.map((prof) => (
                <div key={prof.id} className="tarjeta-profesional">
                  <div className="imagen-profesional">
                    <img src={prof.img} alt={`${prof.nombre} ${prof.apellido}`} />
                  </div>
                  <h3 className="nombre-profesional">
                    {prof.nombre} {prof.apellido}
                  </h3>
                  <p className="tipo-profesional">
                    👨‍💼 {prof.tipoProfesional?.descripcion || 'Profesional'}
                  </p>
                  <p className="texto-localidad">
                    📍 {prof.provincias} - ⭐ {prof.valoracion}
                  </p>
                  <button className="boton-ver-perfil" onClick={() => handleClick(prof.id)}>Ver perfil</button>
                </div>
              ))}
            </Slider>
          </>
        )}

        {hayBusqueda && (
          <>
            <h2 className="titulo-seccion">Resultados de búsqueda</h2>
            <div className="grid-profesionales">
              {filteredProfesionales.map((prof) => (
                <div key={prof.id} className="tarjeta-profesional">
                  <div className="imagen-profesional">
                    <img src={prof.img} alt={`${prof.nombre} ${prof.apellido}`} />
                  </div>
                  <h3 className="nombre-profesional">
                    {prof.nombre} {prof.apellido}
                  </h3>
                  <p className="tipo-profesional">
                    👨‍💼 {prof.tipoProfesional?.descripcion || 'Profesional'}
                  </p>
                  <p className="texto-localidad">
                    📍 {prof.provincias} - ⭐ {prof.valoracion}
                  </p>
                  <button className="boton-ver-perfil" onClick={() => handleClick(prof.id)}>Ver perfil</button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

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

