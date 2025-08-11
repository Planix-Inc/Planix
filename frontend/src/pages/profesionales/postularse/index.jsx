import React, { useEffect, useState } from "react";
import { supabase } from "../../../data/supabaseClient";
import { useNavigate } from "react-router-dom";
import "./postularse.css";

const Postularse = () => {
  const [proyectos, setProyectos] = useState([]);
  const [proyectosFiltrados, setProyectosFiltrados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userPostulations, setUserPostulations] = useState(new Set());
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener usuario actual
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);

        // Obtener proyectos
        const { data: proyectosData, error: proyectosError } = await supabase
          .from("Proyectos")
          .select("*");

        if (proyectosError) {
          console.error("Error al obtener proyectos:", proyectosError);
        } else {
          setProyectos(proyectosData || []);
          setProyectosFiltrados(proyectosData || []);
        }

        // Si hay usuario logueado, obtener sus postulaciones
        if (user) {
          const { data: postulaciones, error: postulacionesError } = await supabase
            .from("participacionproyecto")
            .select("proyectoid")
            .eq("usuarioid", user.id);

          if (!postulacionesError && postulaciones) {
            const postulacionesSet = new Set(postulaciones.map(p => p.proyectoid));
            setUserPostulations(postulacionesSet);
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  // Función para filtrar proyectos por ubicación
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    
    if (!searchValue.trim()) {
      setProyectosFiltrados(proyectos);
      return;
    }

    const filtered = proyectos.filter(proyecto => 
      proyecto.direccion && 
      proyecto.direccion.toLowerCase().includes(searchValue.toLowerCase())
    );
    setProyectosFiltrados(filtered);
  };

  const handlePostularse = async (proyectoId) => {
    setLoading(true);
    
    try {
      // Obtener el usuario actual (asumiendo que tienes autenticación)
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert("Debes estar logueado para postularte");
        setLoading(false);
        return;
      }

      // Verificar si ya está postulado
      const { data: existingPostulation, error: checkError } = await supabase
        .from("participacionproyecto")
        .select("*")
        .eq("proyectoid", proyectoId)
        .eq("usuarioid", user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error("Error al verificar postulación:", checkError);
        alert("Error al verificar postulación. Intenta nuevamente.");
        setLoading(false);
        return;
      }

      if (existingPostulation) {
        alert("Ya te has postulado a este proyecto");
        setLoading(false);
        return;
      }

      // Crear la postulación en la base de datos
      const { error } = await supabase
        .from("participacionproyecto")
        .insert([
          {
            proyectoid: proyectoId,
            usuarioid: user.id
          }
        ]);

      if (error) {
        console.error("Error al postularse:", error);
        alert("Error al postularse. Intenta nuevamente.");
      } else {
        // Actualizar el estado local
        setUserPostulations(prev => new Set([...prev, proyectoId]));
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate("/profesionales");
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al postularse. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="postularse-container">
      <div className="postularse-header">
        <div className="postularse-header-content">
          <h1>Postularse a Proyectos</h1>
          <p>Encuentra proyectos que se ajusten a tu perfil y postúlate</p>
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Buscar por ubicación o barrio..." 
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <button className="filter-button">
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 50 50">
                <path d="M 21 3 C 11.601563 3 4 10.601563 4 20 C 4 29.398438 11.601563 37 21 37 C 24.355469 37 27.460938 36.015625 30.09375 34.34375 L 42.375 46.625 L 46.625 42.375 L 34.5 30.28125 C 36.679688 27.421875 38 23.878906 38 20 C 38 10.601563 30.398438 3 21 3 Z M 21 7 C 28.199219 7 34 12.800781 34 20 C 34 27.199219 28.199219 33 21 33 C 13.800781 33 8 27.199219 8 20 C 8 12.800781 13.800781 7 21 7 Z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="success-message">
          <div className="success-content">
            <h3>¡Postulación Exitosa!</h3>
            <p>Tu postulación ha sido registrada correctamente.</p>
            <p>Serás redirigido a la página de profesionales...</p>
          </div>
        </div>
      )}

      <div className="proyectos-grid">
        {proyectosFiltrados.map((proyecto) => (
          <div key={proyecto.id} className="proyecto-card">
            <div className="proyecto-imagen">
              <img 
                src={proyecto.img || "https://via.placeholder.com/120x120?text=Proyecto"} 
                alt={proyecto.nombre || "Proyecto"} 
              />
            </div>
            <h3 className="proyecto-titulo">
              {proyecto.nombre} {proyecto.apellido}
            </h3>
            <p className="proyecto-descripcion">
              {proyecto.descripcion || "Descripción del proyecto no disponible"}
            </p>
            <p className="proyecto-ubicacion">
              📍 {proyecto.direccion || "Ubicación no especificada"}
            </p>
            {proyecto.valoracion && (
              <p className="proyecto-valoracion">
                ⭐ {proyecto.valoracion}
              </p>
            )}
            {userPostulations.has(proyecto.id) ? (
              <button
                className="boton-postulado"
                disabled
              >
                ✓ Ya postulado
              </button>
            ) : (
              <button
                className="boton-postularse"
                onClick={() => handlePostularse(proyecto.id)}
                disabled={loading}
              >
                {loading ? "Postulándose..." : "Postularse"}
              </button>
            )}
          </div>
        ))}
      </div>

      {proyectosFiltrados.length === 0 && (
        <div className="no-proyectos">
          <h3>
            {searchTerm ? "No se encontraron proyectos" : "No hay proyectos disponibles"}
          </h3>
          <p>
            {searchTerm 
              ? `No hay proyectos en "${searchTerm}". Intenta con otra ubicación.`
              : "En este momento no hay proyectos para mostrar."
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Postularse;
