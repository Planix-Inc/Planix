import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../data/supabaseClient.js";
import "./verTodos.css";

const VerTodosProveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProveedores = async () => {
      const { data, error } = await supabase
        .from("Usuario")
        .select("*")
        .eq("categoriausuarioId", 2)
        .order("razonSocial", { ascending: true });

      if (error) {
        console.error("Error al obtener proveedores:", error);
      } else {
        setProveedores(data);
      }
    };

    fetchProveedores();
  }, []);

  const handleClick = (id) => {
    navigate(`/proveedores/verPerfil/${id}`);
  };

  return (
    <div className="contenedor-ver-todos">
      <h2 className="titulo-ver-todos">Todos los Proveedores</h2>
      <div className="grid-ver-todos">
        {proveedores.map((prov) => (
          <div
            key={prov.id}
            className="tarjeta-ver-todos"
            onClick={() => handleClick(prov.id)}
          >
            <div className="imagen-ver-todos">
              <img src={prov.img} alt={prov.razonSocial} />
            </div>
            <h3 className="nombre-ver-todos">{prov.razonSocial}</h3>

            <div className="ubicacion-valoracion">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 1 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{prov.localidad}</span>
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
                <span>{prov.valoracion}</span>
              </div>
            </div>

            <button
              className="boton-ver-perfil"
              onClick={(e) => {
                e.stopPropagation();
                handleClick(prov.id);
              }}
            >
              Ver perfil
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerTodosProveedores;
