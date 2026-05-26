import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { listarAsignaciones, eliminarAsignacion } from '../service/api'
import ConfirmModal from '../components/ConfirmModal'
import styles from './DetalleMateria.module.css'
import fondo from '../assets/fondo.png'

function DetalleMateria() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { id } = useParams()
  const materia = state?.materia

  const [asignaciones, setAsignaciones] = useState([])
  const [menuTarjeta, setMenuTarjeta] = useState(null)
  const [modalEliminar, setModalEliminar] = useState(null)

  useEffect(() => {
    const data = sessionStorage.getItem('profesor')
    if (!data) { navigate('/login', { replace: true }); return }
    if (!materia) { navigate('/dashboard'); return }
    listarAsignaciones(id).then(res => {
      if (res.success) setAsignaciones(res.asignaciones)
    })
  }, [id])

  useEffect(() => {
    function handleClickFuera(e) {
      if (!e.target.closest(`.${styles.menuWrapper}`)) {
        setMenuTarjeta(null)
      }
    }
    document.addEventListener('mousedown', handleClickFuera)
    return () => document.removeEventListener('mousedown', handleClickFuera)
  }, [])

  const confirmarEliminar = async () => {
    const profesor = JSON.parse(sessionStorage.getItem('profesor'))
    const res = await eliminarAsignacion(modalEliminar, profesor.id)
    if (res.success) {
      setAsignaciones(asignaciones.filter(a => a.id !== modalEliminar))
    }
    setModalEliminar(null)
  }

  if (!materia) return null

  return (
    <div className={styles.page} style={{ backgroundImage: `url(${fondo})` }}>
      <div className={styles.card}>

        <div className={styles.header}>
          <div>
            <p className={styles.appName}>EDUCLASS</p>
            <p className={styles.materiaNombre}>{materia.nombre}</p>
          </div>
          <button
            className={styles.crearBtn}
            onClick={() => navigate(`/materia/${materia.id}/crear-asignacion`, { state: { materia } })}
          >
            Crear una asignacion
          </button>
        </div>

        <div className={styles.body}>
          {asignaciones.length === 0 ? (
            <p className={styles.vacio}>No hay asignaciones aún.</p>
          ) : (
            asignaciones.map(a => (
              <div
                key={a.id}
                className={styles.asignacionCard}
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/materia/${materia.id}/asignacion/${a.id}`, { state: { materia, asignacion: a } })}
              >
                <div className={styles.asignacionTop}>
                  <div className={styles.asignacionTituloRow}>
                    <p className={styles.asignacionTitulo}>{a.titulo}</p>
                    <div className={styles.menuWrapper}>
                      <button
                        className={styles.menuBtn}
                        onClick={(e) => {
                          e.stopPropagation()
                          setMenuTarjeta(menuTarjeta === a.id ? null : a.id)
                        }}
                      >
                        ···
                      </button>
                      {menuTarjeta === a.id && (
                        <div className={styles.dropdown}>
                          <button
                            className={styles.dropdownItem}
                            onClick={(e) => {
                              e.stopPropagation()
                              setMenuTarjeta(null)
                              navigate(`/materia/${materia.id}/editar-asignacion/${a.id}`, { state: { materia, asignacion: a } })
                            }}
                          >
                            ✏️ Editar
                          </button>
                          <button
                            className={`${styles.dropdownItem} ${styles.dropdownItemRojo}`}
                            onClick={(e) => {
                              e.stopPropagation()
                              setMenuTarjeta(null)
                              setModalEliminar(a.id)
                            }}
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className={styles.asignacionDesc}>{a.descripcion}</p>
                </div>
                <div className={styles.asignacionFecha}>
                  Fecha límite: {a.fecha_limite}
                </div>
              </div>
            ))
          )}
        </div>

        <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>
          ←
        </button>

      </div>

      {modalEliminar && (
        <ConfirmModal
          mensaje="¿Seguro que deseas eliminar esta asignación?"
          onAceptar={confirmarEliminar}
          onCancelar={() => setModalEliminar(null)}
        />
      )}

    </div>
  )
}

export default DetalleMateria