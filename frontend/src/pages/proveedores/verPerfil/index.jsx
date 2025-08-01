import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ← AÑADIDO
import { supabase } from "../../../data/supabaseClient.js";
import "../proveedores.css";
import "../verPerfil/verPerfil.css";
import usuario1 from "../../../assets/VerPerfil/usuarioReseñaSim.jpg";
import usuario2 from "../../../assets/VerPerfil/usuario2ReseñaSim.jpg";

const VerPerfil = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // ← AÑADIDO
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerfil = async () => {
      const { data, error } = await supabase
        .from("Usuario")
        .select(
          `
          *,
          Productos (
            id,
            descripcion,
            precio,
            Fotos,
            valoracion
          )
        `
        )
        .eq("id", id)
        .eq("categoriausuarioId", 2)
        .single();

      if (error) {
        console.error("Error al obtener perfil:", error);
      } else {
        setPerfil(data);
      }
      setLoading(false);
    };

    fetchPerfil();
  }, [id]);

  if (loading) return <div>Cargando perfil...</div>;
  if (!perfil) return <div>Perfil no encontrado.</div>;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className="estrella" style={{ color: i <= rating ? "#ffc107" : "#e4e5e9" }}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <div className="perfil-info">
          <img src={perfil.img || perfil.logo} className="perfil-avatar" alt="Logo proveedor" />
          <div className="perfil-datos">
            <h1>{perfil.razonSocial}</h1>
            <p className="profesion">Proveedor</p>
            <p className="perfil-contacto">📧 {perfil.Email || "-"}</p>
            <p className="perfil-contacto">📍 {perfil.direccion || "Dirección no especificada"}</p>
            <p className="perfil-contacto">📱 {perfil.NumeroTelefono || "-"}</p>
          </div>
        </div>

        <div className="perfil-rating">
          <div className="estrella">
            ⭐ {perfil.valoracion ? perfil.valoracion.toFixed(1) : "4.5"}
          </div>
          <small>Marcar como favorito ❤️</small>
        </div>
      </div>

      <div className="proyectos-section">
        <h2>Productos disponibles</h2>
        <div className="proyectos-grid">
          {perfil.Productos && perfil.Productos.length > 0 ? (
            perfil.Productos.map((producto) => (
              <div key={producto.id} className="proyecto-card">
                <img src={producto.Fotos} alt={producto.descripcion} />
                <h4>{producto.descripcion}</h4>
                <p>Precio: ${producto.precio}</p>
                <p>{renderStars(Math.round(producto.valoracion || 0))}</p>
                <button
                  className="ver-producto-btn"
                  onClick={() => navigate(`/proveedores/verProductos/${producto.id}`)}
                >
                  Ver producto
                </button>
              </div>
            ))
          ) : (
            <p>No hay productos aún.</p>
          )}
        </div>
      </div>

      <div className="reseñas-section">
        <h2>Reseñas</h2>

        <div className="reseña-card">
          <div className="reseña-header">
            <div className="reseña-usuario">
              <img src={usuario1} alt="Usuario" />
              <span>Camila Arévalo</span>
            </div>
            <div className="reseña-rating">⭐⭐⭐⭐⭐</div>
          </div>
          <p>
            El proveedor cumplió con los tiempos y los productos llegaron en perfecto estado. ¡Muy recomendable!
          </p>
        </div>

        <div className="reseña-card">
          <div className="reseña-header">
            <div className="reseña-usuario">
              <img src={usuario2} alt="Usuario" />
              <span>Iván Pereyra</span>
            </div>
            <div className="reseña-rating">⭐⭐⭐✩✩</div>
          </div>
          <p>
            Buen servicio en general, pero los precios podrían estar más claros desde el principio.
          </p>
        </div>
      </div>

      <div className="scroll-indicator">
        <button>⬇</button>
      </div>
    </div>
  );
};

export default VerPerfil;
