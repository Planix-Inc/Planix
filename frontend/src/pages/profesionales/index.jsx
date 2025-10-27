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
                  onSelect(""); // Clear selection if the same option is clicked
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

const Profesionales = () => {
  const navigate = useNavigate();
  const [profesionales, setProfesionales] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvincia, setSelectedProvincia] = useState("");
  const [selectedValoracion, setSelectedValoracion] = useState("");
  const [selectedTipoProfesional, setSelectedTipoProfesional] = useState("");
  const [selectedAlfabetiacamente, setSelectedAlfabetiacamente] = useState("");
  const [selectedLocalidad, setSelectedLocalidad] = useState("");
  const [uniqueProvincias, setUniqueProvincias] = useState([]);
  const [uniqueLocalidades, setUniqueLocalidades] = useState([]);
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

    const fetchProvincias = async () => {
      const { data, error } = await supabase.from("Provincia").select("id, nombre");

      if (error) {
        console.error("Error al obtener provincias:", error);
      } else {
        setUniqueProvincias([{value: "", label: "Todos"}, ...data.map(p => ({value: p.id.toString(), label: p.nombre}))]);  // Add "Todos" option
      }
    };

    fetchProfesionales();
    fetchProvincias();
  }, []);

  // Fetch Localidades based on selected Provincia
  useEffect(() => {
    const fetchLocalidades = async () => {
      let query = supabase.from("Localidad").select("id, nombre");

      if (selectedProvincia && selectedProvincia !== "") {
        query = query.eq("provincia_id", selectedProvincia);  // Filter by selected province ID
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error al obtener localidades:", error);
      } else {
        setUniqueLocalidades([{value: "", label: "Todos", id: null}, ...data.map(l => ({value: l.id.toString(), label: l.nombre, id: l.id}))]);  // Add "Todos" option as object
      }
    };

    fetchLocalidades();
  }, [selectedProvincia]);

  // Reset selectedLocalidad if it's not in the current uniqueLocalidades
  useEffect(() => {
    if (selectedLocalidad && selectedLocalidad !== "" && !uniqueLocalidades.some(l => l.value === selectedLocalidad)) {
      setSelectedLocalidad("");
    }
  }, [uniqueLocalidades, selectedLocalidad]);

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

    // Filtro por provincia
    if (selectedProvincia && selectedProvincia !== "") {
      filtered = filtered.filter(prof => prof.idProvincias === parseInt(selectedProvincia));
    }

    // Filtro por localidad
    if (selectedLocalidad && selectedLocalidad !== "") {
      filtered = filtered.filter(prof => prof.idLocalidad === parseInt(selectedLocalidad));
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
  const hayBusqueda = searchTerm.trim() !== "" || selectedProvincia !== "" || selectedValoracion !== "" || selectedTipoProfesional !== "" || selectedAlfabetiacamente !== "" || selectedLocalidad !== "";

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
          label="Provincia ▼"
          options={uniqueProvincias}
          selected={selectedProvincia}
          onSelect={(val) => setSelectedProvincia(val)}
        />
        <FilterChip
          label="Localidad-Barrio ▼"
          options={uniqueLocalidades}
          selected={selectedLocalidad}
          onSelect={(val) => setSelectedLocalidad(val)}
        />
        <FilterChip
          label="Valoración ▼"
          options={[{ value: "", label: "Todos" }, { value: "4⭐", label: "4⭐" }, { value: "3⭐", label: "3⭐" }, { value: "2⭐", label: "2⭐" }]}
          selected={selectedValoracion}
          onSelect={(val) => setSelectedValoracion(val)}
        />
        <FilterChip
          label="Tipo Profesional ▼"
          options={[{ label: "Todos", value: "" }, ...tiposProfesional]}
          selected={selectedTipoProfesional}
          onSelect={(val) => setSelectedTipoProfesional(val)}
        />
        <FilterChip
          label="Alfabéticamente ▼"
          options={[{ value: "", label: "Todos" }, { value: "A-Z", label: "A-Z" }, { value: "Z-A", label: "Z-A" }]}
          selected={selectedAlfabetiacamente}
          onSelect={(val) => setSelectedAlfabetiacamente(val)}
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
                  <p className="tipo-profesional"> 👨‍💼 {prof.tipoProfesional?.descripcion || 'Profesional'} </p>
                  <p className="texto-localidad"> 📍 {prof.provincias} - ⭐ {prof.valoracion} </p>
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
                  <p className="tipo-profesional"> 👨‍💼 {prof.tipoProfesional?.descripcion || 'Profesional'} </p>
                  <p className="texto-localidad"> 📍 {prof.provincias} - ⭐ {prof.valoracion} </p>
                  <button className="boton-ver-perfil" onClick={() => handleClick(prof.id)}>Ver perfil</button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="seccion-inversion">
        <h2 className="titulo-inversion"> ¿Queres ser parte de un proyecto? Postulate ahora mismo </h2>
        <p className="subtitulo-inversion"> Sumate y empezá hoy mismo a colaborar <br /> con profesionales en el área </p>
        <Link to="/profesionales/postularse" className="boton-inversion"> Ir ya ➤ </Link>
      </div>
    </div>
  );
};

export default Profesionales;
