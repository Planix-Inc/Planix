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
import VerPerfilProfesionales from "./pages/profesionales/verPerfil/";
import VerPerfilProveedores from "./pages/proveedores/verPerfil/";
import VerTodosProveedores from "./pages/proveedores/verTodos";
import VerPerfilConstructoras from "./pages/constructoras/verConstructora/";
import VerPerfilProyectos from "./pages/proyectos/verProyectos/";
import VerProductosProveedores from "./pages/proveedores/productos/verProducto";
import VerTodosProductos from "./pages/proveedores/productos/verTodos/";




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
          <Route path="/profesionales/verPerfil/:id" element={<VerPerfilProfesionales />} />
          <Route path="/proveedores" element={<Proveedores />} />
          <Route path="/proveedores/verPerfil/:id" element={<VerPerfilProveedores />} />
          <Route path="/proveedores/verTodos" element={<VerTodosProveedores />} />
          <Route path="/proveedores/verProductos/:id" element={<VerProductosProveedores/>} />
          <Route path="/productos/verTodos" element={<VerTodosProductos />} />
          <Route path="/proyectos" element={<Proyectos />} />
          <Route path="/constructoras" element={<Constructoras />} />
          <Route path="/constructoras/verPerfil/:id" element={<VerPerfilConstructoras/>}></Route>
          <Route path="/proyectos/verPerfil/:id" element={<VerPerfilProyectos/>}></Route>
       
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
