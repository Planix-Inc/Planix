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
        .eq("categoriausuarioId", 2) // solo proveedores
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

  if (loading) return <div>Cargando perfil...</div>;
  if (!perfil) return <div>Perfil no encontrado.</div>;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= rating ? "#ffc107" : "#e4e5e9" }}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="perfil-proveedor-container">
      <h2>Perfil de Proveedor</h2>
      <div className="perfil-header">
        <img
          src={perfil.img || perfil.logo}
          alt={perfil.razonSocial}
          height="100"
        />
        <div className="perfil-info">
          <h3>{perfil.razonSocial}</h3>
          <div className="rating">
            {renderStars(Math.round(perfil.valoracion || 0))}
            <span>{perfil.valoracion ? perfil.valoracion.toFixed(1) : "0.0"}</span>
          </div>
          <p><strong>Contacto:</strong></p>
          <p>Teléfono: {perfil.NumeroTelefono || "-"}</p>
          <p>Email: {perfil.Email || "-"}</p>
          <p>Dirección: {perfil.direccion || "No especificada"}</p>
        </div>
      </div>

      <h3>Productos Disponibles</h3>
      <div className="productos-list">
        {perfil.Productos && perfil.Productos.length > 0 ? (
          perfil.Productos.map((producto) => (
            <div key={producto.id} className="producto-card">
              <img src={producto.Fotos} alt={producto.descripcion} height="80" />
              <h4>{producto.descripcion}</h4>
              <p>Precio: ${producto.precio}</p>
              <p>{renderStars(Math.round(producto.valoracion || 0))}</p>
            </div>
          ))
        ) : (
          <p>No hay productos disponibles.</p>
        )}
      </div>

      {/* Si querés agregar reseñas, tendrás que crear la relación primero */}
    </div>
  );
};

export default VerPerfil;
