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
  const [todosLosProveedores, setTodosLosProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

    const fetchTodosLosProveedores = async () => {
      const { data: Usuario, error } = await supabase
        .from("Usuario")
        .select("*")
        .eq("categoriausuarioId", 2);

      if (error) {
        console.error("Error al obtener todos los proveedores:", error);
      } else {
        setTodosLosProveedores(Usuario);
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
    fetchTodosLosProveedores();
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

  const normalize = (text) =>
    (text || "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const filteredProveedores = todosLosProveedores.filter((prov) => {
    if (!searchTerm) return true;
    const razonSocial = `${prov.razonSocial}`;
    return normalize(razonSocial).includes(normalize(searchTerm));
  });

  const hayBusqueda = searchTerm.trim() !== "";

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

  const mostrarProveedores = (titulo, listaProveedores) => (
    <div className="seccion-proveedores">
      <h2 className="titulo-seccion-proveedores">{titulo}</h2>
      <Slider {...configuracionCarrusel} className="carrusel-proveedores">
        {listaProveedores.map((prov) => (
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
      {!hayBusqueda && <button className="boton-vertodos" onClick={handleClick2}>Ver Todos</button>}
    </div>
  );

  return (
    <div>
      <div>
        <div className="contenedor-portada-proveedores">
          <div className="capa-oscura-proveedores">
            <h1>Encontrá proveedores para tu proyecto</h1>
            <div className="buscador-proveedores">
              <input
                type="text"
                placeholder="Buscar por razón social"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <BotonBuscar onClick={() => { /* la búsqueda ocurre al tipear */ }} />
            </div>
          </div>
        </div>
      
        {hayBusqueda ? (
          mostrarProveedores("Resultados", filteredProveedores)
        ) : (
          mostrarProveedores("Proveedores Destacados", proveedores)
        )}
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