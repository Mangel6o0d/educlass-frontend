import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { entregarAsignacion, obtenerEstadoEntregas } from '../service/api'
import styles from './AsignacionAlumno.module.css'
import fondo from '../assets/fondo.png'

const BASE_URL = 'http://localhost/educlass/uploads/asignaciones/'

function AsignacionAlumno() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { id } = useParams()
  const materia = state?.materia
  const asignacion = state?.asignacion

  const [archivo, setArchivo] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [entregada, setEntregada] = useState(false)
  const [calificacion, setCalificacion] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const inputRef = useRef()

  useEffect(() => {
    const data = sessionStorage.getItem('alumno')
    if (!data) { navigate('/login', { replace: true }); return }
    if (!asignacion) { navigate(`/alumno/materia/${id}`, { state: { materia } }); return }
    const alumno = JSON.parse(data)
    obtenerEstadoEntregas(alumno.id, asignacion.materia_id ?? id).then(res => {
      if (res.success && res.entregas[asignacion.id]) {
        setEntregada(true)
        setCalificacion(res.entregas[asignacion.id].calificacion)
      }
      setCargando(false)
    })
  }, [])

  if (!asignacion) return null

  const handleArchivo = (e) => {
    const f = e.target.files[0]
    if (!f) return
    if (f.size > 5 * 1024 * 1024) { setError('El archivo supera los 5MB'); return }
    setError('')
    setArchivo(f)
  }

  const handleEntregar = async () => {
    if (!archivo) { setError('Selecciona un archivo antes de entregar'); return }
    setEnviando(true)
    setError('')
    const alumno = JSON.parse(sessionStorage.getItem('alumno'))
    const res = await entregarAsignacion(
      { alumno_nombre: alumno.nombre, alumno_id: alumno.id, asignacion_id: asignacion.id },
      archivo
    )
    setEnviando(false)
    if (res.success) {
      setEntregada(true)
      setArchivo(null)
    } else {
      setError(res.error || 'Error al entregar')
    }
  }

  return (
    <div className={styles.page} style={{ backgroundImage: `url(${fondo})` }}>
      <div className={styles.card}>

        <div className={styles.header}>
          <div>
            <p className={styles.appName}>EDUCLASS</p>
            <p className={styles.titulo}>{asignacion.titulo}</p>
          </div>
        </div>

        <div className={styles.body}>

          <div className={styles.seccion}>
            <p className={styles.seccionLabel}>Descripción</p>
            <p className={styles.seccionValor}>{asignacion.descripcion}</p>
          </div>

          <div className={styles.seccion}>
            <p className={styles.seccionLabel}>Fecha límite</p>
            <p className={styles.seccionValor}>📅 {asignacion.fecha_limite}</p>
          </div>

          {asignacion.archivos?.length > 0 && (
            <div className={styles.seccion}>
              <p className={styles.seccionLabel}>Archivos adjuntos</p>
              <div className={styles.archivosList}>
                {asignacion.archivos.map((a, i) => (
                  <a
                    key={i}
                    href={BASE_URL + a.nombre_guardado}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.archivoBtn}
                  >
                    📄 {a.nombre_original}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className={styles.seccion}>
            <p className={styles.seccionLabel}>Tu entrega</p>

            {cargando ? (
              <p className={styles.cargando}>Verificando entrega...</p>
            ) : entregada ? (
              <div className={styles.entregadaBox}>
                <p className={styles.entregadaMsg}>✅ Tarea entregada</p>
                {calificacion ? (
                  <p className={styles.calificacionMsg}>
                    Calificación: <strong>{calificacion}%</strong>
                  </p>
                ) : (
                  <p className={styles.pendienteMsg}>⏳ Pendiente de calificación</p>
                )}
              </div>
            ) : (
              <>
                <div
                  className={styles.dropZone}
                  onClick={() => inputRef.current.click()}
                >
                  {archivo ? (
                    <p className={styles.archivoNombre}>📄 {archivo.name}</p>
                  ) : (
                    <p className={styles.dropText}>
                      Haz clic para seleccionar un archivo<br />
                      <span>PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT — máx. 5MB</span>
                    </p>
                  )}
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                  style={{ display: 'none' }}
                  onChange={handleArchivo}
                />
                {error && <p className={styles.error}>{error}</p>}
                <button
                  className={styles.entregarBtn}
                  onClick={handleEntregar}
                  disabled={enviando || !archivo}
                >
                  {enviando ? 'Enviando...' : 'Entregar tarea'}
                </button>
              </>
            )}
          </div>

        </div>

        <button className={styles.backBtn} onClick={() => navigate(`/alumno/materia/${id}`, { state: { materia } })}>
          ←
        </button>

      </div>
    </div>
  )
}

export default AsignacionAlumno
