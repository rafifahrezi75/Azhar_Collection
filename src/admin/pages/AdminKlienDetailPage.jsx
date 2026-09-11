import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Edit2, ExternalLink, MapPin, Calendar, Users, PackageCheck, AlertCircle, Loader2, School, FileText } from 'lucide-react'
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
      <div className="admin-card">
        <div className="admin-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/admin/klien" className="admin-back-btn" title="Kembali" aria-label="Kembali">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
                <h1 className="admin-page-title" style={{ margin: 0 }}>{client.name}</h1>
                <span className="admin-badge admin-badge-primary">{client.category || 'Institusi Mitra'}</span>
              </div>
              <p className="admin-page-desc" style={{ margin: '0.25rem 0 0 0' }}>
                Profil rekam jejak kemitraan produksi busana seragam.
              </p>
            </div>
          </div>

          <div className="admin-inline-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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

        <div className="admin-detail-grid">
          <div className="admin-detail-showcase">
            <div className="admin-detail-media-frame ratio-1-1">
              {client.image ? (
                <img
                  src={client.image}
                  alt={client.name}
                />
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--admin-text-subtle)', padding: '2rem 1rem' }}>
                  <School size={48} style={{ margin: '0 auto 0.5rem auto', opacity: 0.4 }} />
                  <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600 }}>Foto Belum Diunggah</p>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="admin-detail-meta-cards">
              <div className="admin-detail-meta-card">
                <div className="admin-detail-meta-header">
                  <MapPin size={13} />
                  <span>Kota / Wilayah</span>
                </div>
                <div className="admin-detail-meta-body">
                  {client.city || '-'}
                </div>
              </div>

              <div className="admin-detail-meta-card">
                <div className="admin-detail-meta-header">
                  <Calendar size={13} />
                  <span>Kemitraan Sejak</span>
                </div>
                <div className="admin-detail-meta-body">
                  {client.since || '-'}
                </div>
              </div>

              <div className="admin-detail-meta-card">
                <div className="admin-detail-meta-header">
                  <Users size={13} />
                  <span>Kontak PIC</span>
                </div>
                <div className="admin-detail-meta-body">
                  {client.contactPerson || '-'}
                </div>
              </div>

              <div className="admin-detail-meta-card">
                <div className="admin-detail-meta-header">
                  <PackageCheck size={13} />
                  <span>Akumulasi Pesanan</span>
                </div>
                <div className="admin-detail-meta-body">
                  {client.totalPcs || client.totalOrders || '-'}
                </div>
              </div>
            </div>

            <div className="admin-detail-specs-section">
              <div className="admin-detail-specs-title">
                <FileText size={16} style={{ color: 'var(--admin-primary)' }} />
                <span>Ringkasan Kemitraan & Rekam Jejak Produksi</span>
              </div>

              {client.summary ? (
                <div
                  className="rich-content-view"
                  dangerouslySetInnerHTML={{ __html: client.summary }}
                />
              ) : (
                <p style={{ color: 'var(--admin-text-muted)', fontStyle: 'italic', margin: 0, fontSize: '0.8125rem' }}>
                  Belum ada ringkasan kemitraan tertulis untuk mitra ini.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
