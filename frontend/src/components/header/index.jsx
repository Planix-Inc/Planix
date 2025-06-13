import React, { useEffect, useRef, useState } from 'react';
import './header.css';
import logo from '../../assets/Logos/logo.png';
import { Link, useLocation } from "react-router-dom";

function Header() {
    const location = useLocation();
    const currentPath = location.pathname;
    const navRef = useRef(null);
    const underlineRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const routes = [
        { path: '/profesionales', label: 'Profesionales' },
        { path: '/proveedores', label: 'Proveedores' },
        { path: '/proyectos', label: 'Proyectos' },
        { path: '/constructoras', label: 'Constructoras' }
    ];

    useEffect(() => {
        const index = routes.findIndex(route => currentPath.startsWith(route.path));
        setActiveIndex(index >= 0 ? index : 0);
    }, [currentPath]);

    useEffect(() => {
        const nav = navRef.current;
        const underline = underlineRef.current;
        if (nav && underline) {
            const activeLink = nav.children[activeIndex];
            if (activeLink) {
                const { offsetLeft, offsetWidth } = activeLink;
                underline.style.left = `${offsetLeft}px`;
                underline.style.width = `${offsetWidth}px`;
            }
        }
    }, [activeIndex]);

    return (
        <header className="encabezado">
            <div className="contenido-encabezado">
                <div className="logo">
                    <Link to="/">
                        <img src={logo} alt="Logo Planix" />
                    </Link>
                </div>
                <nav className="navegacion">
                    <div className="nav-wrapper" ref={navRef}>
                        {routes.map((route, index) => (
                            <Link
                                key={route.path}
                                to={route.path}
                                className={currentPath.startsWith(route.path) ? 'active' : ''}
                            >
                                {route.label}
                            </Link>
                        ))}
                        <span className="subrayado" ref={underlineRef}></span>
                    </div>
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
