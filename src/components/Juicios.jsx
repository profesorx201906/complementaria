import { useEffect, useMemo, useState } from 'react'
import Papa from 'papaparse'
import { Container, Row, Col, Form, Table, Alert, Spinner, Badge } from 'react-bootstrap'


// --- Utilidades de Normalización ---
function normalizeHeader(s) {
  return String(s ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '') 
    .replace(/\s+/g, ' ')
}

function normalizeRowKeys(row) {
  const out = {}
  for (const k of Object.keys(row)) {
    out[normalizeHeader(k)] = row[k]
  }
  return out
}

function dateOnly(value) {
  const s = String(value ?? '').trim()
  if (!s) return ''
  if (s.includes('T')) return s.split('T')[0]
  return s.split(' ')[0]
}

function isYes(value) {
  const s = String(value ?? '').trim().toLowerCase()
  return s === 'si' || s === 'sí' || s === 'yes' || s === 'true' || s === '1'
}

// CAMBIO: Nombre de la función exportada
export default function Juicios() {
  // Asegúrate de que esta URL en el .env sea la correspondiente a la hoja de Juicios
  const csvUrl = import.meta.env.VITE_SHEET_JUICIOS_URL

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [rows, setRows] = useState([])
  const [query, setQuery] = useState('')

  const keys = useMemo(() => {
    return {
      marca: normalizeHeader('Marca temporal'),
      correo: normalizeHeader('Dirección de correo electrónico'),
      nombre: normalizeHeader('Nombre Instructor'),
      ficha: normalizeHeader('Codigo Ficha'),
      gestionado: normalizeHeader('gestionado'),
      fechaGestion: normalizeHeader('fecha gestion'),
    }
  }, [])

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
      } catch (e) {
        setError(e?.message || 'Error cargando datos')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [csvUrl])

  const hasQuery = useMemo(() => String(query ?? '').trim().length > 0, [query])

  const filtered = useMemo(() => {
    const q = String(query ?? '').trim().toLowerCase()
    if (!q) return []

    return rows.filter((r) => {
      const nombre = String(r[keys.nombre] ?? '').toLowerCase()
      const correo = String(r[keys.correo] ?? '').toLowerCase()
      const ficha = String(r[keys.ficha] ?? '').toLowerCase()
      return nombre.includes(q) || correo.includes(q) || ficha.includes(q)
    })
  }, [rows, query, keys])

  return (
    <div className="animate__animated animate__fadeIn">
      <Container fluid className="py-2">
        <Row className="mb-3">
          <Col>
            <h3 className="mb-1" style={{ fontWeight: 800 }}>Reporte envío de Juicios</h3>
            <p className="text-muted small">Consulta el estado de gestión de juicios evaluativos.</p>
          </Col>
        </Row>

        {error && <Alert variant="danger">{error}</Alert>}

        <Row className="g-3 align-items-end mb-4">
          <Col md={6} lg={5}>
            <Form.Group>
              <Form.Label className="fw-bold">Filtrar información</Form.Label>
              <Form.Control
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nombre, Correo o Ficha..."
                disabled={loading}
                style={{ borderLeft: '5px solid #39A900' }}
              />
            </Form.Group>
          </Col>

          <Col>
            {loading ? (
              <div className="d-flex align-items-center gap-2 mb-2">
                <Spinner animation="border" size="sm" variant="success" />
                <span>Cargando base de datos...</span>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="text-muted">Resultados:</span>
                <Badge bg="success">{hasQuery ? filtered.length : 0}</Badge>
              </div>
            )}
          </Col>
        </Row>

        <div className="card shadow-sm border-0">
          <div className="card-body p-0">
            <Table striped bordered hover responsive className="mb-0 align-middle">
              <thead className="table-dark text-center">
                <tr>
                  <th>Envío</th>
                  <th>Correo Electrónico</th>
                  <th>Instructor</th>
                  <th>Ficha</th>
                  <th>Gestionado</th>
                  <th>Fecha Gestión</th>
                </tr>
              </thead>

              <tbody>
                {!hasQuery && !loading && (
                  <tr>
                    <td colSpan={6} className="text-center py-5 text-muted">
                      <i className="bi bi-search fs-2 d-block mb-2"></i>
                      Ingrese un criterio de búsqueda para visualizar los datos.
                    </td>
                  </tr>
                )}

                {hasQuery && filtered.map((r, idx) => {
                  const gestion = r[keys.gestionado]
                  const showCheck = isYes(gestion)

                  return (
                    <tr key={idx}>
                      <td className="text-nowrap">{dateOnly(r[keys.marca])}</td>
                      <td><small>{r[keys.correo]}</small></td>
                      <td className="fw-bold">{r[keys.nombre]}</td>
                      <td className="text-center">{r[keys.ficha]}</td>
                      <td className="text-center">
                        {showCheck ? (
                          <Badge bg="success" pill>✅ Gestionado</Badge>
                        ) : (
                          <span className="text-muted">{gestion || 'Pendiente'}</span>
                        )}
                      </td>
                      <td className="text-center text-nowrap">{dateOnly(r[keys.fechaGestion])}</td>
                    </tr>
                  )
                })}

                {hasQuery && !loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      No se encontraron registros que coincidan con "{query}".
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