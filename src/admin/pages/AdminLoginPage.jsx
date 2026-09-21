import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { loginAdmin, subscribeToAuth } from '../../firebase/adminService'
import { isFirebaseConfigured } from '../../firebase/config'
import { Lock, Mail, ArrowRight, ArrowLeft, ShieldCheck, Eye, EyeOff, Clock, AlertCircle, Sun, Moon } from 'lucide-react'
import '../styles/admin.css'

export default function AdminLoginPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('admin-dark') || localStorage.getItem('azhar_admin_theme') === 'dark'
  })

  const [rememberMe, setRememberMe] = useState(() => {
    return Boolean(localStorage.getItem('azhar_admin_remember_email'))
  })
  const [email, setEmail] = useState(() => {
    return localStorage.getItem('azhar_admin_remember_email') || ''
  })
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isIdleLogout = location.state?.reason === 'idle'

  useEffect(() => {
    const savedTheme = localStorage.getItem('azhar_admin_theme')
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('admin-dark')
      setIsDarkMode(true)
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('admin-dark')
      setIsDarkMode(false)
    }
  }, [])

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev
      if (next) {
        document.documentElement.classList.add('admin-dark')
        localStorage.setItem('azhar_admin_theme', 'dark')
      } else {
        document.documentElement.classList.remove('admin-dark')
        localStorage.setItem('azhar_admin_theme', 'light')
      }
      return next
    })
  }

  useEffect(() => {
    const unsubscribe = subscribeToAuth((user) => {
      if (user) {
        const destination = location.state?.from?.pathname || '/admin/dashboard'
        navigate(destination, { replace: true })
      }
    })
    return () => unsubscribe()
  }, [navigate, location.state])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await loginAdmin(email, password, rememberMe)
      if (rememberMe) {
        localStorage.setItem('azhar_admin_remember_email', email.trim())
      } else {
        localStorage.removeItem('azhar_admin_remember_email')
      }
      const destination = location.state?.from?.pathname || '/admin/dashboard'
      navigate(destination, { replace: true })
    } catch (err) {
      setError(err.message || 'Login gagal. Silakan periksa kembali email dan kata sandi Anda.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-wrapper">
      <button
        type="button"
        onClick={handleToggleTheme}
        className="admin-login-theme-toggle"
        title={isDarkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
        aria-label="Toggle Mode Gelap atau Terang"
      >
        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div className="admin-login-card">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div className="admin-login-brand-icon">
            <ShieldCheck size={26} />
          </div>

          <h1 className="admin-login-title">
            Masuk ke Admin Panel
          </h1>
          <p className="admin-login-subtitle">
            Azhar Collection: Konveksi & Bordir Komputer Sidoarjo
          </p>
        </div>

        {isIdleLogout && !error && (
          <div className="admin-alert admin-alert-warning">
            <Clock size={18} style={{ flexShrink: 0 }} />
            <span>Sesi Anda telah berakhir karena tidak ada aktivitas selama 5 menit. Silakan masuk kembali.</span>
          </div>
        )}

        {error && (
          <div className="admin-alert admin-alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {!isFirebaseConfigured && (
          <div className="admin-login-demo-badge">
            <strong>Mode Demo Aktif:</strong> Firebase belum dikonfigurasi di .env. Anda dapat langsung masuk dengan kredensial bawaan untuk mencoba dashboard.
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="admin-input-group">
            <label className="admin-label" htmlFor="admin-email" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
              Email Administrator
            </label>
            <div className="admin-login-field">
              <input
                id="admin-email"
                name="admin_login_email"
                type="email"
                required
                autoComplete="off"
                className="admin-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@gmail.com"
              />
              <Mail size={16} className="admin-login-icon" />
            </div>
          </div>

          <div className="admin-input-group">
            <label className="admin-label" htmlFor="admin-password" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
              Kata Sandi
            </label>
            <div className="admin-login-field">
              <input
                id="admin-password"
                name="admin_login_password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                className="admin-input"
                style={{ paddingRight: '2.5rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
              />
              <Lock size={16} className="admin-login-icon" />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="admin-login-btn-password"
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '0.25rem',
              marginBottom: '1rem'
            }}
          >
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.8125rem',
                color: 'var(--admin-text-main)',
                userSelect: 'none'
              }}
            >
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  accentColor: 'var(--admin-primary)',
                  width: '16px',
                  height: '16px',
                  cursor: 'pointer'
                }}
              />
              <span>Ingat Saya</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="admin-login-submit"
          >
            {loading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
          <Link
            to="/"
            className="admin-login-back-link"
          >
            <ArrowLeft size={14} />
            Kembali ke Website Utama
          </Link>
          <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-subtle)' }}>
            &copy; {new Date().getFullYear()} Azhar Collection. Seluruh hak cipta dilindungi.
          </div>
        </div>
      </div>
    </div>
  )
}
