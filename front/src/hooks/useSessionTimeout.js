import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutos en milisegundos

/**
 * Hook que maneja el timeout de sesión
 * Auto-logout después de 30 minutos de inactividad
 */
export function useSessionTimeout() {
  const navigate = useNavigate()

  useEffect(() => {
    let timeoutId

    const resetTimeout = () => {
      if (timeoutId) clearTimeout(timeoutId)
      
      timeoutId = setTimeout(() => {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        navigate('/login')
      }, SESSION_TIMEOUT)
    }

    // Eventos que resetean el timer
    const events = ['mousedown', 'keypress', 'scroll', 'touchstart']
    
    events.forEach(event => {
      document.addEventListener(event, resetTimeout)
    })

    resetTimeout() // Iniciar timer

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      events.forEach(event => {
        document.removeEventListener(event, resetTimeout)
      })
    }
  }, [navigate])
}
