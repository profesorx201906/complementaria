import React from 'react';
import { Spinner } from 'react-bootstrap';

const ExternalForm = ({ url, title }) => {
  const [loading, setLoading] = React.useState(true);

  return (
    <div className="w-100 h-100 d-flex flex-column animate__animated animate__fadeIn" style={{ minHeight: 'calc(100vh - 100px)' }}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h3 style={{ fontWeight: 800 }}>{title}</h3>
        {loading && (
          <div className="d-flex align-items-center text-success">
            <Spinner animation="border" size="sm" className="me-2" />
            <small>Cargando formulario...</small>
          </div>
        )}
      </div>
      
      <div className="flex-grow-1 shadow-sm rounded overflow-hidden bg-white" style={{ position: 'relative' }}>
        <iframe
          src={url}
          width="100%"
          height="100%"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          onLoad={() => setLoading(false)}
          style={{ minHeight: '75vh', border: 'none' }}
        >
          Cargando…
        </iframe>
      </div>
    </div>
  );
};

export default ExternalForm;