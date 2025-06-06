import React from "react";
import "./notFound.css";
import notFoundImg from "../../assets/Notfound/notfound.png";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="contenedor-error">
      <img src={notFoundImg} alt="Error 404" className="img-error" />
      <h2 className="titulo-error">404 - Página no encontrada</h2>
      <p className="descripcion-error">La página que buscás no existe.</p>
      <button className="boton-error" onClick={() => navigate("/")}>
        Volver al inicio
      </button>
    </div>
  );
};

export default NotFound;
