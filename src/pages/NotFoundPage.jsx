import { Link, useLocation } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function NotFoundPage() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#2D0831',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8.5rem 1.25rem 4rem 1.25rem',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          maxWidth: '540px',
          width: '100%',
          textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '8px',
          padding: 'clamp(2rem, 5vw, 3.25rem) clamp(1.25rem, 4vw, 2.5rem)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.35)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div
          style={{
            fontSize: 'clamp(4.5rem, 12vw, 6.5rem)',
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '-0.04em',
            background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 50%, #FFFFFF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 1rem 0'
          }}
        >
          404
        </div>

        <h1
          style={{
            fontSize: 'clamp(1.25rem, 3.5vw, 1.5rem)',
            fontWeight: 800,
            color: '#FFFFFF',
            margin: '0 0 0.75rem 0',
            lineHeight: 1.3
          }}
        >
          Halaman Tidak Ditemukan
        </h1>

        <p
          style={{
            fontSize: 'clamp(0.875rem, 2.5vw, 0.9375rem)',
            color: 'rgba(255, 255, 255, 0.75)',
            lineHeight: 1.6,
            margin: '0 auto 2rem auto',
            maxWidth: '420px'
          }}
        >
          Maaf, halaman yang Anda tuju tidak ditemukan atau telah dipindahkan.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link
            to={isAdmin ? '/admin/dashboard' : '/'}
            className="btn-primary"
            style={{
              padding: '0.875rem 2rem',
              fontSize: '0.9375rem',
              borderRadius: '4px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Home size={18} />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
