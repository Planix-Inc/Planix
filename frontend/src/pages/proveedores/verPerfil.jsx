import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../data/supabaseClient";
import "./proveedores.css";

const VerPerfil = () => {
  const { id } = useParams();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerfil = async () => {
      const { data, error } = await supabase
        .from("Usuario")
        .select(
          "*, productos: Productos (id, nombre, imagen, descripcion, precio), resenas: Resenas (id, usuario, comentario, valoracion, fecha)"
        )
        .eq("id", id)
        .eq("categoriausuarioid", 2)
        .single();

      if (error) {
        console.error("Error al obtener perfil:", error);
      } else {
        console.log("Perfil data fetched:", data);
        setPerfil(data);
      }
      setLoading(false);
    };

    fetchPerfil();
  }, [id]);

  if (loading) {
    return <div>Cargando perfil...</div>;
  }

  if (!perfil) {
    return <div>Perfil no encontrado.</div>;
  }

  // Helper to render stars for rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= rating ? "#ffc107" : "#e4e5e9" }}>
          &#9733;
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="perfil-proveedor-container">
      <h2>Perfil de Proveedor</h2>
      <div className="perfil-header">
        <img src={perfil.logo || perfil.img} alt={perfil.nombre} height="100" />
        <div className="perfil-info">
          <h3>{perfil.nombre}</h3>
          <div className="rating">
            {renderStars(Math.round(perfil.valoracion || 0))}
            <span>{perfil.valoracion ? perfil.valoracion.toFixed(1) : "0.0"}</span>
          </div>
          <p><strong>Contacto:</strong></p>
          <p>Teléfono: {perfil.telefono}</p>
          <p>Email: {perfil.email}</p>
          <p>Web: {perfil.web || perfil.sitioWeb}</p>
          <p>Dirección: {perfil.direccion}</p>
        </div>
      </div>

      <h3>Productos Disponibles</h3>
      <div className="productos-list">
        {perfil.productos && perfil.productos.length > 0 ? (
          perfil.productos.map((producto) => (
            <div key={producto.id} className="producto-card">
              <img src={producto.imagen} alt={producto.nombre} height="80" />
              <h4>{producto.nombre}</h4>
              <p>{producto.descripcion}</p>
              <p>Precio: ${producto.precio}</p>
            </div>
          ))
        ) : (
          <p>No hay productos disponibles.</p>
        )}
      </div>

      <h3>Reseñas</h3>
      <div className="resenas-list">
        {perfil.resenas && perfil.resenas.length > 0 ? (
          perfil.resenas.map((resena) => (
            <div key={resena.id} className="resena-card">
              <p><strong>{resena.usuario}</strong></p>
              <div className="rating">{renderStars(resena.valoracion)}</div>
              <p>{resena.comentario}</p>
              <p><small>{new Date(resena.fecha).toLocaleDateString()}</small></p>
            </div>
          ))
        ) : (
          <p>No hay reseñas disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default VerPerfil;
