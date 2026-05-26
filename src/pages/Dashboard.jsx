import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Dashboard.module.css'
import fondo from '../assets/fondo.png'
import { listarMaterias, eliminarMateria } from '../service/api'
import ConfirmModal from '../components/ConfirmModal'

function Dashboard() {
  const navigate = useNavigate()
  const [profesor, setProfesor] = useState(null)
  const [materias, setMaterias] = useState([])
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [menuTarjeta, setMenuTarjeta] = useState(null)
  const [modalEliminar, setModalEliminar] = useState(null)
  const menuRef = useRef(null)

  useEffect(() => {
    const data = sessionStorage.getItem('profesor')
    if (!data) { navigate('/login', { replace: true }); return }
    const p = JSON.parse(data)
    setProfesor(p)
    listarMaterias(p.id).then(res => {
      if (res.success) setMaterias(res.materias)
    })
  }, [])

  useEffect(() => {
    function handleClickFuera(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAbierto(false)
      }
      if (!e.target.closest(`.${styles.tarjetaMenuWrapper}`)) {
        setMenuTarjeta(null)
      }
    }
    document.addEventListener('mousedown', handleClickFuera)
    return () => document.removeEventListener('mousedown', handleClickFuera)
  }, [])

  const cerrarSesion = () => {
    sessionStorage.removeItem('profesor')
    navigate('/login', { replace: true })
  }

  const handleEliminar = (e, id) => {
    e.stopPropagation()
    setMenuTarjeta(null)
    setModalEliminar(id)
  }

  const confirmarEliminar = async () => {
    const res = await eliminarMateria(modalEliminar, profesor.id)
    if (res.success) {
      setMaterias(materias.filter(m => m.id !== modalEliminar))
    }
    setModalEliminar(null)
  }

  const handleEditar = (e, materia) => {
    e.stopPropagation()
    navigate(`/editar-materia/${materia.id}`, { state: { materia } })
    setMenuTarjeta(null)
  }

  const toggleMenuTarjeta = (e, id) => {
    e.stopPropagation()
    setMenuTarjeta(menuTarjeta === id ? null : id)
  }

  return (
    <div className={styles.page} style={{ backgroundImage: `url(${fondo})` }}>
      <div className={styles.card}>

        <div className={styles.header}>
          <div>
            <p className={styles.appName}>EDUCLASS</p>
            <p className={styles.teacherName}>
              {profesor ? profesor.nombre || profesor.correo : '...'}
            </p>
          </div>

          <div className={styles.menuWrapper} ref={menuRef}>
            <button
              className={styles.menuButton}
              onClick={() => setMenuAbierto(!menuAbierto)}
            >
              ···
            </button>
            {menuAbierto && (
              <div className={styles.menuDropdown}>
                <button className={styles.menuItem} onClick={cerrarSesion}>
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>

        {materias.length === 0 ? (
          <div className={styles.empty}>
            <img src="/empty.png" alt="Sin clases" className={styles.emptyImg} />
            <p className={styles.emptyText}>Aun no tiene clases creadas</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {materias.map(materia => (
              <div
                key={materia.id}
                className={styles.materiaCard}
                onClick={() => navigate(`/materia/${materia.id}`, { state: { materia } })}
              >
                <div className={styles.materiaHeader}>
                  <div className={styles.materiaHeaderTop}>
                    <p className={styles.materiaNombre}>{materia.nombre}</p>

                    <div className={styles.tarjetaMenuWrapper}>
                      <button
                        className={styles.tarjetaMenuBtn}
                        onClick={(e) => toggleMenuTarjeta(e, materia.id)}
                      >
                        ···
                      </button>
                      {menuTarjeta === materia.id && (
                        <div className={styles.tarjetaDropdown}>
                          <button
                            className={styles.tarjetaMenuItem}
                            onClick={(e) => handleEditar(e, materia)}
                          >
                            ✏️ Editar
                          </button>
                          <button
                            className={`${styles.tarjetaMenuItem} ${styles.tarjetaMenuItemRojo}`}
                            onClick={(e) => handleEliminar(e, materia.id)}
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.materiaInfo}>
                    <span>{materia.carrera}</span>
                    <span>{materia.hora}</span>
                  </div>
                </div>

                <div className={styles.materiaBody}>
                  <p className={styles.materiaCodigo}>Código: {materia.codigo}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          className={styles.addButton}
          onClick={() => navigate('/crear-clase')}
          title="Crear clase"
        >
          +
        </button>

      </div>

      {modalEliminar && (
        <ConfirmModal
          mensaje="¿Seguro que deseas eliminar esta materia?"
          onAceptar={confirmarEliminar}
          onCancelar={() => setModalEliminar(null)}
        />
      )}

    </div>
  )
}

export default Dashboard