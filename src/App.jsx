import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CrearClase from './pages/CrearClase'
import DetalleMateria from './pages/DetalleMateria'
import CrearAsignacion from './pages/CrearAsignacion'
import DetalleAsignacion from './pages/DetalleAsignacion'
import DashboardAlumno from './pages/DashboardAlumno'
import MateriaAlumno from './pages/MateriaAlumno'
import AsignacionAlumno from './pages/AsignacionAlumno'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/crear-clase" element={<CrearClase />} />
        <Route path="/editar-materia/:id" element={<CrearClase />} />
        <Route path="/materia/:id" element={<DetalleMateria />} />
        <Route path="/materia/:id/crear-asignacion" element={<CrearAsignacion />} />
        <Route path="/materia/:id/editar-asignacion/:asignacionId" element={<CrearAsignacion />} />
        <Route path="/materia/:id/asignacion/:asignacionId" element={<DetalleAsignacion />} />
        <Route path="/dashboard-alumno" element={<DashboardAlumno />} />
        <Route path="/alumno/materia/:id" element={<MateriaAlumno />} />
        <Route path="/alumno/materia/:id/asignacion/:asignacionId" element={<AsignacionAlumno />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App