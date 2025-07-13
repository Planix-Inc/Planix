import React, { useEffect, useState } from "react";
import { supabase } from "../../../../data/supabaseClient.js";
import { useNavigate } from "react-router-dom";

const VerTodosProductos = () => {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  const fetchTodosProductos = async () => {
    const { data: Productos, error } = await supabase
      .from("Productos")
      .select("*");

    if (error) {
      console.error("Error al obtener todos los productos:", error);
    } else {
      setProductos(Productos);
    }
  };

  useEffect(() => {
    fetchTodosProductos();
  }, []);

  const handleClickProducto = (id) => {
    navigate(`/proveedores/verProductos/${id}`);
  };

  return (
    <div className="grid-productos">
      {productos.map((prod) => (
        <div key={prod.id} className="tarjeta-producto">
          <img src={prod.Fotos} alt={prod.descripcion} />
          <h3 className="nombre-producto">{prod.descripcion}</h3>
          <p className="valoracion-producto">
            ${prod.precio} - ⭐ {prod.valoracion}
          </p>
          <button
            className="boton-ver-producto"
            onClick={() => handleClickProducto(prod.id)}
          >
            Ver Producto
          </button>
        </div>
      ))}
    </div>
  );
};

export default VerTodosProductos;
