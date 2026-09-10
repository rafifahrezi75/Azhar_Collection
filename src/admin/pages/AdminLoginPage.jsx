import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginAdmin } from '../../firebase/adminService'
import { isFirebaseConfigured } from '../../firebase/config'
import { Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react'
import '../styles/admin.css'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setEmail('')
    setPassword('')
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await loginAdmin(email, password)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.message || 'Login gagal. Periksa kembali email dan kata sandi Anda.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              margin: '0 auto 0.875rem auto',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #5C005C 0%, #800080 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 8px 16px -4px rgba(128, 0, 128, 0.3)'
            }}
          >
            <ShieldCheck size={26} />
          </div>

          <h1 style={{ fontSize: 'clamp(1.1875rem, 3.5vw, 1.375rem)', fontWeight: 800, margin: '0 0 0.375rem 0', color: 'var(--admin-text)' }}>
            Masuk ke Admin Panel
          </h1>
          <p style={{ fontSize: 'clamp(0.75rem, 2.5vw, 0.8125rem)', color: 'var(--admin-text-muted)', margin: 0, lineHeight: 1.45 }}>
            Azhar Collection — Konveksi & Bordir Komputer Sidoarjo
          </p>
        </div>

        {error && (
          <div className="admin-alert admin-alert-danger">
            <span>{error}</span>
          </div>
        )}

        {!isFirebaseConfigured && (
          <div
            style={{
              padding: '0.625rem 0.75rem',
              borderRadius: '10px',
              background: 'var(--admin-primary-soft)',
              color: 'var(--admin-primary)',
              fontSize: '0.71875rem',
              marginBottom: '1.25rem',
              lineHeight: 1.45
            }}
          >
            <strong>Mode Demo Aktif:</strong> Firebase belum dikonfigurasi di .env. Anda dapat langsung masuk dengan kredensial bawaan untuk mencoba dashboard.
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="admin-input-group">
            <label className="admin-label" htmlFor="admin-email" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
              Email Administrator
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-email"
                name="admin_login_email"
                type="email"
                required
                autoComplete="off"
                className="admin-input"
                style={{ paddingLeft: '2.5rem', minHeight: '44px', fontSize: '0.875rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@gmail.com"
              />
              <Mail
                size={16}
                style={{
                  position: 'absolute',
                  left: '0.875rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--admin-text-subtle)',
                  pointerEvents: 'none'
                }}
              />
            </div>
          </div>

          <div className="admin-input-group">
            <label className="admin-label" htmlFor="admin-password" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
              Kata Sandi
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-password"
                name="admin_login_password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                className="admin-input"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', minHeight: '44px', fontSize: '0.875rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
              />
              <Lock
                size={16}
                style={{
                  position: 'absolute',
                  left: '0.875rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--admin-text-subtle)',
                  pointerEvents: 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  padding: '4px',
                  cursor: 'pointer',
                  color: 'var(--admin-text-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="admin-btn admin-btn-primary"
            style={{
              width: '100%',
              marginTop: '0.5rem',
              minHeight: '44px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 600
            }}
          >
            {loading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link
            to="/"
            style={{
              fontSize: '0.8125rem',
              color: 'var(--admin-text-muted)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.375rem 0.75rem'
            }}
          >
            ← Kembali ke Website Utama
          </Link>
        </div>
      </div>
    </div>
  )
}
