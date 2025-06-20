import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header/";
import Login from "./components/login/";
import Footer from "./components/footer/";
import Landing from "./pages/landing/";
import Profesionales from "./pages/profesionales/";
import Proveedores from "./pages/proveedores/";
import Proyectos from "./pages/proyectos/";
import Constructoras from "./pages/constructoras/";
import Notfound from "./pages/notFound/";
import PostLogin from './pages/postLogin/';

function App() {
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const abrirModal = () => setMostrarModal(true);
  const cerrarModal = () => setMostrarModal(false);

  return (
    <Router>
      <Header abrirLogin={abrirModal} />
      {mostrarModal && (
        <Login setUsuarioActivo={setUsuarioActivo} cerrarModal={cerrarModal} />
      )}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/profesionales" element={<Profesionales />} />
        <Route path="/proveedores" element={<Proveedores />} />
        <Route path="/proyectos" element={<Proyectos />} />
        <Route path="/constructoras" element={<Constructoras />} />
        <Route path="/postLogin" element={<PostLogin />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;