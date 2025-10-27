import React, { useEffect, useState } from "react";
import { supabase } from "../../data/supabaseClient";
import Slider from "react-slick";
import "../constructoras/constructoras.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BotonInversion from "../../components/botonInversion";
import { useNavigate } from "react-router-dom";
import BotonBuscar from "../../components/BotonBuscar";

// Componente reutilizable para filtros
const FilterChip = ({ label, options, selected, onSelect }) => {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === selected);
  const displayLabel = selected && selectedOption
    ? `${label.replace(" ▼", "")}: ${selectedOption.label} ▼`
    : label;

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
                if (opt.value === selected) onSelect("");
                else onSelect(opt.value);
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvincia, setSelectedProvincia] = useState("");
  const [selectedLocalidad, setSelectedLocalidad] = useState("");
  const [selectedValoracion, setSelectedValoracion] = useState("");
  const [selectedAlfabeticamente, setSelectedAlfabeticamente] = useState("");
  const [uniqueProvincias, setUniqueProvincias] = useState([]);
  const [uniqueLocalidades, setUniqueLocalidades] = useState([]);

  const navigate = useNavigate();

  // ✅ Obtener constructoras (categoriausuarioId = 3)
  useEffect(() => {
    const fetchConstructoras = async () => {
      const { data, error } = await supabase
        .from("Usuario")
        .select("*, provincia: idProvincias (nombre), localidad: idLocalidad (nombre)")
        .eq("categoriausuarioId", 3);

      if (error) {
        console.error("Error al obtener constructoras:", error);
      } else {
        setConstructoras(data);
      }
    };

    const fetchProvincias = async () => {
      const { data, error } = await supabase.from("Provincia").select("id, nombre");
      if (error) {
        console.error("Error al obtener provincias:", error);
      } else {
        setUniqueProvincias([
          { value: "", label: "Todos" },
          ...data.map((p) => ({ value: p.id.toString(), label: p.nombre })),
        ]);
      }
    };

    fetchConstructoras();
    fetchProvincias();
  }, []);

  // ✅ Obtener localidades según provincia seleccionada
  useEffect(() => {
    const fetchLocalidades = async () => {
      let query = supabase.from("Localidad").select("id, nombre");
      if (selectedProvincia && selectedProvincia !== "") {
        query = query.eq("provincia_id", selectedProvincia);
      }
      const { data, error } = await query;
      if (error) {
        console.error("Error al obtener localidades:", error);
      } else {
        setUniqueLocalidades([
          { value: "", label: "Todos" },
          ...data.map((l) => ({ value: l.id.toString(), label: l.nombre })),
        ]);
      }
    };
    fetchLocalidades();
  }, [selectedProvincia]);

  // ✅ Si la localidad actual no pertenece a la provincia seleccionada, la resetea
  useEffect(() => {
    if (
      selectedLocalidad &&
      selectedLocalidad !== "" &&
      !uniqueLocalidades.some((l) => l.value === selectedLocalidad)
    ) {
      setSelectedLocalidad("");
    }
  }, [uniqueLocalidades, selectedLocalidad]);

  const handleClick = (id) => {
    navigate(`/constructoras/verPerfil/${id}`);
  };

  const normalize = (text) =>
    (text || "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const filterConstructoras = (constructorasList) => {
    let filtered = [...constructorasList];

    // Filtro por búsqueda
    if (searchTerm.trim()) {
      const searchText = normalize(searchTerm);
      filtered = filtered.filter((c) => {
        const razonSocial = normalize(c.razonSocial || "");
        const provincia = normalize(c.provincia?.nombre || "");
        const localidad = normalize(c.localidad?.nombre || "");
        const descripcion = normalize(c.descripcionpersonal || "");
        return (
          razonSocial.includes(searchText) ||
          provincia.includes(searchText) ||
          localidad.includes(searchText) ||
          descripcion.includes(searchText)
        );
      });
    }

    // Filtro por provincia
    if (selectedProvincia && selectedProvincia !== "") {
      filtered = filtered.filter(
        (c) => c.idProvincias === parseInt(selectedProvincia)
      );
    }

    // Filtro por localidad
    if (selectedLocalidad && selectedLocalidad !== "") {
      filtered = filtered.filter(
        (c) => c.idLocalidad === parseInt(selectedLocalidad)
      );
    }

    // Filtro por valoración
    if (selectedValoracion) {
      const minVal = parseInt(selectedValoracion.replace("⭐", ""));
      filtered = filtered.filter(
        (c) => c.valoracion && c.valoracion >= minVal
      );
    }

    // Orden alfabético
    if (selectedAlfabeticamente === "A-Z") {
      filtered = filtered.sort((a, b) =>
        (a.razonSocial || "").localeCompare(b.razonSocial || "")
      );
    } else if (selectedAlfabeticamente === "Z-A") {
      filtered = filtered.sort((a, b) =>
        (b.razonSocial || "").localeCompare(a.razonSocial || "")
      );
    }

    return filtered;
  };

  const filteredConstructoras = filterConstructoras(constructoras);
  const hayBusqueda =
    searchTerm.trim() !== "" ||
    selectedProvincia !== "" ||
    selectedLocalidad !== "" ||
    selectedValoracion !== "" ||
    selectedAlfabeticamente !== "";

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

  const mejoresValoradas = constructoras.filter(
    (c) => c.valoracion && c.valoracion > 4
  );

  return (
    <div>
      <div className="constructoras-container">
        <div className="overlay">
          <h1>Encontrá constructoras y conectá con ellas</h1>
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar por razón social, provincia o localidad"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <BotonBuscar onClick={() => {}} />
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
          options={[
            { value: "", label: "Todos" },
            { value: "4⭐", label: "4⭐" },
            { value: "3⭐", label: "3⭐" },
            { value: "2⭐", label: "2⭐" },
          ]}
          selected={selectedValoracion}
          onSelect={(val) => setSelectedValoracion(val)}
        />
        <FilterChip
          label="Alfabéticamente ▼"
          options={[
            { value: "", label: "Todos" },
            { value: "A-Z", label: "A-Z" },
            { value: "Z-A", label: "Z-A" },
          ]}
          selected={selectedAlfabeticamente}
          onSelect={(val) => setSelectedAlfabeticamente(val)}
        />
      </div>

      <div className="seccion-constructoras">
        {!hayBusqueda && (
          <>
            <h2 className="titulo-seccion">Constructoras mejor valoradas</h2>
            <Slider {...configuracionCarrusel} className="carrusel-constructoras">
              {mejoresValoradas.map((c) => (
                <div key={c.id} className="tarjeta-constructoras">
                  <div className="imagen-constructoras">
                    <img src={c.img} alt={c.razonSocial} />
                  </div>
                  <h3 className="nombre-constructoras">{c.razonSocial}</h3>
                  <p className="texto-localidad">
                    📍 {c.localidad?.nombre || "-"} - ⭐ {c.valoracion || "0"}
                  </p>
                  <button
                    className="boton-ver-perfil"
                    onClick={() => handleClick(c.id)}
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
              {filteredConstructoras.map((c) => (
                <div key={c.id} className="tarjeta-constructoras">
                  <div className="imagen-constructoras">
                    <img src={c.img} alt={c.razonSocial} />
                  </div>
                  <h3 className="nombre-constructoras">{c.razonSocial}</h3>
                  <p className="texto-localidad">
                    📍 {c.localidad?.nombre || "-"} - ⭐ {c.valoracion || "0"}
                  </p>
                  <button
                    className="boton-ver-perfil"
                    onClick={() => handleClick(c.id)}
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
