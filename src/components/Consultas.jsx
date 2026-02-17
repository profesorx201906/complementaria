import { useEffect, useMemo, useState } from 'react'
import Papa from 'papaparse'
import { Container, Row, Col, Form, Table, Alert, Spinner, Badge } from 'react-bootstrap'

// --- Utilidades de Formateo (Se mantienen igual) ---
function dateOnly(value) {
  const s = String(value ?? '').trim()
  if (!s) return ''
  if (s.includes('T')) return s.split('T')[0]
  return s.split(' ')[0]
}

function leftOfDoubleDash(value) {
  const s = String(value ?? '').trim()
  if (!s) return ''
  return s.split('--')[0].trim()
}

function normalizeHeader(s) {
  return String(s ?? '').trim().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/\s+/g, ' ')
}

function normalizeRowKeys(row) {
  const out = {}
  for (const k of Object.keys(row)) {
    out[normalizeHeader(k)] = row[k]
  }
  return out
}

export default function Consultas() {
  const csvUrl = import.meta.env.VITE_SHEET_SOLICITUDES_URL || import.meta.env.VITE_SHEET_CSV_URL

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [rows, setRows] = useState([])
  const [selectedEmail, setSelectedEmail] = useState('') // Inicialmente vacío

  const keys = useMemo(() => ({
    email: normalizeHeader('Correo del instructor'),
    marca: normalizeHeader('Marca temporal'),
    aprob: normalizeHeader('Fecha de aprobación'),
    nombreProg: normalizeHeader('NOMBRE DEL PROGRAMA DE FORMACIÓN'),
    codigoProg: normalizeHeader('CODIGO DE PROGRAMA'),
    ini: normalizeHeader('FECHA DE INICIO DE LA FORMACIÓN'),
    fin: normalizeHeader('FECHA DE FINALIZACIÓN DE LA FORMACIÓN'),
    ficha: normalizeHeader('Número de ficha'),
    codSol: normalizeHeader('Código de solicitud'),
  }), [])

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError('')
        if (!csvUrl) throw new Error('Falta la URL del CSV en el archivo .env')

        const res = await fetch(csvUrl)
        if (!res.ok) throw new Error(`Error HTTP ${res.status}`)

        const csvText = await res.text()
        const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true })
        
        const normalized = (parsed.data || []).map(normalizeRowKeys)
        setRows(normalized)
        
        // CAMBIO: Se eliminó la lógica que hacía setSelectedEmail(emails[0])
      } catch (e) {
        setError(e?.message || 'Error cargando datos')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [csvUrl])

  const instructorEmails = useMemo(() => {
    return [...new Set(rows.map(r => (r[keys.email] || '').trim()).filter(Boolean))].sort()
  }, [rows, keys.email])

  const filtered = useMemo(() => {
    if (!selectedEmail) return []
    return rows.filter(r => (r[keys.email] || '').trim() === selectedEmail)
  }, [rows, selectedEmail, keys.email])

  return (
    <div className="animate__animated animate__fadeIn">
      <Container fluid className="py-2">
        <Row className="mb-3">
          <Col>
            <h3 style={{ fontWeight: 800 }}>Módulo de Consultas y Solicitudes</h3>
            <p className="text-muted">Seleccione un instructor para visualizar su historial de solicitudes.</p>
          </Col>
        </Row>

        {error && <Alert variant="danger">{error}</Alert>}

        <Row className="g-3 align-items-end mb-4">
          <Col md={6} lg={4}>
            <Form.Group>
              <Form.Label className="fw-bold text-success">Instructor (Correo)</Form.Label>
              <Form.Select
                value={selectedEmail}
                onChange={(e) => setSelectedEmail(e.target.value)}
                disabled={loading}
                style={{ borderLeft: '5px solid #39A900', borderRadius: '8px' }}
              >
                {/* CAMBIO: Opción por defecto siempre visible */}
                <option value="">Seleccione correo</option>
                
                {instructorEmails.map((em) => (
                  <option key={em} value={em}>{em}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col>
            {!loading && (
              <div className="d-flex align-items-center gap-2 mb-2">
                <Badge bg="success" pill style={{ padding: '8px 15px' }}>
                  {filtered.length} Solicitudes encontradas
                </Badge>
              </div>
            )}
            {loading && (
              <div className="d-flex align-items-center gap-2 mb-2">
                <Spinner animation="grow" size="sm" variant="success" />
                <span className="small text-muted">Procesando registros...</span>
              </div>
            )}
          </Col>
        </Row>

        <div className="card shadow-sm border-0 rounded-3">
          <div className="card-body p-0">
            <Table striped hover responsive className="mb-0 align-middle">
              <thead className="bg-light">
                <tr className="text-center border-bottom border-2">
                  <th className="py-3">Solicitud</th>
                  <th className="py-3">Aprobación</th>
                  <th className="py-3 text-start">Programa de Formación</th>
                  <th className="py-3">Código</th>
                  <th className="py-3">Inicio</th>
                  <th className="py-3">Fin</th>
                  <th className="py-3">Ficha</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, idx) => (
                  <tr key={idx}>
                    <td className="text-center"><small>{dateOnly(r[keys.marca])}</small></td>
                    <td className="text-center"><Badge bg="info" text="dark">{dateOnly(r[keys.aprob])}</Badge></td>
                    <td className="fw-bold">{leftOfDoubleDash(r[keys.nombreProg])}</td>
                    <td className="text-center text-muted">{r[keys.codigoProg]}</td>
                    <td className="text-center">{r[keys.ini]}</td>
                    <td className="text-center">{r[keys.fin]}</td>
                    <td className="text-center fw-bold text-success">{r[keys.ficha]}</td>
                  </tr>
                ))}

                {!loading && (filtered.length === 0 || !selectedEmail) && (
                  <tr>
                    <td colSpan={7} className="text-center py-5">
                      <div className="text-muted">
                        <i className="bi bi-search fs-1 d-block mb-2"></i>
                        {selectedEmail ? "No se encontraron registros para este criterio." : "Seleccione un correo para ver los resultados."}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </Container>
    </div>
  )
}