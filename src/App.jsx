import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './layout/Sidebar';
import Ofertacidm from './components/ofertacidm';
import Juicios from './components/Juicios';
import Consultas from './components/Consultas';
import ExternalForm from './components/ExternalForm';
import FormRedirect from './components/FormRedirect';
// Aquí importarás tus componentes una vez los copies a /components
const Placeholder = ({ name }) => <div className="p-5"><h2>Módulo: {name}</h2><p>Esperando código del componente...</p></div>;

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Router>
      <div className="d-flex">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        <main className="flex-grow-1" style={{
          marginLeft: isCollapsed ? '80px' : '280px',
          padding: '2rem'
        }}>
          <Routes>
            {/* Aquí irás reemplazando los Placeholder por tus componentes reales */}
            <Route path="/oferta" element={<Ofertacidm />} />
            <Route path="/juicios" element={<Juicios />} />
            <Route path="/consultas" element={<Consultas />} />

            <Route
              path="/fichas"
              element={
                <FormRedirect
                  title="Solicitud de fichas"
                  url="https://n9.cl/00qec"
                />
              }
            />
            <Route
              path="/envio"
              element={
                <FormRedirect
                  title="Envío de Juicios"
                  url="https://forms.gle/N8ykdmyA7YUWTzJr8"
                />
              }
            />
            <Route path="/" element={
              <div className="text-center mt-5">
                <h1 style={{ color: '#39A900' }}>Bienvenido, Colaborador</h1>
                <p>Seleccione una herramienta en el menú de la izquierda para comenzar.</p>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;