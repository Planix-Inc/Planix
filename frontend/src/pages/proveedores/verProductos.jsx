import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../data/supabaseClient";
import "./verP.css";

const VerProducto = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducto = async () => {
      const { data, error } = await supabase
        .from("Productos")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error al obtener producto:", error);
      } else {
        setProducto(data);
      }
      setLoading(false);
    };

    fetchProducto();
  }, [id]);

  if (loading) return <div>Cargando producto...</div>;
  if (!producto) return <div>Producto no encontrado.</div>;

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
    <div className="producto-detalle-container">
      <h2>Detalle del Producto</h2>
      <div className="producto-detalle">
        <img src={producto.Fotos} alt={producto.descripcion} height="150" />
        <div className="producto-info">
          <h3>{producto.descripcion}</h3>
          <p><strong>Precio:</strong> ${producto.precio}</p>
          <p><strong>Valoración:</strong> {renderStars(Math.round(producto.valoracion || 0))} ({producto.valoracion ? producto.valoracion.toFixed(1) : "0.0"})</p>
          <p><strong>Detalles:</strong> {producto.detalles || "No especificados"}</p>
        </div>
      </div>
    </div>
  );
};

export default VerProducto;
