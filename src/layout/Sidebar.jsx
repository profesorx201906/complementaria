import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  
  // Colores institucionales SENA
  const SENA_GREEN = "#39A900";
  const SENA_DARK = "#1F7D5C";

  // Configuración de los ítems del menú con propiedad 'group' para la división
  const menuItems = [
    { path: '/oferta', label: 'Oferta Complementaria Abierta', icon: 'bi-grid-3x3-gap', group: 'consultas' },
    { path: '/juicios', label: 'Juicios Enviados', icon: 'bi-person-check', group: 'consultas' },
    { path: '/consultas', label: 'Solicitudes Realizadas', icon: 'bi-search', group: 'consultas' },
    { path: '/fichas', label: 'Registro de Fichas', icon: 'bi-file-earmark-plus', group: 'registro' },
    { path: '/envio', label: 'Envio de Juicios', icon: 'bi-pencil-square', group: 'registro' },
  ];

  // Estilos dinámicos para el contenedor principal
  const sidebarStyles = {
    width: isCollapsed ? '80px' : '280px',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundColor: '#ffffff',
    borderRight: `3px solid ${SENA_GREEN}`,
    transition: 'all 0.3s ease-in-out',
    zIndex: 1050,
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  };

  // Función auxiliar para renderizar los items
  const renderMenuItems = (items) => items.map((item) => {
    const isActive = location.pathname === item.path;
    return (
      <Link key={item.path} to={item.path} className="text-decoration-none">
        <div 
          className={`card mb-2 border-0 transition-all ${isActive ? 'shadow-sm' : ''}`}
          style={{
            backgroundColor: isActive ? '#f0f9f0' : 'transparent',
            borderLeft: isActive ? `5px solid ${SENA_GREEN}` : '5px solid transparent',
            transition: 'all 0.2s'
          }}
        >
          <div className="card-body p-2 d-flex align-items-center">
            <i 
              className={`${item.icon} fs-5`} 
              style={{ 
                color: isActive ? SENA_DARK : '#6c757d',
                minWidth: '40px',
                textAlign: 'center'
              }}
            ></i>
            {!isCollapsed && (
              <span className={`animate__animated animate__fadeIn ms-2 ${isActive ? 'fw-bold text-dark' : 'text-secondary'}`}
                    style={{ fontSize: '0.9rem' }}>
                {item.label}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  });

  return (
    <div style={sidebarStyles} className="shadow-lg">
      
      {/* CABECERA / LOGO */}
      <div className="p-3 d-flex align-items-center justify-content-between" 
           style={{ backgroundColor: SENA_GREEN, color: 'white', minHeight: '60px' }}>
        {!isCollapsed && (
          <div className="d-flex align-items-center animate__animated animate__fadeIn">
            <i className="bi bi-mortarboard-fill me-2 fs-4"></i>
            <span className="fw-bold m-0" style={{ fontSize: '0.9rem', letterSpacing: '1px' }}>
              COORDINACIÓN ACADÉMICA COMPLEMENTARIA
            </span>
          </div>
        )}
        <button 
          className="btn btn-sm btn-light d-flex align-items-center justify-content-center"
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{ width: '32px', height: '32px', borderRadius: '8px' }}
        >
          <i className={`bi ${isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
        </button>
      </div>

      {/* CUERPO DEL MENÚ */}
      <div className="flex-grow-1 p-2 mt-2 overflow-auto">
        
        {/* SECCIÓN CONSULTAS */}
        {!isCollapsed && (
          <p className="text-muted small fw-bold px-3 mb-2 mt-2" style={{ fontSize: '0.7rem', opacity: 0.8 }}>
            CONSULTAS Y REPORTES
          </p>
        )}
        <div className="list-group list-group-flush">
          {renderMenuItems(menuItems.filter(i => i.group === 'consultas'))}
        </div>

        {/* DIVISOR */}
        <hr className="mx-3 my-3" style={{ opacity: 0.1 }} />

        {/* SECCIÓN REGISTRO */}
        {!isCollapsed && (
          <p className="text-muted small fw-bold px-3 mb-2" style={{ fontSize: '0.7rem', opacity: 0.8 }}>
            REGISTRO DE INFORMACIÓN
          </p>
        )}
        <div className="list-group list-group-flush">
          {renderMenuItems(menuItems.filter(i => i.group === 'registro'))}
        </div>

      </div>

      {/* PIE DE PÁGINA / PERFIL */}
      <div className="p-3 border-top bg-light">
        <div className="d-flex align-items-center">
          <div className="bg-success rounded-circle d-flex align-items-center justify-content-center text-white" 
               style={{ width: '35px', height: '35px', minWidth: '35px' }}>
            <i className="bi bi-person-fill"></i>
          </div>
          {!isCollapsed && (
            <div className="ms-3 overflow-hidden animate__animated animate__fadeIn">
              <p className="mb-0 fw-bold text-dark text-truncate" style={{ fontSize: '0.8rem' }}>
                Javier Díaz Díaz
              </p>
              <p className="mb-0 text-muted" style={{ fontSize: '0.7rem' }}>
                Coordinador Académico
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Estilos CSS Inline para efectos de Hover */}
      <style>{`
        .list-group-item-action:hover {
          background-color: #f8f9fa;
        }
        .transition-all {
          transition: all 0.2s ease-in-out;
        }
        .card:hover {
          background-color: #f4fdf4 !important;
          transform: ${isCollapsed ? 'none' : 'translateX(5px)'};
        }
      `}</style>
    </div>
  );
};

export default Sidebar;