import "./footer.css";
import imagotipo from "../../assets/Logos/PlanixImagotipo.png";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-contenido">
                <div className="linea-separadora arriba"></div>

                <div className="contenedor-superior">
                    <div className="footer-logo">
                        <img src={imagotipo} alt="Logo Planix" />
                    </div>

                    <div className="footer-contacto">
                        <p><i className="fas fa-map-marker-alt"></i> Yatay 240</p>
                        <p><i className="fas fa-phone"></i> (123) 456-7890</p>
                        <p><i className="fas fa-fax"></i> (123) 456-7890</p>
                    </div>

                    <div className="footer-redes">
                        <p>Redes Sociales</p>
                        <div className="iconos-redes">
                            <i className="fab fa-facebook-f"></i>
                            <i className="fab fa-twitter"></i>
                            <i className="fab fa-linkedin-in"></i>
                            <i className="fab fa-instagram"></i>
                            <i className="fab fa-youtube"></i>
                            <i className="fab fa-google-plus-g"></i>
                            <i className="fab fa-pinterest-p"></i>
                            <i className="fas fa-rss"></i>
                        </div>
                    </div>
                </div>

                <div className="linea-separadora"></div>

                <div className="footer-inferior">
                    <div className="footer-links">
                        <a href="#">NOSOTROS</a>
                        <a href="#">CONTACTANOS</a>
                        <a href="#">AYUDA</a>
                        <a href="#">POLITICAS DE PRIVACIDAD</a>
                        <a href="#">RECLAMOS</a>
                    </div>
                    <div className="footer-copy">
                        Copyright © 2025 - Planix
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
