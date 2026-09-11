import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'
import AdminHeader from '../components/AdminHeader'
import { subscribeToAuth, logoutAdmin } from '../../firebase/adminService'
import '../styles/admin.css'

export default function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('azhar_admin_sidebar_collapsed') === 'true'
  })
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('azhar_admin_theme') === 'dark'
  })

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setIsMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    localStorage.setItem('azhar_admin_sidebar_collapsed', isCollapsed ? 'true' : 'false')
  }, [isCollapsed])

  useEffect(() => {
    const root = document.documentElement
    if (isDarkMode) {
      root.classList.add('admin-dark')
      localStorage.setItem('azhar_admin_theme', 'dark')
    } else {
      root.classList.remove('admin-dark')
      localStorage.setItem('azhar_admin_theme', 'light')
    }
  }, [isDarkMode])

  useEffect(() => {
    const unsubscribe = subscribeToAuth((user) => {
      setCurrentUser(user)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev)
  }

  const handleToggleSidebar = () => {
    if (window.innerWidth <= 1024) {
      setIsMobileOpen((prev) => !prev)
    } else {
      setIsCollapsed((prev) => !prev)
    }
  }

  const handleLogout = async () => {
    await logoutAdmin()
    navigate('/admin/login', { replace: true })
  }

  if (loading) {
    return (
      <div
        className={`admin-root ${isDarkMode ? 'admin-dark' : ''}`}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          fontSize: '0.9375rem',
          fontWeight: 700
        }}
      >
        Memuat Panel Admin...
      </div>
    )
  }

  return (
    <div className={`admin-root ${isDarkMode ? 'admin-dark' : ''}`}>
      {isMobileOpen && (
        <div
          className="admin-mobile-backdrop"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <AdminSidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      <div
        className={`admin-main-wrapper ${
          isCollapsed ? 'sidebar-collapsed' : ''
        }`}
      >
        <AdminHeader
          currentUser={currentUser}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
          onToggleSidebar={handleToggleSidebar}
          onLogout={handleLogout}
        />

        <main className="admin-content">
          <Outlet context={{ currentUser, isDarkMode }} />
        </main>

        <footer className="admin-footer">
          &copy; {new Date().getFullYear()} Azhar Collection. Hak Cipta Dilindungi.
        </footer>
      </div>
    </div>
  )
}
