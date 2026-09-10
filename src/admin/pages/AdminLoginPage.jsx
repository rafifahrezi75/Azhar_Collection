import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginAdmin } from '../../firebase/adminService'
import { isFirebaseConfigured } from '../../firebase/config'
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react'
import '../styles/admin.css'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

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
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              margin: '0 auto 1rem auto',
              borderRadius: 'var(--admin-radius)',
              background: 'linear-gradient(135deg, #5C005C 0%, #800080 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}
          >
            <ShieldCheck size={28} />
          </div>

          <h1 style={{ fontSize: '1.375rem', fontWeight: 800, margin: '0 0 0.375rem 0' }}>
            Masuk ke Admin Panel
          </h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-muted)', margin: 0 }}>
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
              padding: '0.75rem',
              borderRadius: 'var(--admin-radius)',
              background: 'var(--admin-primary-soft)',
              color: 'var(--admin-primary)',
              fontSize: '0.75rem',
              marginBottom: '1.25rem',
              lineHeight: 1.4
            }}
          >
            <strong>Mode Demo Aktif:</strong> Firebase belum dikonfigurasi di .env. Anda dapat langsung masuk dengan kredensial bawaan untuk mencoba dashboard.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="admin-input-group">
            <label className="admin-label" htmlFor="admin-email">
              Email Administrator
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-email"
                type="email"
                required
                className="admin-input"
                style={{ paddingLeft: '2.5rem' }}
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
                  color: 'var(--admin-text-subtle)'
                }}
              />
            </div>
          </div>

          <div className="admin-input-group">
            <label className="admin-label" htmlFor="admin-password">
              Kata Sandi
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-password"
                type="password"
                required
                className="admin-input"
                style={{ paddingLeft: '2.5rem' }}
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
                  color: 'var(--admin-text-subtle)'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="admin-btn admin-btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {loading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link
            to="/"
            style={{
              fontSize: '0.78125rem',
              color: 'var(--admin-text-muted)',
              textDecoration: 'none'
            }}
          >
            ← Kembali ke Website Utama
          </Link>
        </div>
      </div>
    </div>
  )
}
