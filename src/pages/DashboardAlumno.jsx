import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './DashboardAlumno.module.css'
import fondo from '../assets/fondo.png'
import { listarMateriasAlumno, unirseMateria, listarAsignaciones } from '../service/api'

function DashboardAlumno() {
  const navigate = useNavigate()
  const [alumno, setAlumno] = useState(null)
  const [materias, setMaterias] = useState([])
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [modalUnirse, setModalUnirse] = useState(false)
  const [codigo, setCodigo] = useState('')
  const [errorCodigo, setErrorCodigo] = useState('')
  const [cargandoUnirse, setCargandoUnirse] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const data = sessionStorage.getItem('alumno')
    if (!data) { navigate('/login', { replace: true }); return }
    const a = JSON.parse(data)
    setAlumno(a)
    listarMateriasAlumno(a.id).then(async res => {
  if (!res.success) return
  const materiasConAsignaciones = await Promise.all(
    res.materias.map(async m => {
      const r = await listarAsignaciones(m.id)
      return { ...m, asignaciones: r.success ? r.asignaciones.slice(0, 3) : [] }
    })
  )
  setMaterias(materiasConAsignaciones)
})
  }, [])

  useEffect(() => {
    function handleClickFuera(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAbierto(false)
      }
    }
    document.addEventListener('mousedown', handleClickFuera)
    return () => document.removeEventListener('mousedown', handleClickFuera)
  }, [])

  const cerrarSesion = () => {
    sessionStorage.removeItem('alumno')
    navigate('/login', { replace: true })
  }

  const handleUnirse = async () => {
  if (!codigo) { setErrorCodigo('Ingresa un código'); return }
  setCargandoUnirse(true)
  setErrorCodigo('')
  const res = await unirseMateria(alumno.id, codigo)
  if (res.success) {
    const r = await listarAsignaciones(res.materia.id)
    const nuevaMateria = {
      ...res.materia,
      asignaciones: r.success ? r.asignaciones.slice(0, 3) : []
    }
    setMaterias([...materias, nuevaMateria])
    setModalUnirse(false)
    setCodigo('')
  } else {
    setErrorCodigo(res.error || 'Error al unirse')
  }
  setCargandoUnirse(false)
}

  return (
    <div className={styles.page} style={{ backgroundImage: `url(${fondo})` }}>
      <div className={styles.card}>

        <div className={styles.header}>
          <div>
            <p className={styles.appName}>EDUCLASS</p>
            <p className={styles.alumnoName}>
              {alumno ? alumno.nombre || alumno.correo : '...'}
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
            <p className={styles.emptyText}>Aun no perteneces a ninguna clase</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {materias.map(materia => (
              <div
                key={materia.id}
                className={styles.materiaCard}
                onClick={() => navigate(`/alumno/materia/${materia.id}`, { state: { materia } })}
              >
                <div className={styles.materiaHeader}>
                  <p className={styles.materiaNombre}>{materia.nombre}</p>
                  <div className={styles.materiaInfo}>
                    <span>{materia.carrera}</span>
                    <span>{materia.hora}</span>
                  </div>
                </div>
                <div className={styles.materiaBody}>
  {materia.asignaciones?.length > 0 ? (
    materia.asignaciones.map(a => (
      <p key={a.id} className={styles.asignacionItem}>
        📋 {a.titulo}
      </p>
    ))
  ) : (
    <p className={styles.sinAsignaciones}>Sin asignaciones aún</p>
  )}
</div>
                  
              </div>
            ))}
          </div>
        )}

        <button
          className={styles.addButton}
          onClick={() => setModalUnirse(true)}
          title="Unirse a una clase"
        >
          +
        </button>

      </div>

      {modalUnirse && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <p className={styles.modalTitulo}>Unirse a una clase</p>
            <p className={styles.modalSubtitulo}>Ingresa el código que te dio tu profesor</p>
            <input
              className={styles.modalInput}
              type="text"
              placeholder="Ej: MAT001"
              value={codigo}
              onChange={e => setCodigo(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && handleUnirse()}
            />
            {errorCodigo && <p className={styles.modalError}>{errorCodigo}</p>}
            <div className={styles.modalBtns}>
              <button className={styles.modalCancelar} onClick={() => { setModalUnirse(false); setCodigo(''); setErrorCodigo('') }}>
                Cancelar
              </button>
              <button className={styles.modalAceptar} onClick={handleUnirse} disabled={cargandoUnirse}>
                {cargandoUnirse ? 'Buscando...' : 'Unirse'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default DashboardAlumno