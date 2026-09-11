import { useState, useEffect, useRef } from 'react'
import { Navigate, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { subscribeToAuth, logoutAdmin } from '../../firebase/adminService'
import '../styles/admin.css'

const IDLE_TIMEOUT_MS = 5 * 60 * 1000

export default function ProtectedRoute({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const lastActivityRef = useRef(Date.now())

  useEffect(() => {
    const unsubscribe = subscribeToAuth((user) => {
      setCurrentUser(user)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!currentUser) return

    lastActivityRef.current = Date.now()

    const handleActivity = () => {
      lastActivityRef.current = Date.now()
    }

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click']
    events.forEach((eventName) => {
      window.addEventListener(eventName, handleActivity, { passive: true })
    })

    const intervalId = setInterval(async () => {
      const idleTime = Date.now() - lastActivityRef.current
      if (idleTime >= IDLE_TIMEOUT_MS) {
        clearInterval(intervalId)
        await logoutAdmin()
        navigate('/admin/login', {
          replace: true,
          state: { reason: 'idle' }
        })
      }
    }, 5000)

    return () => {
      clearInterval(intervalId)
      events.forEach((eventName) => {
        window.removeEventListener(eventName, handleActivity)
      })
    }
  }, [currentUser, navigate])

  if (loading) {
    return (
      <div
        className="admin-root"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(128, 0, 128, 0.15)',
            borderTopColor: '#800080',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }}
        />
        <span style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)', fontWeight: 600 }}>
          Memverifikasi sesi admin...
        </span>
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return children ? children : <Outlet />
}
