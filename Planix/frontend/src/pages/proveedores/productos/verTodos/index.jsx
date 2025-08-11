import React, { useEffect, useState } from "react";
import { supabase } from "../../../../data/supabaseClient.js";
import { useNavigate } from "react-router-dom";
import "../../verTodos/verTodos.css"; 

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
    <div className="contenedor-ver-todos">
      <h2 className="titulo-ver-todos">Todos los Productos</h2>
      <div className="grid-ver-todos">
        {productos.map((prod) => (
          <div
            key={prod.id}
            className="tarjeta-ver-todos"
            onClick={() => handleClickProducto(prod.id)}
          >
            <div className="imagen-ver-todos">
              <img src={prod.Fotos} alt={prod.descripcion} />
            </div>
            <h3 className="nombre-ver-todos">{prod.descripcion}</h3>

            <div className="ubicacion-valoracion">
              <span>${prod.precio}</span>
              <span> - </span>
              <div className="valoracion-estrella">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#fbc02d"
                  stroke="#fbc02d"
                  strokeWidth="1"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span>{prod.valoracion}</span>
              </div>
            </div>

            <button
              className="boton-ver-perfil"
              onClick={(e) => {
                e.stopPropagation(); 
                handleClickProducto(prod.id);
              }}
            >
              Ver producto
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerTodosProductos;
