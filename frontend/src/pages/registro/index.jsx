import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../data/supabaseClient.js";
import logo from "../../assets/Logos/PlanixImagotipo.png";
import cascoIcon from "../../assets/icons/casco.png";
import dineroIcon from "../../assets/icons/dinero.png";
import edificioIcon from "../../assets/icons/proveedor.png";
import gruaIcon from "../../assets/icons/grua.png";

import "./registro.css";

const categorias = [
  { id: 1, icon: cascoIcon, label: "Profesional" },
  { id: 4, icon: dineroIcon, label: "Financiero" },
  { id: 2, icon: edificioIcon, label: "Empresa" },
  { id: 3, icon: gruaIcon, label: "Constructor" },
];

const Registro = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    contrasena: "",
    confirmarContrasena: "",
    telefono: "",
  });
  const [loading, setLoading] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [inputValido, setInputValido] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setInputValido({
      ...inputValido,
      [e.target.name]: e.target.value.length > 2,
    });
  };

  const handleCategoriaClick = (id) => {
    setCategoriaSeleccionada(id);
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.nombre ||
      !form.apellido ||
      !form.email ||
      !form.contrasena ||
      !form.confirmarContrasena ||
      !form.telefono ||
      !categoriaSeleccionada
    ) {
      alert("Por favor completa todos los campos y selecciona una categoría.");
      return;
    }
    if (form.contrasena !== form.confirmarContrasena) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);

    const { data: usuarioExistente } = await supabase
      .from("Usuario")
      .select("id")
      .eq("Email", form.email)
      .single();

    if (usuarioExistente) {
      alert("Ya existe un usuario con ese email.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("Usuario")
      .insert([
        {
          nombre: form.nombre,
          apellido: form.apellido,
          Email: form.email,
          Contraseña: form.contrasena,
          NumeroTelefono: form.telefono,
          categoriausuarioId: categoriaSeleccionada,
        },
      ])
      .select(
        "id, nombre, apellido, img, Email, categoriausuarioId, razonSocial"
      )
      .single();

    if (error || !data) {
      alert("Error al registrar usuario.");
      setLoading(false);
      return;
    }

    localStorage.setItem("usuarioLogueado", JSON.stringify(data));
    setLoading(false);
    navigate("/login");
  };

  return (
    <div className="registro-container">
      <div className="registro-left">
        <img
          src={logo}
          alt="Planix Logo"
          className="registro-logo"
          style={{ cursor: "pointer" }}
          onClick={handleLogoClick}
        />
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
      <div className="registro-right fondo-animado">
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
        <form className="registro-form" onSubmit={handleSubmit}>
          <div className="registro-name-row">
            <div className={`form-group ${inputValido.nombre === false ? "input-error" : inputValido.nombre ? "input-success" : ""}`}>
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Ingresa tu nombre"
                value={form.nombre}
                onChange={handleChange}
              />
            </div>
            <div className={`form-group ${inputValido.apellido === false ? "input-error" : inputValido.apellido ? "input-success" : ""}`}>
              <label htmlFor="apellido">Apellido</label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                placeholder="Ingresa tu apellido"
                value={form.apellido}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className={`form-group full-width ${inputValido.email === false ? "input-error" : inputValido.email ? "input-success" : ""}`}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Ingresa tu email"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className={`form-group full-width ${inputValido.contrasena === false ? "input-error" : inputValido.contrasena ? "input-success" : ""}`}>
            <label htmlFor="contrasena">Contraseña</label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              placeholder="Ingresa tu contraseña"
              value={form.contrasena}
              onChange={handleChange}
            />
          </div>
          <div className={`form-group full-width ${inputValido.confirmarContrasena === false ? "input-error" : inputValido.confirmarContrasena ? "input-success" : ""}`}>
            <label htmlFor="confirmarContrasena">Confirmar contraseña</label>
            <input
              type="password"
              id="confirmarContrasena"
              name="confirmarContrasena"
              placeholder="Confirma tu contraseña"
              value={form.confirmarContrasena}
              onChange={handleChange}
            />
          </div>
          <div className={`form-group full-width ${inputValido.telefono === false ? "input-error" : inputValido.telefono ? "input-success" : ""}`}>
            <label htmlFor="telefono">Teléfono de contacto</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              placeholder="Ingresa tu teléfono de contacto"
              value={form.telefono}
              onChange={handleChange}
            />
          </div>
          <div className="form-group full-width">
            <label>Categoría de usuario</label>
            <div className="registro-categorias">
              {categorias.map((cat, idx) => (
                <div key={cat.id} className="registro-categoria-item">
                  <button
                    type="button"
                    onClick={() => handleCategoriaClick(cat.id)}
                    className={`registro-categoria-btn${categoriaSeleccionada === cat.id ? " seleccionada" : ""}`}
                  >
                    <img
                      src={cat.icon}
                      alt={cat.label}
                      className="registro-categoria-icon"
                    />
                  </button>
                  <span className="registro-categoria-label">
                    {["Profesionales", "Inversionista", "Proveedor", "Constructora"][idx]}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="registro-submit-btn ripple"
            disabled={loading}
          >
            {loading ? <span className="spinner"></span> : "Registrarse ahora"}
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
