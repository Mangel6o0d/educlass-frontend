const BASE_URL = '/api'

export async function crearMateria(datos) {
  const res = await fetch(`${BASE_URL}/materias/crear.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  })
  return res.json()
}

export async function listarMaterias(profesor_id) {
  const res = await fetch(`${BASE_URL}/materias/listar.php?profesor_id=${profesor_id}`)
  return res.json()
}

export async function editarMateria(datos) {
  const res = await fetch(`${BASE_URL}/materias/editar.php`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  })
  return res.json()
}

export async function eliminarMateria(id, profesor_id) {
  const res = await fetch(`${BASE_URL}/materias/eliminar.php`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, profesor_id })
  })
  return res.json()
}

export async function crearAsignacion(datos, archivos = []) {
  const formData = new FormData()
  formData.append('titulo', datos.titulo)
  formData.append('descripcion', datos.descripcion)
  formData.append('fecha_limite', datos.fecha_limite)
  formData.append('materia_id', datos.materia_id)
  archivos.forEach(archivo => formData.append('archivos[]', archivo))
  const res = await fetch(`${BASE_URL}/asignaciones/crear.php`, {
    method: 'POST',
    body: formData
  })
  return res.json()
}

export async function listarAsignaciones(materia_id) {
  const res = await fetch(`${BASE_URL}/asignaciones/listar.php?materia_id=${materia_id}`)
  return res.json()
}

export async function editarAsignacion(datos, archivosNuevos = [], eliminarIds = []) {
  const formData = new FormData()
  formData.append('id', datos.id)
  formData.append('profesor_id', datos.profesor_id)
  formData.append('titulo', datos.titulo)
  formData.append('descripcion', datos.descripcion)
  formData.append('fecha_limite', datos.fecha_limite)
  formData.append('eliminar_ids', JSON.stringify(eliminarIds))
  archivosNuevos.forEach(archivo => formData.append('archivos[]', archivo))
  const res = await fetch(`${BASE_URL}/asignaciones/editar.php`, {
    method: 'POST',
    body: formData
  })
  return res.json()
}

export async function eliminarAsignacion(id, profesor_id) {
  const res = await fetch(`${BASE_URL}/asignaciones/eliminar.php`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, profesor_id })
  })
  return res.json()
}

export async function listarEntregas(asignacion_id) {
  const res = await fetch(`${BASE_URL}/entregas/listar.php?asignacion_id=${asignacion_id}`)
  return res.json()
}

export async function calificarEntrega(id, calificacion) {
  const res = await fetch(`${BASE_URL}/entregas/calificar.php`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, calificacion })
  })
  return res.json()
}

export async function verificarCorreo(correo, rol) {
  const res = await fetch(`${BASE_URL}/auth/verificar_correo.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, rol })
  })
  return res.json()
}

export async function registrarUsuario(datos) {
  const res = await fetch(`${BASE_URL}/auth/registro.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  })
  return res.json()
}

export async function loginUsuario(correo, password, rol) {
  const res = await fetch(`${BASE_URL}/auth/login.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, password, rol })
  })
  return res.json()
}

export async function listarMateriasAlumno(alumno_id) {
  const res = await fetch(`${BASE_URL}/alumnos/listar_materias.php?alumno_id=${alumno_id}`)
  return res.json()
}

export async function unirseMateria(alumno_id, codigo) {
  const res = await fetch(`${BASE_URL}/alumnos/unirse_materia.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ alumno_id, codigo })
  })
  return res.json()
}

export async function obtenerEstadoEntregas(alumno_id, materia_id) {
  const res = await fetch(`${BASE_URL}/entregas/estado_alumno.php?alumno_id=${alumno_id}&materia_id=${materia_id}`)
  return res.json()
}

export async function entregarAsignacion(datos, archivo) {
  const formData = new FormData()
  formData.append('alumno_nombre', datos.alumno_nombre)
  formData.append('alumno_id', datos.alumno_id)
  formData.append('asignacion_id', datos.asignacion_id)
  formData.append('archivo', archivo)
  const res = await fetch(`${BASE_URL}/entregas/crear.php`, {
    method: 'POST',
    body: formData
  })
  return res.json()
}