import './header.css';
import logo from '../../assets/Logos/logo.png';

function Header() {
    return (
        <header className="encabezado">
            <div className="contenido-encabezado">
                <div className="logo">
                    <img src={logo} alt="Logo Planix" />
                </div>
                <nav className="navegacion">
                    <a href="#">Profesionales</a>
                    <a href="#">Profesionales</a>
                    <a href="#">Profesionales</a>
                    <a href="#">Profesionales</a>
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