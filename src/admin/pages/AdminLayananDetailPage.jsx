import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Edit2, ExternalLink, Scissors, Clock, Package, Layers, AlertCircle, Loader2 } from 'lucide-react'
import { getLayananById } from '../../firebase/adminService'

export default function AdminLayananDetailPage() {
  const { id } = useParams()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    getLayananById(id)
      .then((data) => {
        if (!isMounted) return
        if (data) {
          setService(data)
        } else {
          setError('Data layanan tidak ditemukan')
        }
      })
      .catch((err) => {
        if (isMounted) setError(err?.message || 'Gagal memuat detail layanan')
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
        <p style={{ color: 'var(--admin-text-muted)', fontWeight: 600 }}>Memuat detail layanan konveksi...</p>
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="admin-form-page">
        <Link to="/admin/layanan" className="admin-back-btn" title="Kembali" aria-label="Kembali">
          <ArrowLeft size={18} />
        </Link>
        <div className="admin-alert admin-alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={16} />
          <span>{error || 'Layanan tidak ditemukan'}</span>
        </div>
      </div>
    )
  }

  const materialsText = Array.isArray(service.materials)
    ? service.materials.join(', ')
    : service.materials || '-'

  return (
    <div className="admin-detail-page">
      <div className="admin-detail-header">
        <div className="admin-detail-header-left">
          <Link to="/admin/layanan" className="admin-back-btn" title="Kembali" aria-label="Kembali">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
              <h1 className="admin-page-title" style={{ margin: 0 }}>{service.title}</h1>
              <div className="admin-inline-actions">
                <Link
                  to={`/admin/layanan/edit/${service.id}`}
                  className="admin-action-icon-btn admin-action-icon-btn-primary"
                  title="Ubah Layanan"
                  aria-label="Ubah Layanan"
                >
                  <Edit2 size={16} />
                </Link>
                <a
                  href={`/layanan/${service.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="admin-action-icon-btn"
                  title="Lihat di Web"
                  aria-label="Lihat di Web"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
            <p className="admin-page-desc" style={{ margin: '0.25rem 0 0 0' }}>
              {service.shortDesc || 'Rincian spesifikasi dan alur layanan konveksi.'}
            </p>
          </div>
        </div>
      </div>

      <div className="admin-detail-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="admin-detail-card">
            <h2 className="admin-detail-card-title">
              <Scissors size={18} style={{ color: 'var(--admin-primary)' }} />
              <span>Spesifikasi Produksi & Bahan</span>
            </h2>

            <div className="admin-detail-meta-grid">
              <div className="admin-detail-meta-item">
                <span className="admin-detail-meta-label">
                  <Package size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Minimum Order (MOQ)
                </span>
                <span className="admin-detail-meta-value">{service.moq || '24 Pcs'}</span>
              </div>

              <div className="admin-detail-meta-item">
                <span className="admin-detail-meta-label">
                  <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Estimasi Pengerjaan
                </span>
                <span className="admin-detail-meta-value">{service.leadTime || '7 - 14 Hari'}</span>
              </div>

              <div className="admin-detail-meta-item">
                <span className="admin-detail-meta-label">
                  <Layers size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Bahan Kain Tersedia
                </span>
                <span className="admin-detail-meta-value">{materialsText}</span>
              </div>

              <div className="admin-detail-meta-item">
                <span className="admin-detail-meta-label">ID Sistem</span>
                <span className="admin-detail-meta-value" style={{ fontFamily: 'monospace' }}>
                  {service.id}
                </span>
              </div>
            </div>
          </div>

          <div className="admin-detail-card">
            <h2 className="admin-detail-card-title">
              <span>Deskripsi Lengkap & Alur Pengerjaan Jahitan</span>
            </h2>

            {service.fullDesc || service.detailedDesc || service.desc ? (
              <div
                className="rich-content-view"
                dangerouslySetInnerHTML={{
                  __html: service.fullDesc || service.detailedDesc || service.desc
                }}
              />
            ) : (
              <p style={{ color: 'var(--admin-text-muted)', fontStyle: 'italic', margin: 0 }}>
                Belum ada deskripsi lengkap tertulis untuk layanan ini.
              </p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="admin-detail-card">
            <h2 className="admin-detail-card-title">
              <span>Foto Sampel Layanan</span>
            </h2>

            <div
              style={{
                width: '100%',
                borderRadius: 'var(--admin-radius)',
                overflow: 'hidden',
                backgroundColor: 'var(--admin-surface-hover)',
                aspectRatio: '4/3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--admin-border)'
              }}
            >
              {service.image ? (
                <img
                  src={service.image}
                  alt={service.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <Scissors size={48} style={{ color: 'var(--admin-text-subtle)' }} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
