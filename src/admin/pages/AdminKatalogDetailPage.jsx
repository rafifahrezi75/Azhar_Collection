import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Edit2, ExternalLink, Shirt, Tag, Building2, Layers, AlertCircle, Loader2 } from 'lucide-react'
import { getKatalogById } from '../../firebase/adminService'

export default function AdminKatalogDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    getKatalogById(id)
      .then((data) => {
        if (!isMounted) return
        if (data) {
          setProduct(data)
        } else {
          setError('Data model produk tidak ditemukan')
        }
      })
      .catch((err) => {
        if (isMounted) setError(err?.message || 'Gagal memuat detail produk')
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
        <p style={{ color: 'var(--admin-text-muted)', fontWeight: 600 }}>Memuat detail produk busana...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="admin-form-page">
        <Link to="/admin/katalog" className="admin-back-btn" title="Kembali" aria-label="Kembali">
          <ArrowLeft size={18} />
        </Link>
        <div className="admin-alert admin-alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={16} />
          <span>{error || 'Produk tidak ditemukan'}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-detail-page">
      <div className="admin-detail-header">
        <div className="admin-detail-header-left">
          <Link to="/admin/katalog" className="admin-back-btn" title="Kembali" aria-label="Kembali">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
              <h1 className="admin-page-title" style={{ margin: 0 }}>{product.name}</h1>
              {product.badge && (
                <span className="admin-badge admin-badge-success">{product.badge}</span>
              )}
              <div className="admin-inline-actions">
                <Link
                  to={`/admin/katalog/edit/${product.id}`}
                  className="admin-action-icon-btn admin-action-icon-btn-primary"
                  title="Ubah Produk"
                  aria-label="Ubah Produk"
                >
                  <Edit2 size={16} />
                </Link>
                <a
                  href={`/katalog/${product.id}`}
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
              Rincian spesifikasi teknis model busana dan dokumentasi jahitan.
            </p>
          </div>
        </div>
      </div>

      <div className="admin-detail-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="admin-detail-card">
            <h2 className="admin-detail-card-title">
              <Shirt size={18} style={{ color: 'var(--admin-primary)' }} />
              <span>Informasi & Atribut Busana</span>
            </h2>

            <div className="admin-detail-meta-grid">
              <div className="admin-detail-meta-item">
                <span className="admin-detail-meta-label">
                  <Tag size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Kategori
                </span>
                <span className="admin-detail-meta-value">
                  {product.categoryLabel || product.category || '-'}
                </span>
              </div>

              <div className="admin-detail-meta-item">
                <span className="admin-detail-meta-label">
                  <Building2 size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Mitra / Klien Pemesan
                </span>
                <span className="admin-detail-meta-value">{product.client || '-'}</span>
              </div>

              <div className="admin-detail-meta-item">
                <span className="admin-detail-meta-label">
                  <Layers size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Bahan Utama Kain
                </span>
                <span className="admin-detail-meta-value">{product.material || product.specs || '-'}</span>
              </div>

              <div className="admin-detail-meta-item">
                <span className="admin-detail-meta-label">ID Sistem</span>
                <span className="admin-detail-meta-value" style={{ fontFamily: 'monospace' }}>
                  {product.id}
                </span>
              </div>
            </div>
          </div>

          <div className="admin-detail-card">
            <h2 className="admin-detail-card-title">
              <span>Rincian Spesifikasi & Keterangan Jahitan</span>
            </h2>

            {product.specs || product.customDetails ? (
              <div
                className="rich-content-view"
                dangerouslySetInnerHTML={{
                  __html: product.specs || product.customDetails
                }}
              />
            ) : (
              <p style={{ color: 'var(--admin-text-muted)', fontStyle: 'italic', margin: 0 }}>
                Belum ada rincian spesifikasi tertulis untuk produk ini.
              </p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="admin-detail-card">
            <h2 className="admin-detail-card-title">
              <span>Foto Model Busana</span>
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
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <Shirt size={48} style={{ color: 'var(--admin-text-subtle)' }} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
