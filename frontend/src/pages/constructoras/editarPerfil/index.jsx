import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../../data/supabaseClient";

const EditarPerfil = ({ usuarioActivo, setUsuarioActivo }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState({
    razonSocial: "",
    Email: "",
    NumeroTelefono: "",
    localidad: "",
    Pais: "",
    img: "",
  });

  useEffect(() => {
    const fetchPerfil = async () => {
      const { data, error } = await supabase
        .from("Usuario")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error al cargar perfil:", error);
      } else {
        setPerfil(data);
      }
    };

    fetchPerfil();
  }, [id]);

  const handleChange = (e) => {
    setPerfil({ ...perfil, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase
      .from("Usuario")
      .update({
        razonSocial: perfil.razonSocial,
        Email: perfil.Email,
        NumeroTelefono: perfil.NumeroTelefono,
        localidad: perfil.localidad,
        Pais: perfil.Pais,
        img: perfil.img
      })
      .eq("id", id);

    if (error) {
      console.error("Error al actualizar perfil:", error);
    } else {
      setUsuarioActivo({
        ...usuarioActivo,
        razonSocial: perfil.razonSocial,
        Email: perfil.Email,
        NumeroTelefono: perfil.NumeroTelefono,
        localidad: perfil.localidad,
        Pais: perfil.Pais,
        img: perfil.img,
      });
      alert("Perfil actualizado con éxito");
      navigate(`/constructoras/verPerfil/${id}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Editar Perfil</h2>

      <label>Nombre de la Empresa:</label>
      <input name="razonSocial" value={perfil.razonSocial} onChange={handleChange} />

      <label>Email:</label>
      <input name="Email" value={perfil.Email} onChange={handleChange} />

      <label>Teléfono:</label>
      <input name="NumeroTelefono" value={perfil.NumeroTelefono} onChange={handleChange} />

      <label>Localidad:</label>
      <input name="localidad" value={perfil.localidad} onChange={handleChange} />

      <label>País:</label>
      <input name="Pais" value={perfil.Pais} onChange={handleChange} />

      <label>URL de foto de perfil:</label>
      <input
        type="text"
        name="img"
        value={perfil.img}
        onChange={handleChange}
        placeholder="Ingresa la URL de la foto"
      />

      <button type="submit">Guardar cambios</button>
    </form>
  );
};

export default EditarPerfil;
