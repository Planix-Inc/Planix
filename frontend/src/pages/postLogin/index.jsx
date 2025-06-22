import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import { supabase } from "../../data/supabaseClient";
import "../proveedores/proveedores.css";
import "../proyectos/proyectos.css";
import BotonInversion from "../../components/botonInversion"; 
import "./postLogin.css"; 

const PostLogin = () => {
  const location = useLocation();
  const usuario = location.state?.usuario;

  const [proveedores, setProveedores] = useState([]);
  const [proyectosDestacados, setProyectosDestacados] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: ProveedoresData } = await supabase
        .from("Usuario")
        .select("*")
        .eq("categoriausuarioId", 2)
        .eq("destacado", true);

      const { data: ProyectosData } = await supabase
        .from("Proyectos")
        .select("*")
        .eq("destacado", true);

      setProveedores(ProveedoresData || []);
      setProyectosDestacados(ProyectosData || []);
    };

    fetchData();
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
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <>
    
      <div className="bienvenida-container">
        <h1>¡Bienvenido, {usuario}!</h1>
        {usuario === "Profesional" && (
          <p>Te mostramos proyectos para trabajar como profesional.</p>
        )}
        {usuario === "Inversionista" && (
          <p>Revisá ideas para invertir en el mundo de la construcción.</p>
        )}
        {usuario === "Proveedor" && (
          <p>Acá podés publicar tus productos y llegar a más clientes.</p>
        )}
        {usuario === "Constructora" && (
          <p>Sumate a licitaciones activas y conectá con profesionales.</p>
        )}
        {usuario === "Usuario" && (
          <p>Explorá todo lo que ofrece la plataforma y descubrí nuevos proyectos.</p>
        )}
        </div>

        <div className="seccion-proyectos">
          <h2 className="titulo-seccion">Proyectos destacados</h2>
          <Slider {...configuracionCarrusel} className="carrusel-proyectos">
            {proyectosDestacados.map((proy) => (
              <div key={proy.id} className="tarjeta-proyectos">
                <div className="imagen-proyectos">
                  <img src={proy.img} alt={proy.nombre} />
                </div>
                <h3 className="nombre-proyectos">{proy.nombre}</h3>
                <p className="texto-localidad">
                  📍 {proy.direccion} - ⭐ {proy.valoracion}
                </p>
                <button className="boton-ver-perfil">Ver proyecto</button>
              </div>
            ))}
          </Slider>
        </div>

        <div className="seccion-proveedores">
          <h2 className="titulo-seccion-proveedores">Proveedores destacados</h2>
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
                <button className="boton-ver-perfil-proveedor">Ver perfil</button>
              </div>
            ))}
          </Slider>
        </div>
    <div>
      <BotonInversion/>
    </div>
    </>
  );
};

export default PostLogin;
