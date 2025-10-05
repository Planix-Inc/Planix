import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../data/supabaseClient.js";
import logo from "../../assets/Logos/logo.png";
import campanita from "../../assets/icons/bell.png"; // Using chat.png as bell icon
import "./header.css";

function Encabezado({ usuarioActivo, setUsuarioActivo }) {
  const ubicacion = useLocation();
  const rutaActual = ubicacion.pathname;
  const referenciaNavegacion = useRef(null);
  const referenciaSubrayado = useRef(null);
  const [indiceActivo, setIndiceActivo] = useState(0);
  const [notificacionesCount, setNotificacionesCount] = useState(0);
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

  // Fetch notifications count
  useEffect(() => {
    const fetchNotificacionesCount = async () => {
      if (!usuarioId) return;
      const { count, error } = await supabase
        .from("Aceptacion")
        .select("*", { count: "exact", head: true })
        .eq("usuario2_id", usuarioId)
        .is("Aceptar", null)
        .eq("Aviso", true);
      if (error) {
        console.error("Error fetching notifications:", error);
      } else {
        setNotificacionesCount(count);
      }
    };
    fetchNotificacionesCount();
  }, [usuarioId]);

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
              {/* Notification bell icon */}
              <div className="campanita-container" style={{ position: "relative", cursor: "pointer", marginRight: "10px" }} onClick={() => navigate("/notificaciones")}>
                <img src={campanita} alt="Notificaciones" style={{ width: "24px", height: "24px" }} />
                {notificacionesCount > 0 && (
                  <span style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-5px",
                    backgroundColor: "red",
                    color: "white",
                    borderRadius: "50%",
                    padding: "2px 6px",
                    fontSize: "12px",
                    fontWeight: "bold"
                  }}>
                    {notificacionesCount}
                  </span>
                )}
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
