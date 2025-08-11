import "./landing.css";
import imagen1 from '../../assets/Landing/LandingImagen1.png';
import imagen2 from '../../assets/Landing/LandingImagen2.png';
import imagenMano from '../../assets/Landing/Mano.png';
import imagenConectar from '../../assets/Landing/Conectar.png';
import imagenGestion from '../../assets/Landing/Gestion.png';
import imagenComunicate from '../../assets/Landing/Comunicate.png';


const Landing = () => {
  return (
    <div className="pagina-landing">
      <section className="seccion-superior">
        <div className="texto-superior">
          <h1>Construimos tus sueños, edificamos tu futuro</h1>
          <p>
            Encontrá arquitectos, constructoras, proveedores y aliados para hacer
            realidad tu idea, todo en un mismo lugar.
          </p>
          <button className="boton-amarillo">Empezá ahora</button>
        </div>
        <div className="imagenes-superior">
          <div className="contenedor-imagen">
            <img src={imagen1} alt="Imagen 1" className="imagen1" />
            <div className="linea-conexion linea-desde-abajo"></div>
          </div>
          <div className="contenedor-imagen">
            <div className="linea-conexion linea-hacia-arriba"></div>
            <img src={imagen2} alt="Imagen 2" className="imagen2" />
          </div>
        </div>

      </section>


      <section className="seccion-por-que">
        <h2>¿Por qué usar Planix?</h2>
        <div className="beneficios">
          <div className="beneficio">
            <h3>Todo en un solo lugar</h3>
            <p>
              Conectá arquitectos, constructoras, proveedores e inversores en una
              plataforma centralizada.
            </p>
          </div>
          <div className="beneficio">
            <h3>Agilizá el proceso</h3>
            <p>
              Optimizá etapas de obra, resolvé imprevistos y avanzá rápidamente de principio a fin.
            </p>
          </div>
          <div className="beneficio">
            <h3>Impulsá el crecimiento</h3>
            <p>
              Mostrá tu trayectoria, ganá visibilidad y accedé a nuevos proyectos.
            </p>
          </div>
        </div>
      </section>


      <section className="seccion-como">
        <h2>¿Cómo funciona?</h2>
        <div className="pasos">
          <div className="paso">
            <img src={imagenMano} alt="Seleccioná tu rol" />
            <h4>Seleccioná tu rol</h4>
            <p>Elige tu perfil: arquitecto, constructor, proveedor o inversor.</p>
          </div>
          <div className="paso">
            <img src={imagenConectar} alt="Conectá con profesionales" />
            <h4>Conectá con profesionales</h4>
            <p>Conectá con otros profesionales del sector para colaborar y construir juntos.</p>
          </div>
          <div className="paso">
            <img src={imagenGestion} alt="Gestioná el proyecto" />
            <h4>Gestioná el proyecto</h4>
            <p>Organizá y supervisá todas las etapas del proyecto. Todo en un solo lugar.</p>
          </div>
          <div className="paso">
            <img src={imagenComunicate} alt="Comunicate" />
            <h4>Comunicate</h4>
            <p>Chateá y compartí archivos con todos los participantes del proyecto.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;