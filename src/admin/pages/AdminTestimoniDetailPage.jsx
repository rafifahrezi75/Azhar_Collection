import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Edit2, Star, MessageSquare, User, Building2, AlertCircle, Loader2 } from 'lucide-react'
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

  const clientName = item.name || item.clientName || 'Klien'
  const role = item.role || item.institution || 'Mitra'
  const rating = item.rating || 5
  const comment = item.comment || item.quote || ''
  const avatar = item.avatar || item.image || ''

  return (
    <div className="admin-detail-page">
      <div className="admin-card">
        <div className="admin-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/admin/testimoni" className="admin-back-btn" title="Kembali" aria-label="Kembali">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
                <h1 className="admin-page-title" style={{ margin: 0 }}>Ulasan dari {clientName}</h1>
                <span className="admin-badge admin-badge-primary">{rating} Bintang</span>
              </div>
              <p className="admin-page-desc" style={{ margin: '0.25rem 0 0 0' }}>
                {role}
              </p>
            </div>
          </div>

          <div className="admin-inline-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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

        <div className="admin-detail-grid">
          <div className="admin-detail-showcase">
            <div className="admin-detail-media-frame ratio-1-1">
              {avatar ? (
                <img
                  src={avatar}
                  alt={clientName}
                />
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--admin-text-subtle)', padding: '2rem 1rem' }}>
                  <User size={48} style={{ margin: '0 auto 0.5rem auto', opacity: 0.4 }} />
                  <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600 }}>Foto Belum Diunggah</p>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="admin-detail-meta-cards">
              <div className="admin-detail-meta-card">
                <div className="admin-detail-meta-header">
                  <User size={13} />
                  <span>Nama Klien</span>
                </div>
                <div className="admin-detail-meta-body">
                  {clientName}
                </div>
              </div>

              <div className="admin-detail-meta-card">
                <div className="admin-detail-meta-header">
                  <Building2 size={13} />
                  <span>Instansi / Jabatan</span>
                </div>
                <div className="admin-detail-meta-body">
                  {role}
                </div>
              </div>

              <div className="admin-detail-meta-card">
                <div className="admin-detail-meta-header">
                  <Star size={13} />
                  <span>Penilaian Kepuasan</span>
                </div>
                <div className="admin-detail-meta-body" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.125rem', color: 'var(--admin-warning)' }}>
                    {[...Array(rating)].map((_, idx) => (
                      <Star key={idx} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.8125rem' }}>({rating}/5)</span>
                </div>
              </div>
            </div>

            <div className="admin-detail-specs-section">
              <div className="admin-detail-specs-title">
                <MessageSquare size={16} style={{ color: 'var(--admin-primary)' }} />
                <span>Isi Ulasan & Testimoni Klien</span>
              </div>

              {comment ? (
                comment.includes('<') ? (
                  <div
                    className="rich-content-view"
                    dangerouslySetInnerHTML={{ __html: comment }}
                  />
                ) : (
                  <p style={{ color: 'var(--admin-text-main)', whiteSpace: 'pre-line', lineHeight: 1.65, margin: 0, fontSize: '0.875rem' }}>
                    "{comment}"
                  </p>
                )
              ) : (
                <p style={{ color: 'var(--admin-text-muted)', fontStyle: 'italic', margin: 0, fontSize: '0.8125rem' }}>
                  Belum ada catatan ulasan untuk klien ini.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
