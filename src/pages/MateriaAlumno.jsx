import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { listarAsignaciones, obtenerEstadoEntregas } from '../service/api'
import styles from './MateriaAlumno.module.css'
import fondo from '../assets/fondo.png'

function MateriaAlumno() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { id } = useParams()
  const materia = state?.materia

  const [asignaciones, setAsignaciones] = useState([])
  const [estadoEntregas, setEstadoEntregas] = useState({})

  useEffect(() => {
    const data = sessionStorage.getItem('alumno')
    if (!data) { navigate('/login', { replace: true }); return }
    if (!materia) { navigate('/dashboard-alumno'); return }
    const alumno = JSON.parse(data)

    const cargarDatos = () => {
      listarAsignaciones(id).then(res => {
        if (res.success) setAsignaciones(res.asignaciones)
      })
      obtenerEstadoEntregas(alumno.id, id).then(res => {
        if (res.success) setEstadoEntregas(res.entregas)
      })
    }

    cargarDatos()

    window.addEventListener('focus', cargarDatos)
    return () => window.removeEventListener('focus', cargarDatos)
  }, [id])

  if (!materia) return null

  return (
    <div className={styles.page} style={{ backgroundImage: `url(${fondo})` }}>
      <div className={styles.card}>

        <div className={styles.header}>
          <div>
            <p className={styles.appName}>EDUCLASS</p>
            <p className={styles.materiaNombre}>{materia.nombre}</p>
          </div>
          <div className={styles.materiaInfo}>
            <span>{materia.carrera}</span>
            <span>{materia.hora}</span>
          </div>
        </div>

        <div className={styles.body}>
          {asignaciones.length === 0 ? (
            <p className={styles.vacio}>No hay asignaciones aún.</p>
          ) : (
            asignaciones.map(a => (
              <div
                key={a.id}
                className={styles.asignacionCard}
                onClick={() => navigate(`/alumno/materia/${id}/asignacion/${a.id}`, { state: { materia, asignacion: a } })}
              >
                <div className={styles.asignacionTop}>
                  <div className={styles.asignacionTituloRow}>
                    <p className={styles.asignacionTitulo}>{a.titulo}</p>
                    {estadoEntregas[a.id] ? (
                      estadoEntregas[a.id].calificacion ? (
                        <span className={styles.badgeCalificado}>
                          ✓ {estadoEntregas[a.id].calificacion}%
                        </span>
                      ) : (
                        <span className={styles.badgeEntregado}>✓ Entregado</span>
                      )
                    ) : (
                      <span className={styles.badgePendiente}>Pendiente</span>
                    )}
                  </div>
                  <p className={styles.asignacionDesc}>{a.descripcion}</p>
                </div>
                <div className={styles.asignacionFecha}>
                  📅 Fecha límite: {a.fecha_limite}
                </div>
              </div>
            ))
          )}
        </div>

        <button className={styles.backBtn} onClick={() => navigate('/dashboard-alumno')}>
          ←
        </button>

      </div>
    </div>
  )
}

export default MateriaAlumno