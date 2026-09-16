import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Edit2, Calendar, Tag, AlertCircle, Loader2, FileText, Hash } from 'lucide-react'
import { getTimelineById } from '../../firebase/adminService'

export default function AdminTimelineDetailPage() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    getTimelineById(id)
      .then((data) => {
        if (!isMounted) return
        if (data) {
          setItem(data)
        } else {
          setError('Data milestone karir tidak ditemukan')
        }
      })
      .catch((err) => {
        if (isMounted) setError(err?.message || 'Gagal memuat detail milestone karir')
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
        <p style={{ color: 'var(--admin-text-muted)', fontWeight: 600 }}>Memuat detail milestone karir...</p>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div style={{ padding: '2rem 1rem' }}>
        <Link to="/admin/karir" className="admin-back-btn" title="Kembali" aria-label="Kembali">
          <ArrowLeft size={18} />
        </Link>
        <div className="admin-alert admin-alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          <AlertCircle size={16} />
          <span>{error || 'Milestone tidak ditemukan'}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-detail-page">
      <div className="admin-card">
        <div
          className="admin-card-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
            padding: '1rem 1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/admin/karir" className="admin-back-btn" title="Kembali" aria-label="Kembali">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
                <h1 className="admin-page-title" style={{ margin: 0 }}>{item.title}</h1>
                <span className="admin-badge admin-badge-primary">{item.badge}</span>
              </div>
              <p className="admin-page-desc" style={{ margin: '0.25rem 0 0 0' }}>
                Periode / Tahun Histori: {item.year}
              </p>
            </div>
          </div>

          <div className="admin-inline-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Link
              to={`/admin/karir/edit/${item.id}`}
              className="admin-action-icon-btn admin-action-icon-btn-primary"
              title="Ubah Milestone"
              aria-label="Ubah Milestone"
            >
              <Edit2 size={16} />
            </Link>
          </div>
        </div>

        <div style={{ padding: '1.5rem' }}>
          <div className="admin-detail-meta-cards" style={{ marginBottom: '1.5rem' }}>
            <div className="admin-detail-meta-card">
              <div className="admin-detail-meta-header">
                <Calendar size={13} />
                <span>Tahun / Periode</span>
              </div>
              <div className="admin-detail-meta-body">
                {item.year}
              </div>
            </div>

            <div className="admin-detail-meta-card">
              <div className="admin-detail-meta-header">
                <Tag size={13} />
                <span>Label Badge</span>
              </div>
              <div className="admin-detail-meta-body">
                {item.badge}
              </div>
            </div>

            <div className="admin-detail-meta-card">
              <div className="admin-detail-meta-header">
                <Hash size={13} />
                <span>Urutan Tampilan</span>
              </div>
              <div className="admin-detail-meta-body">
                {item.order ?? 1}
              </div>
            </div>
          </div>

          <div className="admin-detail-specs-section">
            <div className="admin-detail-specs-title">
              <FileText size={16} style={{ color: 'var(--admin-primary)' }} />
              <span>Deskripsi & Catatan Milestone Karir</span>
            </div>
            <p style={{ color: 'var(--admin-text-main)', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>
              {item.desc || 'Belum ada deskripsi tertulis untuk milestone ini.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
