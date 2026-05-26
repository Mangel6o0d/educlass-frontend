import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { crearMateria, editarMateria } from '../service/api'
import styles from './CrearClase.module.css'
import fondo from '../assets/fondo.png'

const CARRERAS = [
  'Ingeniería en Ciencia de Datos',
  'Ingeniería en Semiconductores',
  'Ingeniería Eléctrica',
  'Ingeniería Electrónica',
  'Ingeniería en Gestión Empresarial',
  'Ingeniería Industrial',
  'Ingeniería Industrial (en línea)',
  'Ingeniería Mecánica',
  'Ingeniería Informática',
  'Ingeniería Química',
  'Ingeniería en Sistemas Computacionales',
]

const HORAS = [
  '07:00 - 08:00',
  '08:00 - 09:00',
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '12:00 - 13:00',
  '13:00 - 14:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
  '17:00 - 18:00',
  '18:00 - 19:00',
  '19:00 - 20:00',
]

function CrearClase() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const materia = state?.materia

  const modoEditar = !!materia

  const [form, setForm] = useState({
    nombre: materia?.nombre || '',
    carrera: materia?.carrera || '',
    hora: materia?.hora || ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const data = sessionStorage.getItem('profesor')
    if (!data) { navigate('/login', { replace: true }); return }
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!form.nombre || !form.carrera || !form.hora) {
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
        res = await editarMateria({ id: materia.id, profesor_id: profesor.id, ...form })
      } else {
        res = await crearMateria({ ...form, profesor_id: profesor.id })
      }

      if (res.success) {
        navigate('/dashboard')
      } else {
        setError(res.error || `Error al ${modoEditar ? 'editar' : 'crear'} la clase`)
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
          <button className={styles.backButton} onClick={() => navigate('/dashboard')}>
            ←
          </button>
          <span className={styles.headerTitle}>
            {modoEditar ? 'Editar clase' : 'Crear clase'}
          </span>
        </div>

        <div className={styles.body}>
          <label className={styles.label}>Nombre de asignatura:</label>
          <input
            className={styles.input}
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            autoComplete="off"
          />

          <label className={styles.label}>Carrera:</label>
          <select
            className={styles.select}
            name="carrera"
            value={form.carrera}
            onChange={handleChange}
          >
            <option value="">Selecciona una carrera</option>
            {CARRERAS.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <label className={styles.label}>Hora:</label>
          <select
            className={styles.select}
            name="hora"
            value={form.hora}
            onChange={handleChange}
          >
            <option value="">Selecciona un horario</option>
            {HORAS.map(h => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>

          {error && <p className={styles.error}>{error}</p>}

          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? (modoEditar ? 'Guardando...' : 'Creando...')
              : (modoEditar ? 'Guardar' : 'Crear Clase')}
          </button>
        </div>

      </div>
    </div>
  )
}

export default CrearClase