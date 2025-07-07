import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { supabase } from "../../data/supabaseClient";
import "./proveedores.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BotonInversion from "../../components/botonInversion";

const Proveedores = () => {
  const navigate = useNavigate();
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);

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

    const fetchProductos = async () => {
      const { data: Productos, error } = await supabase
        .from("Productos")
        .select("*")
        .eq("destacado", true);

      if (error) {
        console.error("Error al obtener productos destacados:", error);
      } else {
        setProductos(Productos);
      }
    };

    fetchProveedores();
    fetchProductos();
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

  const handleClick = (id) => {
    navigate(`/proveedores/verPerfil/${id}`);
  };

  return (
    <div>
      <div>
        <div className="contenedor-portada-proveedores">
          <div className="capa-oscura-proveedores">
            <h1>Encontrá proveedores para tu proyecto</h1>
            <div className="buscador-proveedores">
              <input
                type="text"
                placeholder="Materiales, herramientas, equipamiento, etc"
              />
              <button className="boton-buscar-proveedores">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="25"
                  height="25"
                  viewBox="0 0 50 50"
                >
                  <path d="M 21 3 C 11.601563 3 4 10.601563 4 20 C 4 29.398438 11.601563 37 21 37 C 24.355469 37 27.460938 36.015625 30.09375 34.34375 L 42.375 46.625 L 46.625 42.375 L 34.5 30.28125 C 36.679688 27.421875 38 23.878906 38 20 C 38 10.601563 30.398438 3 21 3 Z M 21 7 C 28.199219 7 34 12.800781 34 20 C 34 27.199219 28.199219 33 21 33 C 13.800781 33 8 27.199219 8 20 C 8 12.800781 13.800781 7 21 7 Z"></path>
                </svg>
              </button>
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
                <p className="texto-localidad-proveedor">
                  📍 {prov.localidad} - ⭐ {prov.valoracion}
                </p>
                <button
                  className="boton-ver-perfil-proveedor"
                  onClick={() => handleClick(prov.id)}>
                  Ver perfil
                </button>
              </div>
            ))}
          </Slider>
          <button className="boton-vertodos">Ver Todos</button>
        </div>
      </div>

      <div className="seccion-proveedores">
  <h2 className="titulo-seccion-proveedores">Productos destacados</h2>

  <div className="grid-productos">
    {productos.map((prod) => (
      <div key={prod.id} className="tarjeta-producto">
        <img src={prod.Fotos} />
        <h3 className="nombre-producto">{prod.descripcion}</h3>
        <p className="valoracion-producto">
          ${prod.precio} - ⭐ {prod.valoracion}
        </p>
        <button className="boton-ver-producto">Ver Producto</button>
      </div>
    ))}  
  </div>
  <button className="boton-vertodos">Ver Todos</button>
</div>
<BotonInversion />
</div>
  );
};
export default Proveedores;
