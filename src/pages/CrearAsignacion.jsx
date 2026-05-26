import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { crearAsignacion, editarAsignacion } from '../service/api'
import styles from './CrearAsignacion.module.css'
import fondo from '../assets/fondo.png'

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

function CrearAsignacion() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const materia = state?.materia
  const asignacion = state?.asignacion

  const modoEditar = !!asignacion

  const [form, setForm] = useState({
    titulo: asignacion?.titulo || '',
    descripcion: asignacion?.descripcion || '',
    fecha_limite: asignacion?.fecha_limite || ''
  })
  const [archivosExistentes, setArchivosExistentes] = useState(asignacion?.archivos || [])
  const [eliminarIds, setEliminarIds] = useState([])
  const [archivosNuevos, setArchivosNuevos] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const data = sessionStorage.getItem('profesor')
    if (!data) { navigate('/login', { replace: true }); return }
    if (!materia) { navigate('/dashboard'); return }
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleArchivosNuevos = (e) => {
    const archivos = Array.from(e.target.files)
    const invalidos = archivos.filter(f => f.size > MAX_SIZE)
    if (invalidos.length > 0) {
      setError(`Estos archivos superan el límite de 5MB: ${invalidos.map(f => f.name).join(', ')}`)
      e.target.value = ''
      return
    }
    setError('')
    setArchivosNuevos(archivos)
  }

  const handleEliminarExistente = (archivo) => {
    setEliminarIds([...eliminarIds, archivo.id])
    setArchivosExistentes(archivosExistentes.filter(a => a.id !== archivo.id))
  }

  const handleSubmit = async () => {
    if (!form.titulo || !form.descripcion || !form.fecha_limite) {
      setError('Todos los campos son requeridos')
      return
    }

    const profesor = JSON.parse(sessionStorage.getItem('profesor'))
    if (!profesor) { navigate('/login'); return }

    setLoading(true)
    setError('')

    try {
      let res
      if (modoEditar) {
        res = await editarAsignacion({ id: asignacion.id, profesor_id: profesor.id, ...form }, archivosNuevos, eliminarIds)
      } else {
        res = await crearAsignacion({ ...form, materia_id: materia.id }, archivosNuevos)
      }

      if (res.success) {
        navigate(`/materia/${materia.id}`, { state: { materia } })
      } else {
        setError(res.error || `Error al ${modoEditar ? 'editar' : 'crear'} la asignación`)
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page} style={{ backgroundImage: `url(${fondo})` }}>
      <div className={styles.card}>

        <div className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate(`/materia/${materia.id}`, { state: { materia } })}>
            ←
          </button>
          <span className={styles.headerTitle}>
            {modoEditar ? 'Editar asignacion' : 'Crear asignacion'}
          </span>
        </div>

        <div className={styles.body}>
          <label className={styles.label}>Nombre de la asignacion:</label>
          <input
            className={styles.input}
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            autoComplete="off"
          />

          <label className={styles.label}>Descripción de la asignacion:</label>
          <textarea
            className={styles.textarea}
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
          />

          {modoEditar && archivosExistentes.length > 0 && (
            <>
              <label className={styles.label}>Archivos actuales:</label>
              <ul className={styles.fileList}>
                {archivosExistentes.map((a, i) => (
                  <li key={i} className={styles.fileItem}>
                    📄 {a.nombre_original}
                    <button
                      className={styles.fileRemove}
                      onClick={() => handleEliminarExistente(a)}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          <label className={styles.label}>
            {modoEditar ? 'Agregar archivos nuevos:' : 'Agregar archivos:'}
          </label>
          <p className={styles.fileHint}>Máximo 5MB por archivo</p>
          <label className={styles.fileLabel}>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
              onChange={handleArchivosNuevos}
              className={styles.fileInput}
            />
            <span className={styles.fileBtn}>+ Agregar archivo</span>
          </label>
          {archivosNuevos.length > 0 && (
            <ul className={styles.fileList}>
              {archivosNuevos.map((f, i) => (
                <li key={i} className={styles.fileItem}>
                  📄 {f.name}
                  <button
                    className={styles.fileRemove}
                    onClick={() => setArchivosNuevos(archivosNuevos.filter((_, j) => j !== i))}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}

          <label className={styles.label}>Fecha límite:</label>
          <input
            className={styles.inputFecha}
            type="date"
            name="fecha_limite"
            value={form.fecha_limite}
            onChange={handleChange}
          />

          {error && <p className={styles.error}>{error}</p>}
        </div>

        <div className={styles.footer}>
          <button
            className={styles.crearBtn}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? (modoEditar ? 'Guardando...' : 'Creando...')
              : (modoEditar ? 'Guardar' : 'Crear')}
          </button>
        </div>

      </div>
    </div>
  )
}

export default CrearAsignacion