import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Edit2,
  ExternalLink,
  Shirt,
  Tag,
  Building2,
  Layers,
  AlertCircle,
  Loader2,
  FileText
} from 'lucide-react'
import { getKatalogById, normalizeProductImages, createSlug } from '../../firebase/adminService'

export default function AdminKatalogDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [activePhotoIdx, setActivePhotoIdx] = useState(0)
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

  const productImages = normalizeProductImages(product)
  const activeImage = productImages[activePhotoIdx] || productImages[0]
  const productSlug = product.slug || createSlug(product.name) || product.id

  return (
    <div className="admin-detail-page">
      <div className="admin-card">
        <div className="admin-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/admin/katalog" className="admin-back-btn" title="Kembali" aria-label="Kembali">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
                <h1 className="admin-page-title" style={{ margin: 0 }}>{product.name}</h1>
                <span className="admin-badge admin-badge-primary">{product.categoryLabel || product.category || 'Katalog'}</span>
              </div>
              <p className="admin-page-desc" style={{ margin: '0.25rem 0 0 0' }}>
                Rincian spesifikasi teknis model busana dan dokumentasi jahitan.
              </p>
            </div>
          </div>

          <div className="admin-inline-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Link
              to={`/admin/katalog/edit/${product.id}`}
              className="admin-action-icon-btn admin-action-icon-btn-primary"
              title="Ubah Produk"
              aria-label="Ubah Produk"
            >
              <Edit2 size={16} />
            </Link>
            <a
              href={`/katalog/${productSlug}`}
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

        <div className="admin-katalog-detail-grid">
          <div className="admin-katalog-showcase">
            <div className="admin-katalog-media-frame" style={{ position: 'relative' }}>
              {activeImage?.url ? (
                <>
                  <img
                    src={activeImage.url}
                    alt={product.name}
                  />
                  {activeImage.gender && activeImage.gender !== 'Tanpa Badge' && (
                    <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', zIndex: 5 }}>
                      <span
                        className={
                          activeImage.gender === 'Laki-laki'
                            ? 'admin-badge-male'
                            : activeImage.gender === 'Perempuan'
                            ? 'admin-badge-female'
                            : 'admin-badge-unisex'
                        }
                      >
                        {activeImage.gender}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--admin-text-subtle)', padding: '2rem 1rem' }}>
                  <Shirt size={48} style={{ margin: '0 auto 0.5rem auto', opacity: 0.4 }} />
                  <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600 }}>Foto Belum Diunggah</p>
                </div>
              )}
            </div>

            {productImages.length > 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))', gap: '0.5rem', marginTop: '0.75rem' }}>
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIdx(idx)}
                    style={{
                      position: 'relative',
                      height: '70px',
                      borderRadius: 'var(--admin-radius)',
                      overflow: 'hidden',
                      padding: 0,
                      border: activePhotoIdx === idx ? '2px solid var(--admin-primary)' : '1px solid var(--admin-border)',
                      background: 'var(--admin-surface-hover)',
                      cursor: 'pointer',
                      opacity: activePhotoIdx === idx ? 1 : 0.65
                    }}
                  >
                    <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {img.gender && img.gender !== 'Tanpa Badge' && (
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '2px',
                          left: '2px',
                          right: '2px',
                          fontSize: '9px',
                          fontWeight: 700,
                          padding: '1px 3px',
                          borderRadius: '2px',
                          textAlign: 'center',
                          color: '#FFFFFF',
                          background: img.gender === 'Laki-laki' ? '#2563EB' : img.gender === 'Perempuan' ? '#DB2777' : '#475569',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {img.gender}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="admin-katalog-meta-cards">
              <div className="admin-katalog-meta-card">
                <div className="admin-katalog-meta-header">
                  <Tag size={13} />
                  <span>Kategori Busana</span>
                </div>
                <div className="admin-katalog-meta-body">
                  {product.categoryLabel || product.category || '-'}
                </div>
              </div>

              <div className="admin-katalog-meta-card">
                <div className="admin-katalog-meta-header">
                  <Building2 size={13} />
                  <span>Mitra / Lembaga Pemesan</span>
                </div>
                <div className="admin-katalog-meta-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700 }}>{product.client || '-'}</span>
                  {product.clientId && (
                    <Link
                      to={`/admin/klien/detail/${product.clientId}`}
                      className="admin-badge admin-badge-primary"
                      style={{ fontSize: '0.6875rem', textDecoration: 'none' }}
                    >
                      Lihat Klien
                    </Link>
                  )}
                </div>
              </div>

              <div className="admin-katalog-meta-card">
                <div className="admin-katalog-meta-header">
                  <Layers size={13} />
                  <span>Bahan Utama Kain</span>
                </div>
                <div className="admin-katalog-meta-body">
                  {Array.isArray(product.materials) && product.materials.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: '1.15rem', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {product.materials.map((mat, idx) => (
                        <li key={idx} style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                          {mat}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span>{product.material || '-'}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="admin-katalog-specs-section">
              <div className="admin-katalog-specs-title">
                <FileText size={16} style={{ color: 'var(--admin-primary)' }} />
                <span>Rincian Spesifikasi & Keunggulan Model</span>
              </div>

              {product.specs ? (
                product.specs.includes('<') ? (
                  <div
                    className="rich-content-view"
                    dangerouslySetInnerHTML={{ __html: product.specs }}
                  />
                ) : (
                  <p style={{ color: 'var(--admin-text-main)', whiteSpace: 'pre-line', lineHeight: 1.65, margin: 0, fontSize: '0.875rem' }}>
                    {product.specs}
                  </p>
                )
              ) : (
                <p style={{ color: 'var(--admin-text-muted)', fontStyle: 'italic', margin: 0, fontSize: '0.8125rem' }}>
                  Belum ada rincian spesifikasi tertulis untuk model busana ini.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

