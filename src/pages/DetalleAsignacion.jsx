import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { listarEntregas, calificarEntrega } from '../service/api'
import styles from './DetalleAsignacion.module.css'
import fondo from '../assets/fondo.png'

const BASE_URL = 'http://localhost/educlass/uploads/asignaciones/'

function DetalleAsignacion() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { id } = useParams()

  const materia = state?.materia
  const asignacion = state?.asignacion

  const [tab, setTab] = useState('asignacion')
  const [entregas, setEntregas] = useState([])
  const [califs, setCalifs] = useState({})
  const [guardando, setGuardando] = useState(null)
  const [modificados, setModificados] = useState({})

  useEffect(() => {
    const data = sessionStorage.getItem('profesor')
    if (!data) { navigate('/', { replace: true }); return }
    if (!asignacion) { navigate('/dashboard'); return }
    listarEntregas(asignacion.id).then(res => {
      if (res.success) {
        setEntregas(res.entregas)
        const c = {}
        res.entregas.forEach(e => { c[e.id] = e.calificacion ?? '' })
        setCalifs(c)
      }
    })
  }, [])

  if (!asignacion) return null

  const handleCalificar = async (entregaId) => {
    const val = parseInt(califs[entregaId])
    if (!val || val < 1 || val > 100) return
    setGuardando(entregaId)
    await calificarEntrega(entregaId, val)
    setEntregas(entregas.map(e =>
      e.id === entregaId ? { ...e, calificacion: val, estado: 'revisado' } : e
    ))
    setModificados({ ...modificados, [entregaId]: false })
    setGuardando(null)
  }

  return (
    <div className={styles.page} style={{ backgroundImage: `url(${fondo})` }}>
      <div className={styles.card}>

        <div className={styles.header}>
          <div>
            <p className={styles.appName}>EDUCLASS</p>
            <p className={styles.asignacionNombre}>{asignacion.titulo}</p>
          </div>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === 'asignacion' ? styles.tabActivo : ''}`}
            onClick={() => setTab('asignacion')}
          >
            Asignacion
          </button>
          <button
            className={`${styles.tab} ${tab === 'entregas' ? styles.tabActivo : ''}`}
            onClick={() => setTab('entregas')}
          >
            Entregas
            {entregas.length > 0 && (
              <span className={styles.badge}>{entregas.length}</span>
            )}
          </button>
        </div>

        <div className={styles.body}>

          {tab === 'asignacion' && (
            <div className={styles.detalleAsignacion}>
              <div className={styles.seccion}>
                <p className={styles.seccionLabel}>Descripcion</p>
                <p className={styles.seccionValor}>{asignacion.descripcion}</p>
              </div>

              <div className={styles.seccion}>
                <p className={styles.seccionLabel}>Fecha limite</p>
                <p className={styles.seccionValor}>{asignacion.fecha_limite}</p>
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
                        {a.nombre_original}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'entregas' && (
            <div className={styles.entregasList}>
              {entregas.length === 0 ? (
                <p className={styles.vacio}>Aun no hay entregas.</p>
              ) : (
                entregas.map(e => (
                  <div key={e.id} className={styles.entregaCard}>
                    <div className={styles.entregaInfo}>
                      <p className={styles.entregaAlumno}>{e.alumno_nombre}</p>
                      <p className={styles.entregaFecha}>
                        {new Date(e.fecha_entrega).toLocaleDateString('es-MX', {
                          day: '2-digit', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>

                    <a
                      href={BASE_URL + e.archivo}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.archivoBtn}
                    >
                      Ver archivo
                    </a>

                    <div className={styles.calificacionRow}>
                      <input
                        className={styles.calificacionInput}
                        type="number"
                        min="1"
                        max="100"
                        placeholder="%"
                        value={califs[e.id]}
                        onChange={(ev) => {
                          setCalifs({ ...califs, [e.id]: ev.target.value })
                          setModificados({ ...modificados, [e.id]: true })
                        }}
                      />
                      <button
                        className={styles.calificarBtn}
                        onClick={() => handleCalificar(e.id)}
                        disabled={guardando === e.id}
                      >
                        {guardando === e.id
                          ? '...'
                          : (e.estado === 'revisado' && !modificados[e.id])
                            ? 'Guardado'
                            : 'Calificar'}
                      </button>
                    </div>

                    {e.estado === 'revisado' && (
                      <span className={styles.estadoBadge}>Revisado</span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

        </div>

        <button className={styles.backBtn} onClick={() => navigate(`/materia/${materia.id}`, { state: { materia } })}>
          ←
        </button>

      </div>
    </div>
  )
}

export default DetalleAsignacion
