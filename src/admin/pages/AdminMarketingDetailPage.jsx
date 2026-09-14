import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Edit2, Phone, ExternalLink, Image as ImageIcon, User, Briefcase, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { getMarketingById } from '../../firebase/adminService'

export default function AdminMarketingDetailPage() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    getMarketingById(id)
      .then((data) => {
        if (!isMounted) return
        if (data) {
          setItem(data)
        } else {
          setError('Data petugas marketing tidak ditemukan')
        }
      })
      .catch((err) => {
        if (isMounted) setError(err?.message || 'Gagal memuat detail marketing')
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
        <Loader2 size={36} className="spin-animation" style={{ color: 'var(--color-primary)', margin: '0 auto 1rem auto' }} />
        <p style={{ color: 'var(--admin-text-muted)', fontWeight: 600 }}>Memuat detail marketing...</p>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="admin-form-page">
        <Link to="/admin/marketing" className="admin-back-btn" title="Kembali" aria-label="Kembali">
          <ArrowLeft size={18} />
        </Link>
        <div className="admin-alert admin-alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          <AlertCircle size={16} />
          <span>{error || 'Data tidak ditemukan'}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-detail-page">
      <div className="admin-card">
        <div className="admin-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/admin/marketing" className="admin-back-btn" title="Kembali" aria-label="Kembali">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
                <h1 className="admin-page-title" style={{ margin: 0 }}>{item.name}</h1>
                <span className="admin-badge admin-badge-primary">{item.status || 'Online Siap Melayani'}</span>
              </div>
              <p className="admin-page-desc" style={{ margin: '0.25rem 0 0 0' }}>
                {item.division || 'Tim Marketing Azhar Collection'}
              </p>
            </div>
          </div>

          <div className="admin-inline-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Link
              to={`/admin/marketing/edit/${item.id}`}
              className="admin-action-icon-btn admin-action-icon-btn-primary"
              title="Ubah Petugas"
              aria-label="Ubah Petugas"
            >
              <Edit2 size={16} />
            </Link>
          </div>
        </div>

        <div className="admin-detail-grid">
          <div className="admin-detail-showcase">
            <div className="admin-detail-media-frame ratio-1-1">
              {item.photo ? (
                <img
                  src={item.photo}
                  alt={item.name}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    if (e.currentTarget.nextElementSibling) {
                      e.currentTarget.nextElementSibling.style.display = 'flex'
                    }
                  }}
                />
              ) : null}
              <div
                style={{
                  display: item.photo ? 'none' : 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--admin-text-subtle)',
                  padding: '2rem 1rem'
                }}
              >
                <ImageIcon size={48} style={{ margin: '0 auto 0.5rem auto', opacity: 0.4 }} />
                <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600 }}>Foto Belum Diunggah</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="admin-detail-meta-cards">
              <div className="admin-detail-meta-card">
                <div className="admin-detail-meta-header">
                  <User size={13} />
                  <span>Nama Petugas</span>
                </div>
                <div className="admin-detail-meta-body">
                  {item.name}
                </div>
              </div>

              <div className="admin-detail-meta-card">
                <div className="admin-detail-meta-header">
                  <Briefcase size={13} />
                  <span>Divisi / Jabatan</span>
                </div>
                <div className="admin-detail-meta-body">
                  {item.division || '-'}
                </div>
              </div>

              <div className="admin-detail-meta-card">
                <div className="admin-detail-meta-header">
                  <Phone size={13} />
                  <span>Nomor WhatsApp / HP</span>
                </div>
                <div className="admin-detail-meta-body">
                  {item.phone}
                </div>
              </div>

              <div className="admin-detail-meta-card">
                <div className="admin-detail-meta-header">
                  <CheckCircle2 size={13} />
                  <span>Status & Prioritas</span>
                </div>
                <div className="admin-detail-meta-body">
                  {item.status || 'Online Siap Melayani'} (Urutan: {item.order || 1})
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--admin-bg-alt, #F9FAFB)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--admin-border, #E5E7EB)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--admin-text-main)', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                  Tautan Percakapan WhatsApp
                </div>
                <div style={{ fontSize: '0.78125rem', color: 'var(--admin-text-muted)', wordBreak: 'break-all' }}>
                  {item.waUrl}
                </div>
              </div>
              <a
                href={item.waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="admin-btn admin-btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
              >
                <Phone size={15} />
                <span>Uji Coba WhatsApp</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
