import { Navigate } from 'react-router-dom'

/**
 * Componente que protege rutas que requieren autenticación
 * Redirige a /login si no hay token válido en localStorage
 */
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
