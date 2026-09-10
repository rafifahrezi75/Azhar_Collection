import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Edit2, Star, MessageSquare, User, AlertCircle, Loader2 } from 'lucide-react'
import { getTestimonialById } from '../../firebase/adminService'

export default function AdminTestimoniDetailPage() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    getTestimonialById(id)
      .then((data) => {
        if (!isMounted) return
        if (data) {
          setItem(data)
        } else {
          setError('Data ulasan testimoni tidak ditemukan')
        }
      })
      .catch((err) => {
        if (isMounted) setError(err?.message || 'Gagal memuat detail testimoni')
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [id])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <Loader2 size={36} className="spin-animation" style={{ color: 'var(--admin-primary)', margin: '0 auto 1rem auto' }} />
        <p style={{ color: 'var(--admin-text-muted)', fontWeight: 600 }}>Memuat detail ulasan...</p>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="admin-form-page">
        <Link to="/admin/testimoni" className="admin-back-btn" title="Kembali" aria-label="Kembali">
          <ArrowLeft size={18} />
        </Link>
        <div className="admin-alert admin-alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={16} />
          <span>{error || 'Testimoni tidak ditemukan'}</span>
        </div>
      </div>
    )
  }

  const clientName = item.clientName || item.name || 'Klien Mitra'
  const role = item.role || item.institution || '-'
  const rating = item.rating || 5
  const comment = item.comment || item.quote || ''
  const avatar = item.avatar || item.image || ''

  return (
    <div className="admin-detail-page">
      <div className="admin-detail-header">
        <div className="admin-detail-header-left">
          <Link to="/admin/testimoni" className="admin-back-btn" title="Kembali" aria-label="Kembali">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
              <h1 className="admin-page-title" style={{ margin: 0 }}>Ulasan dari {clientName}</h1>
              <div className="admin-inline-actions">
                <Link
                  to={`/admin/testimoni/edit/${item.id}`}
                  className="admin-action-icon-btn admin-action-icon-btn-primary"
                  title="Ubah Testimoni"
                  aria-label="Ubah Testimoni"
                >
                  <Edit2 size={16} />
                </Link>
              </div>
            </div>
            <p className="admin-page-desc" style={{ margin: '0.25rem 0 0 0' }}>
              {role}
            </p>
          </div>
        </div>
      </div>

      <div className="admin-detail-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="admin-detail-card">
            <h2 className="admin-detail-card-title">
              <MessageSquare size={18} style={{ color: 'var(--admin-primary)' }} />
              <span>Kutipan Ulasan & Penilaian</span>
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--admin-warning)', marginBottom: '0.5rem' }}>
              {[...Array(rating)].map((_, idx) => (
                <Star key={idx} size={18} fill="currentColor" />
              ))}
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--admin-text-main)', marginLeft: '0.5rem' }}>
                {rating} dari 5 Bintang
              </span>
            </div>

            <div
              className="rich-content-view"
              dangerouslySetInnerHTML={{ __html: comment }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="admin-detail-card">
            <h2 className="admin-detail-card-title">
              <span>Foto Profil Mitra</span>
            </h2>

            <div
              style={{
                width: '100%',
                borderRadius: 'var(--admin-radius)',
                overflow: 'hidden',
                backgroundColor: 'var(--admin-surface-hover)',
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--admin-border)'
              }}
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt={clientName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <User size={64} style={{ color: 'var(--admin-text-subtle)' }} />
              )}
            </div>

            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>{clientName}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--admin-text-muted)' }}>{role}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
