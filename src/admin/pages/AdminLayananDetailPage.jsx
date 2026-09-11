import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Edit2, ExternalLink, Scissors, Clock, Package, Layers, AlertCircle, Loader2, FileText } from 'lucide-react'
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
      <div className="admin-card">
        <div className="admin-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/admin/layanan" className="admin-back-btn" title="Kembali" aria-label="Kembali">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
                <h1 className="admin-page-title" style={{ margin: 0 }}>{service.title}</h1>
                <span className="admin-badge admin-badge-primary">Layanan Konveksi</span>
              </div>
              <p className="admin-page-desc" style={{ margin: '0.25rem 0 0 0' }}>
                {service.shortDesc || 'Rincian spesifikasi dan alur layanan konveksi.'}
              </p>
            </div>
          </div>

          <div className="admin-inline-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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

        <div className="admin-detail-grid">
          <div className="admin-detail-showcase">
            <div className="admin-detail-media-frame">
              {service.image ? (
                <img
                  src={service.image}
                  alt={service.title}
                />
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--admin-text-subtle)', padding: '2rem 1rem' }}>
                  <Scissors size={48} style={{ margin: '0 auto 0.5rem auto', opacity: 0.4 }} />
                  <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600 }}>Foto Belum Diunggah</p>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="admin-detail-meta-cards">
              <div className="admin-detail-meta-card">
                <div className="admin-detail-meta-header">
                  <Package size={13} />
                  <span>Minimum Order (MOQ)</span>
                </div>
                <div className="admin-detail-meta-body">
                  {service.moq || '24 Pcs'}
                </div>
              </div>

              <div className="admin-detail-meta-card">
                <div className="admin-detail-meta-header">
                  <Clock size={13} />
                  <span>Estimasi Pengerjaan</span>
                </div>
                <div className="admin-detail-meta-body">
                  {service.leadTime || '7 - 14 Hari'}
                </div>
              </div>

              <div className="admin-detail-meta-card">
                <div className="admin-detail-meta-header">
                  <Layers size={13} />
                  <span>Bahan Kain Tersedia</span>
                </div>
                <div className="admin-detail-meta-body">
                  {materialsText}
                </div>
              </div>
            </div>

            <div className="admin-detail-specs-section">
              <div className="admin-detail-specs-title">
                <FileText size={16} style={{ color: 'var(--admin-primary)' }} />
                <span>Deskripsi Lengkap & Alur Pengerjaan Jahitan</span>
              </div>

              {service.fullDesc || service.detailedDesc || service.desc ? (
                <div
                  className="rich-content-view"
                  dangerouslySetInnerHTML={{
                    __html: service.fullDesc || service.detailedDesc || service.desc
                  }}
                />
              ) : (
                <p style={{ color: 'var(--admin-text-muted)', fontStyle: 'italic', margin: 0, fontSize: '0.8125rem' }}>
                  Belum ada deskripsi lengkap tertulis untuk layanan ini.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

