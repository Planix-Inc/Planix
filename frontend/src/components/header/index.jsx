import './header.css';
import logo from '../../assets/Logos/logo.png';
import { Link } from "react-router-dom";


function Header() {
    return (
        <header className="encabezado">
            <div className="contenido-encabezado">
                <div className="logo">
                    <Link to="/">
                    <img src={logo} alt="Logo Planix" />
                    </Link>
                    
                </div>
                <nav className="navegacion">
                    <Link to="/profesionales">Profesionales</Link>
                    <Link to="/proveedores">Proveedores</Link>
                    <Link to="/proyectos">Proyectos</Link>
                    <Link to="/constructoras">Constructoras</Link>
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