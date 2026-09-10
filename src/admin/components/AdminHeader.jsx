import { useState, useRef, useEffect } from 'react'
import {
  Menu,
  Sun,
  Moon,
  LogOut,
  User
} from 'lucide-react'

export default function AdminHeader({
  currentUser,
  isDarkMode,
  onToggleDarkMode,
  onToggleSidebar,
  onLogout
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initialLetter = (currentUser?.email || 'Admin')[0].toUpperCase()

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="admin-icon-btn"
          aria-label="Buka Tutup Sidebar"
          title="Buka / Tutup Sidebar"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="admin-header-right">
        <button
          type="button"
          onClick={onToggleDarkMode}
          className="admin-icon-btn"
          title={isDarkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
          aria-label="Toggle Theme"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            type="button"
            className="admin-user-menu-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
          >
            <div className="admin-user-avatar">{initialLetter}</div>
            <div className="admin-user-meta" style={{ display: 'none' }}>
              <span className="admin-user-name">
                {currentUser?.displayName || 'Administrator'}
              </span>
              <span className="admin-user-role">{currentUser?.email || ''}</span>
            </div>
          </button>

          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                width: '230px',
                backgroundColor: 'var(--admin-surface)',
                border: '1px solid var(--admin-border)',
                borderRadius: 'var(--admin-radius)',
                boxShadow: 'var(--admin-shadow-lg)',
                padding: '0.75rem',
                zIndex: 60
              }}
            >
              <div
                style={{
                  paddingBottom: '0.625rem',
                  marginBottom: '0.625rem',
                  borderBottom: '1px solid var(--admin-border)'
                }}
              >
                <div style={{ fontSize: '0.8125rem', fontWeight: 800 }}>
                  {currentUser?.displayName || 'Administrator'}
                </div>
                <div
                  style={{
                    fontSize: '0.71875rem',
                    color: 'var(--admin-text-muted)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {currentUser?.email || 'admin@azharcollection.com'}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.8125rem',
                    padding: '0.5rem',
                    color: 'var(--admin-text-muted)',
                    borderRadius: 'var(--admin-radius)'
                  }}
                >
                  <User size={16} />
                  <span>Sesi Admin Aktif</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false)
                    onLogout()
                  }}
                  className="admin-btn admin-btn-danger admin-btn-sm"
                  style={{ width: '100%', marginTop: '0.25rem' }}
                >
                  <LogOut size={15} />
                  <span>Keluar</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
