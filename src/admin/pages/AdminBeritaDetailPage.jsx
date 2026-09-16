import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Edit2,
  ExternalLink,
  Calendar,
  AlertCircle,
  Loader2,
  Image as ImageIcon
} from 'lucide-react'
import { getBeritaById } from '../../firebase/adminService'

export default function AdminBeritaDetailPage() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    getBeritaById(id)
      .then((data) => {
        if (!isMounted) return
        if (data) {
          setItem(data)
        } else {
          setError('Data foto galeri tidak ditemukan')
        }
      })
      .catch((err) => {
        if (isMounted) setError(err?.message || 'Gagal memuat foto')
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
        <p style={{ color: 'var(--admin-text-muted)', fontWeight: 600 }}>Memuat foto galeri...</p>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="admin-form-page">
        <Link to="/admin/galeri" className="admin-back-btn" title="Kembali" aria-label="Kembali">
          <ArrowLeft size={18} />
        </Link>
        <div className="admin-alert admin-alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={16} />
          <span>{error || 'Foto tidak ditemukan'}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-detail-page">
      <div className="admin-card">
        <div className="admin-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/admin/galeri" className="admin-back-btn" title="Kembali" aria-label="Kembali">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="admin-page-title" style={{ margin: 0 }}>{item.title || `Dokumentasi Foto #${item.id}`}</h1>
              <p className="admin-page-desc" style={{ margin: '0.25rem 0 0 0' }}>
                Foto dokumentasi pengerjaan dan hasil produksi seragam konveksi.
              </p>
            </div>
          </div>

          <div className="admin-inline-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Link
              to={`/admin/galeri/edit/${item.id}`}
              className="admin-action-icon-btn admin-action-icon-btn-primary"
              title="Ubah Foto"
              aria-label="Ubah Foto"
            >
              <Edit2 size={16} />
            </Link>
            <a
              href="/galeri"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-action-icon-btn"
              title="Lihat di Web Publik"
              aria-label="Lihat di Web Publik"
            >
              <ExternalLink size={16} />
            </a>
          </div>
        </div>

        <div className="admin-katalog-detail-grid">
          <div className="admin-katalog-showcase">
            <div className="admin-katalog-media-frame">
              {item.image ? (
                <img
                  src={item.image}
                  alt="Dokumentasi Galeri"
                />
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--admin-text-subtle)', padding: '2rem 1rem' }}>
                  <ImageIcon size={48} style={{ margin: '0 auto 0.5rem auto', opacity: 0.4 }} />
                  <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600 }}>Foto Belum Diunggah</p>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="admin-katalog-meta-cards">
              <div className="admin-katalog-meta-card">
                <div className="admin-katalog-meta-header">
                  <Calendar size={13} />
                  <span>Tanggal Upload</span>
                </div>
                <div className="admin-katalog-meta-body">
                  {item.date || '-'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
