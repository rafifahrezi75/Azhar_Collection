import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Edit2, ExternalLink, Building2, MapPin, Calendar, Users, PackageCheck, AlertCircle, Loader2 } from 'lucide-react'
import { getKlienById } from '../../firebase/adminService'

export default function AdminKlienDetailPage() {
  const { id } = useParams()
  const [client, setClient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    getKlienById(id)
      .then((data) => {
        if (!isMounted) return
        if (data) {
          setClient(data)
        } else {
          setError('Data mitra tidak ditemukan')
        }
      })
      .catch((err) => {
        if (isMounted) setError(err?.message || 'Gagal memuat detail mitra')
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
        <p style={{ color: 'var(--admin-text-muted)', fontWeight: 600 }}>Memuat detail profil mitra...</p>
      </div>
    )
  }

  if (error || !client) {
    return (
      <div className="admin-form-page">
        <Link to="/admin/klien" className="admin-back-btn" title="Kembali" aria-label="Kembali">
          <ArrowLeft size={18} />
        </Link>
        <div className="admin-alert admin-alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={16} />
          <span>{error || 'Mitra tidak ditemukan'}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-detail-page">
      <div className="admin-detail-header">
        <div className="admin-detail-header-left">
          <Link to="/admin/klien" className="admin-back-btn" title="Kembali" aria-label="Kembali">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
              <h1 className="admin-page-title" style={{ margin: 0 }}>{client.name}</h1>
              <span className="admin-badge admin-badge-primary">{client.category || 'Institusi Mitra'}</span>
              <div className="admin-inline-actions">
                <Link
                  to={`/admin/klien/edit/${client.id}`}
                  className="admin-action-icon-btn admin-action-icon-btn-primary"
                  title="Ubah Profil Mitra"
                  aria-label="Ubah Profil Mitra"
                >
                  <Edit2 size={16} />
                </Link>
                <a
                  href="/klien"
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
              Profil rekam jejak kemitraan produksi busana seragam.
            </p>
          </div>
        </div>
      </div>

      <div className="admin-detail-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="admin-detail-card">
            <h2 className="admin-detail-card-title">
              <Building2 size={18} style={{ color: 'var(--admin-primary)' }} />
              <span>Informasi Kemitraan</span>
            </h2>

            <div className="admin-detail-meta-grid">
              <div className="admin-detail-meta-item">
                <span className="admin-detail-meta-label">
                  <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Kota / Wilayah
                </span>
                <span className="admin-detail-meta-value">{client.city || '-'}</span>
              </div>

              <div className="admin-detail-meta-item">
                <span className="admin-detail-meta-label">
                  <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Kemitraan Sejak
                </span>
                <span className="admin-detail-meta-value">{client.since || '-'}</span>
              </div>

              <div className="admin-detail-meta-item">
                <span className="admin-detail-meta-label">
                  <Users size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Kontak PIC
                </span>
                <span className="admin-detail-meta-value">{client.contactPerson || '-'}</span>
              </div>

              <div className="admin-detail-meta-item">
                <span className="admin-detail-meta-label">
                  <PackageCheck size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Akumulasi Pesanan
                </span>
                <span className="admin-detail-meta-value">{client.totalPcs || client.totalOrders || '-'}</span>
              </div>
            </div>
          </div>

          <div className="admin-detail-card">
            <h2 className="admin-detail-card-title">
              <span>Ringkasan Kemitraan & Rekam Jejak Produksi</span>
            </h2>

            {client.summary ? (
              <div
                className="rich-content-view"
                dangerouslySetInnerHTML={{ __html: client.summary }}
              />
            ) : (
              <p style={{ color: 'var(--admin-text-muted)', fontStyle: 'italic', margin: 0 }}>
                Belum ada ringkasan kemitraan tertulis untuk mitra ini.
              </p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="admin-detail-card">
            <h2 className="admin-detail-card-title">
              <span>Logo / Foto Institusi</span>
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
                padding: '1.5rem',
                border: '1px solid var(--admin-border)'
              }}
            >
              {client.image ? (
                <img
                  src={client.image}
                  alt={client.name}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              ) : (
                <Building2 size={64} style={{ color: 'var(--admin-text-subtle)' }} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
