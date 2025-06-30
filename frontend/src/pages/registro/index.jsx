import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/Logos/PlanixImagotipo.png";
import "./registro.css";

const Registro = () => {
  return (
    <div className="registro-container">
      <div className="registro-left">
        <img src={logo} alt="Planix Logo" className="registro-logo" />
        <div className="registro-left-content">
          <p className="registro-quote">
            "Tu rol es clave. Nuestra plataforma, el punto de encuentro"
          </p>
          <p className="registro-subtext">Visita nuestra web</p>
          <div className="registro-dots">
            <span className="dot active"></span>
            <span className="dot"></span>
          </div>
        </div>
      </div>
      <div className="registro-right">
        <h2 className="registro-title">Comienza totalmente gratis!</h2>
        <p className="registro-subtitle">
          Ingresa la siguiente información para registrarte
        </p>
        <div className="registro-social-buttons">
          <button className="social-btn google" aria-label="Google Sign Up">
            G
          </button>
          <button className="social-btn facebook" aria-label="Facebook Sign Up">
            f
          </button>
        </div>
        <div className="registro-divider">
          <span>ó</span>
        </div>
        <form className="registro-form">
          <div className="registro-name-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Ingresa tu nombre"
              />
            </div>
            <div className="form-group">
              <label htmlFor="apellido">Apellido</label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                placeholder="Ingresa tu apellido"
              />
            </div>
          </div>
          <div className="form-group full-width">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Ingresa tu email"
            />
          </div>
          <div className="form-group full-width">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              placeholder="Ingresa tu contraseña"
            />
          </div>
          <div className="form-group full-width">
            <label htmlFor="confirmarContrasena">Confirmar contraseña</label>
            <input
              type="password"
              id="confirmarContrasena"
              name="confirmarContrasena"
              placeholder="Confirma tu contraseña"
            />
          </div>
          <div className="form-group full-width">
            <label htmlFor="telefono">Teléfono de contacto</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              placeholder="Ingresa tu teléfono de contacto"
            />
          </div>
          <button type="submit" className="registro-submit-btn">
            Registrarse ahora
          </button>
        </form>
        <p className="registro-login-link">
          ¿Ya eres usuario? <Link to="/login">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Registro;
