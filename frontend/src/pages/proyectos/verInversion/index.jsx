import React, { useEffect, useState } from "react";
import { supabase } from "../../../data/supabaseClient";
import { useNavigate, useParams } from "react-router-dom";
import "./verInversion.css";

const VerInversion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proyecto, setProyecto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    cuit: "",
    DireccionFiscal: "",
    IngresosAnuales: "",
    NumeroTelefono: "",
    montoInversion: "",
    moneda: "Peso Ars"
  });

  useEffect(() => {
    const fetchProyecto = async () => {
      const { data, error } = await supabase
        .from("Proyectos")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error al obtener proyecto:", error);
      } else {
        setProyecto(data);
      }
      setLoading(false);
    };

    fetchProyecto();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation: check all fields are filled
    for (const [key, value] of Object.entries(formData)) {
      if (!value) {
        alert(`Por favor complete el campo: ${key}`);
        return;
      }
    }
    
    try {
      // Insert or update user data in "Usuario" table
      const { data, error } = await supabase
        .from("Usuario")
        .upsert({
          cuit: formData.cuit,
          DireccionFiscal: formData.DireccionFiscal,
          IngresosAnuales: formData.IngresosAnuales,
          NumeroTelefono: formData.NumeroTelefono,
          // montoInversion and moneda removed as per user request
          // Add user id or other identifier if needed here
        }, { onConflict: 'id' }); // Assuming 'id' is primary key

      if (error) {
        console.error("Error al guardar usuario:", error);
        alert(`Error al procesar la inversión: ${error.message || JSON.stringify(error)}`);
      } else {
        alert("Inversión registrada exitosamente");
        navigate(`/proyectos`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(`Error al procesar la inversión: ${error.message || JSON.stringify(error)}`);
    }
  };

  const handleCancel = () => {
    navigate(`/proyectos/verProyectos/${id}`);
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="contenedor-ver-inversion">
      <h1>Formulario de Inversión</h1>
      {proyecto && (
        <div className="info-proyecto">
          <h2>{proyecto.nombre}</h2>
          <p>{proyecto.descripcion}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="formulario-inversion">
        
        <div className="form-group">
          <label>CUIT/CUIL</label>
          <input 
            type="text" 
            name="cuit"
            value={formData.cuit}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Direccion Fiscal</label>
          <input 
            type="text" 
            name="DireccionFiscal"
            value={formData.DireccionFiscal}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Teléfono</label>
          <input 
            type="text"
            name="NumeroTelefono"
            value={formData.NumeroTelefono}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Ingresos anuales</label>
          <input 
            type="text" 
            name="IngresosAnuales"
            value={formData.IngresosAnuales}
            onChange={handleChange}
            required
          />
        </div>
        
        
        <div className="form-group">
          <label>Moneda</label>
          <select 
            name="moneda"
            value={formData.moneda}
            onChange={handleChange}
            required
          >
            <option value="Peso Ars">Peso Ars</option>
            <option value="Dolar U$S">Dolar U$S</option>
          </select>
        </div>


        <div className="form-group">
          <label>Monto estimado a invertir</label>
          <select 
            name="montoInversion"
            value={formData.montoInversion}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un monto</option>
            <option value="100000">$100.000</option>
            <option value="500000">$500.000</option>
            <option value="1000000">$1.000.000</option>
            <option value="1500000">$1.500.000</option>
            <option value="2000000">$2.000.000</option>
          </select>
        </div>
        
        
        <div className="form-buttons">
          <button type="button" className="Cancelar" onClick={()=>navigate(`/proyectos/`)}>
            Cancelar
          </button>
          <button type="submit" className="Listo">
            Listo
          </button>
        </div>
      </form>
    </div>
  );
};

export default VerInversion;
