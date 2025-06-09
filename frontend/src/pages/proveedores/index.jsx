import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { supabase } from "../../data/supabaseClient";
import "./proveedores.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    const fetchProveedores = async () => {
      const { data: Usuario, error } = await supabase
        .from("Usuario")
        .select("*")
        .eq("categoriausuarioId", 2)
        .eq("destacado", true);

      if (error) {
        console.error("Error al obtener proveedores destacados:", error);
      } else {
        setProveedores(Usuario);
      }
    };

    fetchProveedores();
  }, []);

  const configuracionCarrusel = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div>
      <div className="contenedor-portada-proveedores">
        <div className="capa-oscura-proveedores">
          <h1>Encontrá proveedores para tu proyecto</h1>
          <div className="buscador-proveedores">
            <input
              type="text"
              placeholder="Materiales, herramientas, equipamiento, etc"
            />
            <button className="boton-buscar-proveedores">🔍</button>
          </div>
        </div>
      </div>

      <div className="seccion-proveedores">
        <h2 className="titulo-seccion-proveedores">Proveedores Destacados</h2>
        <Slider {...configuracionCarrusel} className="carrusel-proveedores">
          {proveedores.map((prov) => (
            <div key={prov.id} className="tarjeta-proveedor">
              <div className="imagen-proveedor">
                <img src={prov.img} alt={prov.razonSocial} />
              </div>
              <h3 className="nombre-proveedor">{prov.razonSocial}</h3>
              <p className="texto-localidad-proveedor">{prov.localidad}</p>
              <button className="boton-ver-perfil-proveedor">Ver perfil</button>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Proveedores;
