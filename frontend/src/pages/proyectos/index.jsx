import React, { useEffect, useState } from "react";
import { supabase } from "../../data/supabaseClient";
import "../proyectos/proyectos.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate, Link } from "react-router-dom";
import BotonBuscar from "../../components/BotonBuscar";

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

const Proyectos = () => {
  const [proyectos, setProyectos] = useState([]);
  const [proyectosDestacados, setProyectosDestacados] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvincia, setSelectedProvincia] = useState("");
  const [selectedValoracion, setSelectedValoracion] = useState("");
  const [selectedLocalidad, setSelectedLocalidad] = useState("");
  const [selectedAlfabetiacamente, setSelectedAlfabetiacamente] = useState("");
  const [uniqueProvincias, setUniqueProvincias] = useState([]);
  const [uniqueLocalidades, setUniqueLocalidades] = useState([]);
  const navigate = useNavigate();

  // Fetch Proyectos, Provincias and Localidades
  useEffect(() => {
    const fetchProyectos = async () => {
      const { data, error } = await supabase.from("Proyectos").select("*");

      if (error) {
        console.error("Error al obtener proyectos:", error);
      } else {
        setProyectos(data);
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

    const fetchProyectosDestacados = async () => {
      const { data, error } = await supabase
        .from("Proyectos")
        .select("*")
        .eq("destacado", true);

      if (error) {
        console.error("Error al obtener proyectos destacados:", error);
      } else {
        setProyectosDestacados(data);
      }
    };

    fetchProyectos();
    fetchProvincias();
    fetchProyectosDestacados();
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
    navigate(`/proyectos/verPerfil/${id}`);
  };

  const normalize = (text) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
  };

  const filterProyectos = (proyectosList) => {
    let filtered = proyectosList;

    // Filtrar por provincia si está seleccionada
    if (selectedProvincia && selectedProvincia !== "") {
      filtered = filtered.filter(proyecto => proyecto.idProvincia === parseInt(selectedProvincia));
    }

    // Filtrar por localidad si está seleccionada
    if (selectedLocalidad && selectedLocalidad !== "") {
      filtered = filtered.filter(proyecto => proyecto.idLocalidad === parseInt(selectedLocalidad));
    }

    // Filtrar por valoración
    if (selectedValoracion) {
      const minVal = parseInt(selectedValoracion.replace("⭐", ""));
      filtered = filtered.filter(proyecto => proyecto.valoracion >= minVal);
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

    filtered = filtered.filter((proyecto) => {
      const searchText = normalize(searchTerm);
      const nombre = normalize(proyecto.nombre || "");
      const apellido = normalize(proyecto.apellido || "");
      const direccion = normalize(proyecto.direccion || "");
      const descripcion = normalize(proyecto.descripcion || "");

      return (
        nombre.includes(searchText) ||
        apellido.includes(searchText) ||
        direccion.includes(searchText) ||
        descripcion.includes(searchText) ||
        `${nombre} ${apellido}`.includes(searchText)
      );
    });

    // Apply alphabetical sorting after search filtering
    if (selectedAlfabetiacamente === "A-Z") {
      filtered = filtered.sort((a, b) => (a.nombre || "").localeCompare(b.nombre || ""));
    } else if (selectedAlfabetiacamente === "Z-A") {
      filtered = filtered.sort((a, b) => (b.nombre || "").localeCompare(a.nombre || ""));
    }

    return filtered;
  };

  const filteredProyectos = filterProyectos(proyectos);
  const filteredProyectosDestacados = filterProyectos(proyectosDestacados);
  const hayBusqueda = searchTerm.trim() !== "" || selectedProvincia !== "" || selectedValoracion !== "" || selectedLocalidad !== "" || selectedAlfabetiacamente !== "";

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
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
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
            <BotonBuscar onClick={() => handleSearch(searchTerm)} />
          </div>
        </div>
      </div>

      {/* NUEVOS FILTROS */}
      <div className="filters-bar">
        <FilterChip
          label="Provincia ▼"
          options={uniqueProvincias}  // Show all provinces
          selected={selectedProvincia}
          onSelect={(val) => setSelectedProvincia(val)}
        />
 <FilterChip
          label="Localidad-Barrio ▼"
          options={uniqueLocalidades}  // Show all localities based on selected province
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
          onSelect={(val) => setSelectedAlfabetiacamente(val)}
        />
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
                  <button className="boton-ver-perfil" onClick={() => handleClick(prof.id)}>Ver proyecto</button>
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
                  <button className="boton-ver-perfil" onClick={() => handleClick(prof.id)}>Ver proyecto</button>
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
