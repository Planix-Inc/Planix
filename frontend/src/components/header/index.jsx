import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/Logos/logo.png";
import "./header.css";

function Encabezado({ usuarioActivo, setUsuarioActivo }) {
  const ubicacion = useLocation();
  const rutaActual = ubicacion.pathname;
  const referenciaNavegacion = useRef(null);
  const referenciaSubrayado = useRef(null);
  const [indiceActivo, setIndiceActivo] = useState(0);
  const navigate = useNavigate();

  // Revisar si hay usuario logueado
  const usuario = usuarioActivo || JSON.parse(localStorage.getItem("usuarioLogueado"));
  const usuarioId = usuario?.id;
  const usuarioImg = usuario?.img;

  const rutas = [
    { ruta: "/profesionales", etiqueta: "Profesionales" },
    { ruta: "/proveedores", etiqueta: "Proveedores" },
    { ruta: "/proyectos", etiqueta: "Proyectos" },
    { ruta: "/constructoras", etiqueta: "Constructoras" },
  ];

  useEffect(() => {
    const indice = rutas.findIndex((r) => rutaActual.startsWith(r.ruta));
    setIndiceActivo(indice >= 0 ? indice : -1);
  }, [rutaActual]);

  useEffect(() => {
    const navegacion = referenciaNavegacion.current;
    const subrayado = referenciaSubrayado.current;
    if (navegacion && subrayado && indiceActivo >= 0) {
      const enlaceActivo = navegacion.children[indiceActivo];
      if (enlaceActivo) {
        const { offsetLeft, offsetWidth } = enlaceActivo;
        subrayado.style.left = `${offsetLeft}px`;
        subrayado.style.width = `${offsetWidth}px`;
      }
    } else if (subrayado) {
      subrayado.style.width = "0";
    }
  }, [indiceActivo]);

  const cerrarSesion = () => {
    setUsuarioActivo(null);
    localStorage.removeItem("usuarioLogueado");
    navigate("/");
  };

  const handleIniciarSesion = () => {
    navigate("/login");
  };

  const handleVerPerfil = () => {
    if (!usuario) return;

    
    const categoria = Number(usuario.categoriaUsuarioId || usuario.categoriausuarioId);

    switch (categoria) {
      case 1:
        navigate(`/profesionales/verPerfil/${usuarioId}`);
        break;
      case 2:
        navigate(`/proveedores/verPerfil/${usuarioId}`);
        break;
      case 3:
        navigate(`/constructoras/verPerfil/${usuarioId}`);
        break;
      case 4:
        navigate(`/inversionistas/verPerfil/${usuarioId}`);
        break;
      default:
        console.error("Categoría desconocida:", usuario);
        break;
    }
  };

  return (
    <header className="encabezado">
      <div className="contenido-encabezado">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Logo Planix" />
          </Link>
        </div>

        <nav className="navegacion">
          <div className="contenedor-navegacion" ref={referenciaNavegacion}>
            {rutas.map((ruta, indice) => (
              <Link
                key={ruta.ruta}
                to={ruta.ruta}
                className={rutaActual.startsWith(ruta.ruta) ? "activo" : ""}
              >
                {ruta.etiqueta}
              </Link>
            ))}
            {rutaActual !== "/" && (
              <span className="subrayado" ref={referenciaSubrayado}></span>
            )}
          </div>
        </nav>

        <div className="botones">
          {usuario ? (
            <div className="usuario-logueado">
              <div className="fotoPerfil" onClick={handleVerPerfil}>
                <img src={usuarioImg} alt="Foto de perfil" className="img-avatar" />
              </div>
              <button className="btn-cerrar-sesion" onClick={cerrarSesion}>
                Cerrar sesión
              </button>
            </div>
          ) : (
            <>
              <button className="btn-iniciar" onClick={handleIniciarSesion}>
                Iniciar sesión
              </button>
              <button className="btn-registrarse" onClick={() => navigate("/registro")}>
                Registrarse
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Encabezado;
