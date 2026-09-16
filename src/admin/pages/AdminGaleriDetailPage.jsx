import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Edit2, Calendar, Loader2, Image as ImageIcon } from 'lucide-react'
import { getGalleryById } from '../../firebase/adminService'

export default function AdminGaleriDetailPage() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    getGalleryById(id)
      .then((data) => {
        if (!isMounted) return
        if (data) {
          setItem(data)
        } else {
          setError('Foto galeri tidak ditemukan.')
        }
      })
      .catch((err) => {
        if (isMounted) setError(err?.message || 'Gagal memuat detail foto galeri.')
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
        <p style={{ color: 'var(--admin-text-muted)', fontWeight: 600 }}>Memuat detail foto galeri...</p>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="admin-card" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--admin-text-main)', marginBottom: '0.5rem' }}>Data Tidak Ditemukan</h2>
        <p style={{ color: 'var(--admin-text-muted)', marginBottom: '1.5rem' }}>{error || 'Foto galeri tidak tersedia.'}</p>
        <Link to="/admin/galeri" className="admin-btn admin-btn-primary" style={{ display: 'inline-flex' }}>
          <ArrowLeft size={16} />
          <span>Kembali ke Galeri</span>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Detail Foto Galeri</h1>
          <p className="admin-page-desc">
            Detail dokumentasi foto galeri #{item.id}
          </p>
        </div>

        <div className="admin-breadcrumbs">
          <Link to="/admin">Admin</Link>
          <span>/</span>
          <Link to="/admin/galeri">Galeri Foto</Link>
          <span>/</span>
          <span className="current">Detail</span>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/admin/galeri" className="admin-back-btn" title="Kembali" aria-label="Kembali">
              <ArrowLeft size={18} />
            </Link>

            <div>
              <h2 className="admin-card-title" style={{ margin: 0 }}>
                {item.title && item.title.trim() ? item.title : 'Dokumentasi Galeri'}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginTop: '0.2rem' }}>
                <Calendar size={13} />
                <span>Tanggal Upload: {item.date || '-'}</span>
              </div>
            </div>
          </div>

          <Link
            to={`/admin/galeri/edit/${item.id}`}
            className="admin-action-icon-btn admin-action-icon-btn-primary"
            title="Ubah Foto"
            aria-label="Ubah Foto"
          >
            <Edit2 size={16} />
          </Link>
        </div>

        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'center' }}>
          {item.image ? (
            <div style={{ maxWidth: '720px', width: '100%', borderRadius: 'var(--admin-radius)', overflow: 'hidden', border: '1px solid var(--admin-border)', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
              <img
                src={item.image}
                alt={item.title || 'Dokumentasi Galeri'}
                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
              />
            </div>
          ) : (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: 'var(--admin-surface-hover)', borderRadius: 'var(--admin-radius)', width: '100%' }}>
              <ImageIcon size={48} style={{ color: 'var(--admin-text-subtle)', marginBottom: '0.5rem' }} />
              <p style={{ color: 'var(--admin-text-muted)', margin: 0 }}>Tidak ada berkas foto yang diunggah.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
