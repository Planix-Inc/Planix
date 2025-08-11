import { Link } from "react-router-dom";
import "./botoninversion.css";
function BotonInversion(){
    return (
    <div className="seccion-inversion">
    <h2 className="titulo-inversion">
      ¿Tenés una idea y buscás una inversión?
    </h2>
    <p className="subtitulo-inversion">
      Subí tu idea y empezá hoy mismo a colaborar <br />
      con profesionales en el área
    </p>
    <Link to="/proyectos" className="boton-inversion">
      Ir ya ➤
    </Link>
  </div>
  )
}

export default BotonInversion;
