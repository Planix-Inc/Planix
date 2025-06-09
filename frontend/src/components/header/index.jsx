import React from 'react';
import './header.css';
import logo from '../../assets/Logos/logo.png';
import { Link, useLocation } from "react-router-dom";

function Header() {
    const location = useLocation();
    const currentPath = location.pathname;

    const isActive = (path) => currentPath.startsWith(path) ? 'active' : '';

    return (
        <header className="encabezado">
            <div className="contenido-encabezado">
                <div className="logo">
                    <Link to="/" className={isActive('/')}>
                        <img src={logo} alt="Logo Planix" />
                    </Link>
                </div>
                <nav className="navegacion">
                    <Link to="/profesionales" className={isActive('/profesionales')}>Profesionales</Link>
                    <Link to="/proveedores" className={isActive('/proveedores')}>Proveedores</Link>
                    <Link to="/proyectos" className={isActive('/proyectos')}>Proyectos</Link>
                    <Link to="/constructoras" className={isActive('/constructoras')}>Constructoras</Link>
                </nav>
                <div className="botones">
                    <button className="btn-iniciar">Iniciar sesión</button>
                    <button className="btn-registrarse">Registrarse</button>
                </div>
            </div>
        </header>
    );
}

export default Header;
