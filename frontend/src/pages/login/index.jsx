import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/Logos/PlanixImagotipo.png";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="login-container">
      <div className="left-side">
        <img src={logo} alt="Planix Logo" className="planix-logo" />
        <div className="overlay">
          <div className="text-content">
            <p>Construí tu mundo, Conectá con quienes lo hacen posible.</p>
            <a href="https://planix.com.ar" target="_blank" rel="noopener noreferrer">
              Visita nuestra web
            </a>
            <div className="dots">
              <span className="dot active"></span>
              <span className="dot"></span>
            </div>
          </div>
        </div>
      </div>
      <div className="right-side">
      <h2 className="logh2">Bienvenido</h2>
        <form className="login-form" onSubmit={handleSubmit}>
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
            <Link to="#" className="forgot-password">
              ¿Has olvidado tu contraseña?
            </Link>
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
          <button type="submit" className="btn-login">
            Iniciar Sesión
          </button>
          <div className="or-text">o inicia sesion con</div>
          <div className="social-buttons">
            <button type="button" className="btn-facebook">
              <i className="fab fa-facebook-f"></i> Facebook
            </button>
            <button type="button" className="btn-google">
              <i className="fab fa-google"></i> Google
            </button>
          </div>
          <div className="register-text">
            ¿Todavía no tenes una cuenta? <Link to="/register">Crea una ahora</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
