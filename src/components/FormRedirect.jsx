import React from 'react';

const FormRedirect = ({ title, url }) => {
  const senaGreen = "#39A900";

  return (
    <div className="d-flex align-items-center justify-content-center animate__animated animate__fadeIn" style={{ minHeight: '70vh' }}>
      <div className="card shadow-sm border-0 text-center p-5" style={{ maxWidth: '600px', borderRadius: '15px' }}>
        <div className="mb-4">
          <i className="bi bi-cloud-upload" style={{ fontSize: '4rem', color: senaGreen }}></i>
        </div>
        <h2 className="fw-bold mb-3">{title}</h2>
        <p className="text-muted mb-4">
          Este formulario requiere <strong>subida de archivos</strong>. Por seguridad, Google requiere que se complete en su plataforma oficial.
        </p>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn btn-lg text-white"
          style={{ backgroundColor: senaGreen, padding: '12px 40px', borderRadius: '10px' }}
        >
          Abrir Formulario Oficial <i className="bi bi-box-arrow-up-right ms-2"></i>
        </a>
      </div>
    </div>
  );
};

export default FormRedirect;