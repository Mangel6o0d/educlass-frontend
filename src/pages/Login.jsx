import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { verificarCorreo, loginUsuario, registrarUsuario } from '../service/api'
import styles from './Login.module.css'
import fondo from '../assets/fondo.png'

function Login() {
  const navigate = useNavigate()

  const [rol, setRol] = useState('alumno')
  const [paso, setPaso] = useState('correo')
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleVerificarCorreo = async () => {
    if (!correo) { setError('Ingresa tu correo'); return }
    setCargando(true)
    setError('')
    const res = await verificarCorreo(correo, rol)
    setCargando(false)
    if (!res.success) {
      setError('Este correo ya está registrado con otro rol')
      return
    }
    if (res.existe) {
      setPaso('password')
    } else {
      setPaso('registro')
    }
  }

  const handleLogin = async () => {
    if (!password) { setError('Ingresa tu contraseña'); return }
    setCargando(true)
    setError('')
    const res = await loginUsuario(correo, password, rol)
    setCargando(false)
    if (res.success) {
      sessionStorage.setItem(rol, JSON.stringify({ id: res.id, correo: res.correo, nombre: res.nombre }))
      navigate(rol === 'profesor' ? '/dashboard' : '/dashboard-alumno')
    } else {
      setError(res.error || 'Correo o contraseña incorrectos')
    }
  }

  const handleRegistro = async () => {
    if (!password) { setError('Ingresa una contraseña'); return }
    if (rol === 'alumno' && !nombre) { setError('Ingresa tu nombre'); return }
    setCargando(true)
    setError('')
    const res = await registrarUsuario({ correo, password, nombre, rol })
    setCargando(false)
    if (res.success) {
      sessionStorage.setItem(rol, JSON.stringify({ id: res.id, correo: res.correo, nombre: res.nombre || correo }))
      navigate(rol === 'profesor' ? '/dashboard' : '/dashboard-alumno')
    } else {
      setError(res.error || 'Error al registrarse')
    }
  }

  const cambiarRol = (nuevoRol) => {
    setRol(nuevoRol)
    setPaso('correo')
    setCorreo('')
    setPassword('')
    setNombre('')
    setError('')
  }

  return (
    <div className={styles.page} style={{ backgroundImage: `url(${fondo})` }}>
      <div className={styles.card}>

        {/* BOTÓN DE RETROCESO */}
        <button
          onClick={() => navigate('/')}
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '1.25rem',
            cursor: 'pointer',
            color: '#6d28d9',
            fontWeight: '700',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.5rem',
            lineHeight: 1,
          }}
          title="Volver al inicio"
        >
          ←
        </button>

        <div className={styles.header}>
          <p className={styles.appName}>EDUCLASS</p>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${rol === 'alumno' ? styles.tabActivo : ''}`}
            onClick={() => cambiarRol('alumno')}
          >
            Alumno
          </button>
          <button
            className={`${styles.tab} ${rol === 'profesor' ? styles.tabActivo : ''}`}
            onClick={() => cambiarRol('profesor')}
          >
            Profesor
          </button>
        </div>

        <div className={styles.body}>

          {paso === 'correo' && (
            <div className={styles.form}>
              <p className={styles.instruccion}>Ingresa tu correo para continuar</p>
              <input
                className={styles.input}
                type="email"
                placeholder="correo@ejemplo.com"
                value={correo}
                onChange={e => setCorreo(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleVerificarCorreo()}
              />
              {error && <p className={styles.error}>{error}</p>}
              <button
                className={styles.btn}
                onClick={handleVerificarCorreo}
                disabled={cargando}
              >
                {cargando ? 'Verificando...' : 'Continuar'}
              </button>
            </div>
          )}

          {paso === 'password' && (
            <div className={styles.form}>
              <p className={styles.instruccion}>Bienvenido de nuevo, ingresa tu contraseña</p>
              <p className={styles.correoMostrado}>{correo}</p>
              <input
                className={styles.input}
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
              {error && <p className={styles.error}>{error}</p>}
              <button className={styles.btn} onClick={handleLogin} disabled={cargando}>
                {cargando ? 'Entrando...' : 'Iniciar sesión'}
              </button>
              <button className={styles.btnSecundario} onClick={() => setPaso('correo')}>
                ← Cambiar correo
              </button>
            </div>
          )}

          {paso === 'registro' && (
            <div className={styles.form}>
              <p className={styles.instruccion}>Correo no registrado, crea tu cuenta</p>
              <p className={styles.correoMostrado}>{correo}</p>
              <input
                className={styles.input}
                type="text"
                placeholder="Tu nombre completo"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
              />
              <input
                className={styles.input}
                type="password"
                placeholder="Crea una contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleRegistro()}
              />
              {error && <p className={styles.error}>{error}</p>}
              <button className={styles.btn} onClick={handleRegistro} disabled={cargando}>
                {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
              <button className={styles.btnSecundario} onClick={() => setPaso('correo')}>
                ← Cambiar correo
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  )
}

export default Login