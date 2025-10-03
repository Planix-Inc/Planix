import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../data/supabaseClient.js";
import "./subirProyecto.css";

//error 409 ver que es.

const subirProyecto = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
      nombre: "",
      direccion: "",
      img: "",
      destacado: false,
      valoracion: 0,
      descripcion: "",
      Barrio:""
    });
    const [loading, setLoading] = useState(false);
    const [inputValido, setInputValido] = useState({});
  
    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
      setInputValido({
        ...inputValido,
        [e.target.name]: e.target.value.length > 2,
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (
        !form.nombre ||
        !form.direccion ||
        !form.img ||
        !form.descripcion ||
        !form.Barrio
      ) {
        alert("Por favor completa todos los campos.");
        return;
      }
      setLoading(true);
  
      const { data: nombreUsado } = await supabase
        .from("Proyectos")
        .select("id")
        .eq("nombre", form.nombre)
        .maybeSingle();
  
      if (nombreUsado) {
        alert("Ya existe un proyecto con ese nombre.");
        setLoading(false);
        return;
      }
  
      const { data, error } = await supabase
        .from("Proyectos")
        .insert([
          {
            nombre: form.nombre,
            direccion: form.direccion,
            img: form.img,
            destacado: false,
            valoracion: 0,
            descripcion: form.descripcion,
            Barrio: form.Barrio
          },
        ])
        .select(
          "id, nombre, direccion, img, destacado, valoracion, descripcion, Barrio"
        )
        .single();
  
      if (error || !data) {
        alert("Error al subir el proyecto.");
        setLoading(false);
        return;
      }

      setLoading(false);
      navigate("/proyectos");
    };
    return (
        <div className="subirProyecto-container">
            <div className="subirProyecto-container2">
      <div className="subirProyecto">
        <h2 className="subirProyecto-title">Subi tu proyecto</h2>
        <p className="subirProyecto-subtitle">
          Ingresa la siguiente información
        </p>
        <form className="subirProyecto-form" onSubmit={handleSubmit}>
          <div className="subirProyecto-name-row">
            <div className={`subirProyecto-form-group ${inputValido.nombre === false ? "input-error" : inputValido.nombre ? "input-success" : ""}`}>
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Ingresa el nombre del proyecto"
                value={form.nombre}
                onChange={handleChange}
              />
            </div>
            <div className={`subirProyecto-form-group ${inputValido.direccion === false ? "input-error" : inputValido.direccion ? "input-success" : ""}`}>
              <label htmlFor="direccion">Direccion</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                placeholder="Ingresa la direccion del proyecto"
                value={form.direccion}
                onChange={handleChange}
              />
            </div>
            <div className={`subirProyecto-form-group ${inputValido.Barrio === false ? "input-error" : inputValido.Barrio ? "input-success" : ""}`}>
              <label htmlFor="Barrio">Barrio</label>
              <input
                type="text"
                id="Barrio"
                name="Barrio"
                placeholder="Ingresa el Barrio del proyecto"
                value={form.Barrio}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className={`subirProyecto-form-group full-width ${inputValido.img === false ? "input-error" : inputValido.img ? "input-success" : ""}`}>
            <label htmlFor="img">Imagen</label>
            <input
              type="text"
              id="img"
              name="img"
              placeholder="Ingresa la foto del proyecto"
              value={form.img}
              onChange={handleChange}
            />
          </div>
          <div className={`subirProyecto-form-group full-width ${inputValido.descripcion === false ? "input-error" : inputValido.descripcion ? "input-success" : ""}`}>
            <label htmlFor="descripcion">Descripcion</label>
            <input
              type="text"
              id="descripcion"
              name="descripcion"
              placeholder="Ingresa la descripcion del proyecto"
              value={form.descripcion}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="subirProyecto-submit-btn ripple"
            disabled={loading}
          >
            {loading ? <span className="spinner"></span> : "Subir proyecto"}
          </button>
        </form>
      </div>
      </div>
    </div>
    )
}

export default subirProyecto;