import { useNavigate } from 'react-router-dom';
import "./login.css";

const Login = ({ setUsuarioActivo, cerrarModal }) => {
  const tipos = ["Profesional", "Inversionista", "Proveedor", "Constructora", "Usuario"];
  const navigate = useNavigate();

  const handleSeleccion = (tipo) => {
    setUsuarioActivo(tipo);
    cerrarModal();
    navigate('/postLogin', { state: { usuario: tipo } });
  };

  return (
    <div className="modal-fondo">
      <div className="modal-contenido">
        <h2>Seleccioná tu tipo de usuario</h2>
        <ul className="lista-usuarios">
          {tipos.map((tipo) => (
            <li key={tipo}>
              <button onClick={() => handleSeleccion(tipo)}>{tipo}</button>
            </li>
          ))}
        </ul>
        <button className="cerrar-modal" onClick={cerrarModal}>Cancelar</button>
      </div>
    </div>
  );
};

export default Login;