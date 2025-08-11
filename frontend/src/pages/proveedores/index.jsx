import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { supabase } from "../../data/supabaseClient";
import "./proveedores.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BotonInversion from "../../components/botonInversion";
import BotonBuscar from "../../components/BotonBuscar"; 

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

  const handleClick2 = () => {
    navigate('/proveedores/verTodos');
  }

  const handleClick3 = (id) => {
    navigate(`/proveedores/verProductos/${id}`);
  };

  const handleClick4 = () => {
    navigate('/productos/verTodos');
  }

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
              <BotonBuscar/>
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
          <button className="boton-vertodos" onClick={handleClick2}>Ver Todos</button>
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
        <button className="boton-ver-producto"
        onClick={() => handleClick3(prod.id)}>
        Ver Producto</button>
      </div>
    ))}  
  </div>
  <button className="boton-vertodos"
  onClick={handleClick4}>
  Ver Todos</button>
</div>
<BotonInversion />
</div>
  );
};
export default Proveedores;