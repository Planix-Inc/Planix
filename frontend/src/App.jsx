import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/header/";
import LoginPage from "./pages/login/";
import Footer from "./components/footer/";
import Landing from "./pages/landing/";
import Profesionales from "./pages/profesionales/";
import Proveedores from "./pages/proveedores/";
import Proyectos from "./pages/proyectos/";
import Constructoras from "./pages/constructoras/";
import Notfound from "./pages/notFound/";
import PostLogin from "./pages/postLogin/";
import Registro  from "./pages/registro";
import VerPerfil from "./pages/profesionales/verPerfil.jsx";
import verPerfil from "./pages/constructoras/verPerfil.jsx"

function App() {
  const [usuarioActivo, setUsuarioActivo] = useState(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuarioLogueado");
    if (usuarioGuardado) {
      setUsuarioActivo(JSON.parse(usuarioGuardado));
    }
  }, []);

  const LocationWrapper = () => {
    const location = useLocation();
    const hideHeaderFooter = location.pathname === "/login" || location.pathname === "/registro";

    return (
      <>
        {!hideHeaderFooter && (
          <Header usuarioActivo={usuarioActivo} setUsuarioActivo={setUsuarioActivo} />
        )}
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/profesionales" element={<Profesionales />} />
          <Route path="/profesionales/verPerfil/:id" element={<VerPerfil />} />
          <Route path="/proveedores" element={<Proveedores />} />
          <Route path="/proyectos" element={<Proyectos />} />
          <Route path="/constructoras" element={<Constructoras />} />
          <Route path="/constructoras/verPerfil/:id" element={<verPerfil/>}></Route>
          <Route
            path="/postLogin"
            element={<PostLogin usuarioActivo={usuarioActivo} />}
          />
          <Route
            path="/login"
            element={<LoginPage setUsuarioActivo={setUsuarioActivo} />}
          />
          <Route path="*" element={<Notfound />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/verPerfil/:id" element={<VerPerfil />} />
        </Routes>
        {!hideHeaderFooter && <Footer />}
      </>
    );
  };

  return (
    <Router>
      <LocationWrapper />
    </Router>
  );
}

export default App;
