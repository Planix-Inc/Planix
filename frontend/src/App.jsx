import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/header/";
import Login from "./components/login/";
import LoginPage from "./pages/login/";
import Footer from "./components/footer/";
import Landing from "./pages/landing/";
import Profesionales from "./pages/profesionales/";
import Proveedores from "./pages/proveedores/";
import Proyectos from "./pages/proyectos/";
import Constructoras from "./pages/constructoras/";
import Notfound from "./pages/notFound/";
import PostLogin from "./pages/postLogin/";

function App() {
  const [usuarioActivo, setUsuarioActivo] = useState(null);

  const LocationWrapper = () => {
    const location = useLocation();
    const hideHeaderFooter = location.pathname === "/login";

    return (
      <>
        {!hideHeaderFooter && (
          <Header
            usuarioActivo={usuarioActivo}
            setUsuarioActivo={setUsuarioActivo}
          />
        )}
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/profesionales" element={<Profesionales />} />
          <Route path="/proveedores" element={<Proveedores />} />
          <Route path="/proyectos" element={<Proyectos />} />
          <Route path="/constructoras" element={<Constructoras />} />
          <Route path="/postLogin" element={<PostLogin />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Notfound />} />
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
