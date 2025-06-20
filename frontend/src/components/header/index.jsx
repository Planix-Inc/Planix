import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/Logos/logo.png';
import './header.css';

function Encabezado({ abrirLogin, usuario }) {
  const ubicacion = useLocation();
  const rutaActual = ubicacion.pathname;
  const referenciaNavegacion = useRef(null);
  const referenciaSubrayado = useRef(null);
  const [indiceActivo, setIndiceActivo] = useState(0);

  const rutas = [
    { ruta: '/profesionales', etiqueta: 'Profesionales' },
    { ruta: '/proveedores', etiqueta: 'Proveedores' },
    { ruta: '/proyectos', etiqueta: 'Proyectos' },
    { ruta: '/constructoras', etiqueta: 'Constructoras' },
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
      subrayado.style.width = '0';
    }
  }, [indiceActivo]);

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
                className={rutaActual.startsWith(ruta.ruta) ? 'activo' : ''}
              >
                {ruta.etiqueta}
              </Link>
            ))}
            {rutaActual !== '/' && <span className="subrayado" ref={referenciaSubrayado}></span>}
          </div>
        </nav>
        <div className="botones">
          {usuario ? (
            <div className="perfil-usuario">
              <img
                src={usuario.img}
                alt="Foto de perfil"
                className="foto-perfil"
                style={{ width: 40, height: 40, borderRadius: '50%' }}
              />
            </div>
          ) : (
            <>
              <button className="btn-iniciar" onClick={abrirLogin}>Iniciar sesión</button>
              <button className="btn-registrarse">Registrarse</button>
            </>
          )}
        </div>
    </div>
    </header>
  );
}

export default Encabezado;