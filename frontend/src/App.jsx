import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/';
import Footer from './components/footer/';
import Landing from './pages/landing/';
import Profesionales from './pages/profesionales/';
import Proveedores from './pages/proveedores/';
import Proyectos from './pages/proyectos/';
import Constructoras from './pages/constructoras/';
import Notfound from './pages/notFound/'


function App() {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/profesionales" element={<Profesionales />} />
        <Route path="/proveedores" element={<Proveedores/>} />
        <Route path="/proyectos" element={<Proyectos/>} />
        <Route path="/constructoras" element={<Constructoras/>} />
        <Route path="*" element={<Notfound/>}/>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;