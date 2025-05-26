import './header.css';
import logo from '../../assets/Logos/logo.png';
import { Link } from "react-router-dom";

function Header() {
    return (
        <header className="encabezado">
            <div className="contenido-encabezado">
                <div className="logo">
                    <img src={logo} alt="Logo Planix" />
                </div>
                <nav className="navegacion">
                    <Link to="./pages/profesionales/index.jsx">Profesionales</Link>
                    <Link to="">Proveedores</Link>
                    <Link to="">Proyectos</Link>
                    <Link to="">Constructoras</Link>
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