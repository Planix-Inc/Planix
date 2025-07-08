import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../data/supabaseClient.js";
import logo from "../../assets/Logos/PlanixImagotipo.png";
import "./login.css";

const Login = ({ setUsuarioActivo }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from("Usuario")
      .select("id, nombre, apellido, img, Email, categoriausuarioId, razonSocial")
      .eq("Email", email)
      .eq("Contraseña", password)
      .single();

    if (error || !data) {
      alert("Email o contraseña incorrectos");
      console.error("Login fallido:", error?.message || "No encontrado");
    } else {
      localStorage.setItem("usuarioLogueado", JSON.stringify(data));
      setUsuarioActivo(data); // Actualizo el estado global
      navigate("/postLogin", { state: { usuario: data } });
    }
  };

  return (
    <div className="login-container">
      <div className="left-side">
        <Link to={"/"}>
          <img src={logo} alt="Planix Logo" className="planix-logo" />
        </Link>
        <div className="overlay">
          <div className="text-content">
            <p>Construí tu mundo, Conectá con quienes lo hacen posible.</p>
            <div className="dots">
              <span className="dot active"></span>
              <span className="dot"></span>
            </div>
          </div>
        </div>
      </div>

      <div className="right-side">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Bienvenido</h2>

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Ingresa tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password" className="password-label">
            Contraseña
          </label>
          <div className="password-input-wrapper">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <Link to="#" className="forgot-password">
            ¿Has olvidado tu contraseña?
          </Link>

          <button type="submit" className="btn-login">
            Iniciar Sesión
          </button>

          <div className="or-text">o inicia sesión con</div>

          <div className="social-buttons">
            <button type="button" className="btn-facebook">
              <i className="fab fa-facebook-f"></i> Facebook
            </button>
            <button type="button" className="btn-google">
              <i className="fab fa-google"></i> Google
            </button>
          </div>

          <div className="register-text">
            ¿Todavía no tenés una cuenta? <Link to="/registro">Crea una ahora</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
