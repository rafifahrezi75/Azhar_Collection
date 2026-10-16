import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { getKatalogList, getKlienList, normalizeProductImages, createSlug, normalizeProductCategory } from '../firebase/adminService'
import { ProductDetailSkeleton } from '../components/SkeletonLoader'
import { portfolioProducts as fallbackProducts, clientsData as fallbackClients } from '../data/siteData'
import {
  ArrowLeft,
  School,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Package
} from 'lucide-react'

function formatPcs(val) {
  if (!val) return ''
  const trimmed = String(val).trim()
  if (!trimmed) return ''
  return /pcs|setel|buah|lembar/i.test(trimmed) ? trimmed : `${trimmed} Pcs`
}

function shouldShowBadge(gender) {
  if (!gender) return false
  const g = String(gender).trim().toLowerCase()
  return g === 'laki-laki' || g === 'perempuan' || g === 'unisex'
}

function getGenderBadgeClass(gender) {
  if (gender === 'Laki-laki') return 'gender-male'
  if (gender === 'Perempuan') return 'gender-female'
  return 'gender-unisex'
}

export default function ProductDetailPage() {
  const { slug, productId } = useParams()
  const targetParam = slug || productId
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [productsList, setProductsList] = useState(fallbackProducts)
  const [clientsList, setClientsList] = useState(fallbackClients)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setActiveImageIndex(0)
  }, [targetParam])

  useEffect(() => {
    let isMounted = true
    Promise.all([getKatalogList(), getKlienList()]).then(([prods, clis]) => {
      if (isMounted) {
        if (prods) setProductsList(prods)
        if (clis) setClientsList(clis)
        setIsLoading(false)
      }
    })
    return () => {
      isMounted = false
    }
  }, [])

  const allProducts = [
    ...productsList,
    ...clientsList.flatMap((c) =>
      (c.orderedProducts || []).map((p) => ({
        ...p,
        categoryLabel: p.category,
        specs: p.material || p.specs,
        customDetails: p.specs,
        client: c.name,
        clientOrigin: c.name,
        clientId: c.id
      }))
    )
  ]

  const product = allProducts.find((p) => {
    const current = String(targetParam || '').toLowerCase()
    const pSlug = (p.slug || createSlug(p.name)).toLowerCase()
    return (
      pSlug === current ||
      createSlug(p.name).toLowerCase() === current ||
      String(p.id).toLowerCase() === current
    )
  })

  const client = product
    ? clientsList.find((c) => String(c.id) === String(product.clientId) || c.name === product.client || c.name === product.clientOrigin) || {
        name: product.clientOrigin || product.client || 'Mitra Instansi',
        image: product.image,
        city: 'Sidoarjo, Jawa Timur',
        since: '2021'
      }
    : null

  const galleryImages = product ? normalizeProductImages(product, { includeCover: false }) : []
  const activeImage = galleryImages[activeImageIndex] || galleryImages[0]
  const materialsList = product
    ? Array.isArray(product.materials) && product.materials.length > 0
      ? product.materials
      : typeof product.material === 'string' && product.material.trim()
      ? product.material.split(',').map((s) => s.trim()).filter(Boolean)
      : []
    : []

  useEffect(() => {
    if (galleryImages.length <= 1 || isPaused) return
    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % galleryImages.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [galleryImages.length, isPaused])

  if (isLoading) {
    return <ProductDetailSkeleton />
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <PageHeader
          title="Model Tidak Ditemukan"
          subtitle="Model busana yang Anda cari tidak ditemukan dalam katalog kami."
          breadcrumb="Detail Produk"
        />
        <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            Silakan kembali ke katalog untuk melihat seluruh pilihan model seragam dan busana yang pernah dikerjakan.
          </p>
          <Link to="/katalog" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={16} />
            <span>Kembali ke Katalog Baju</span>
          </Link>
        </div>
      </div>
    )
  }

  const relatedProducts = productsList
    .filter((p) => String(p.id) !== String(product.id))
    .slice(0, 3)

  return (
    <div className="product-detail-page">
      <PageHeader
        title={product.name}
        subtitle="Spesifikasi Bahan Kain, Detail Pengerjaan, dan Riwayat Klien Pemesan"
        breadcrumb={product.name}
      />

      <section className="product-detail-section" style={{ padding: '2.5rem 0 4rem 0' }}>
        <div className="container">
          <div className="product-detail-hero-grid">
            <div className="reveal-left">
              <div className="product-detail-image-box">
                {activeImage?.url ? (
                  <img
                    src={activeImage.url}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.3s ease' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                    Foto Tidak Tersedia
                  </div>
                )}

                {shouldShowBadge(activeImage?.gender) && (
                  <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 10 }}>
                    <span className={`product-gender-badge ${getGenderBadgeClass(activeImage.gender)}`}>
                      {activeImage.gender}
                    </span>
                  </div>
                )}

                {galleryImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsPaused(true)
                        setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
                      }}
                      aria-label="Foto Sebelumnya"
                      style={{
                        position: 'absolute',
                        left: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'rgba(0, 0, 0, 0.45)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        border: 'none'
                      }}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsPaused(true)
                        setActiveImageIndex((prev) => (prev + 1) % galleryImages.length)
                      }}
                      aria-label="Foto Berikutnya"
                      style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'rgba(0, 0, 0, 0.45)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        border: 'none'
                      }}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              {galleryImages.length > 1 && (
                <div className="product-detail-thumbs-grid">
                  {galleryImages.map((imgItem, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setIsPaused(true)
                        setActiveImageIndex(idx)
                      }}
                      className={`product-thumb-btn ${activeImageIndex === idx ? 'active' : ''}`}
                      aria-label={`Foto ${idx + 1}`}
                    >
                      <img
                        src={imgItem.url}
                        alt={`Thumbnail ${idx + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      {shouldShowBadge(imgItem.gender) && (
                        <span className={`product-thumb-badge ${getGenderBadgeClass(imgItem.gender)}`}>
                          {imgItem.gender}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="reveal-right delay-150" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <span className="section-tag" style={{ margin: 0 }}>{normalizeProductCategory(product.category, product.categoryLabel).categoryLabel}</span>
              </div>

              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: '0 0 1.25rem 0', lineHeight: 1.3 }}>
                {product.name}
              </h1>

              {client && (
                <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.75rem', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-xs)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img
                      src={client.logo || client.image || product.image}
                      alt={client.name}
                      style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-md)', objectFit: 'cover', border: '1px solid var(--color-border)', flexShrink: 0 }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary)', background: 'var(--color-primary-soft)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                          Instansi Pemesan
                        </span>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: 0, lineHeight: 1.3 }}>
                          {client.name}
                        </h3>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                        {client.city && (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <MapPin size={14} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                            <span>{client.city}</span>
                          </div>
                        )}
                        {client.since && (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Calendar size={14} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                            <span>Mitra Sejak {client.since}</span>
                          </div>
                        )}
                        {client.totalPcs && client.totalPcs.trim() && (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Package size={14} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                            <span>Pesanan: {formatPcs(client.totalPcs)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: 0 }}>
                  Deskripsi & Spesifikasi Produk
                </h3>

                {materialsList.length > 0 && (
                  <div style={{ background: 'var(--color-bg-light)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary)', margin: '0 0 0.625rem 0' }}>
                      Bahan Utama Kain
                    </p>
                    <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {materialsList.map((mat, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary-dark)', lineHeight: 1.5 }}>
                          <span style={{ fontWeight: 700, color: 'var(--color-primary)', minWidth: '1.25rem' }}>
                            {idx + 1}.
                          </span>
                          <span>{mat}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {product.specs?.includes('<') ? (
                  <div
                    className="rich-content-view"
                    dangerouslySetInnerHTML={{ __html: product.specs }}
                  />
                ) : product.specs ? (
                  <div style={{ background: 'var(--color-bg-light)', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary)', margin: '0 0 0.5rem 0' }}>
                      Rincian Spesifikasi & Keunggulan Model
                    </p>
                    <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--color-text-muted)', margin: 0, whiteSpace: 'pre-line' }}>
                      {product.specs}
                    </p>
                  </div>
                ) : product.customDetails ? (
                  <div style={{ background: 'var(--color-bg-light)', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--color-text-muted)', margin: 0, whiteSpace: 'pre-line' }}>
                      {product.customDetails}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="reveal-up">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
              <div>
                <span className="section-tag">KATALOG LAINNYA</span>
                <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: 0 }}>
                  Model Baju Terkait Yang Pernah Dikerjakan
                </h3>
              </div>
              <Link to="/katalog" className="btn-outline" style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}>
                Lihat Semua Katalog
              </Link>
            </div>

            <div className="products-grid">
              {relatedProducts.map((item, idx) => {
                const itemImages = normalizeProductImages(item)
                const itemCover = itemImages[0]?.url || item.image
                const itemSlug = item.slug || createSlug(item.name) || item.id

                return (
                  <Link
                    key={item.id}
                    to={`/katalog/${itemSlug}`}
                    className={`product-card product-card-clean reveal-up delay-${Math.min((idx % 3) * 100 + 100, 300)}`}
                  >
                    <div className="product-img-wrapper">
                      {itemCover ? (
                        <img
                          src={itemCover}
                          alt={item.name}
                          className="product-img"
                          loading="lazy"
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F1F5F9', color: '#94A3B8', fontSize: '0.75rem' }}>
                          Foto Busana
                        </div>
                      )}
                    </div>

                    <div className="product-content">
                      <span className="product-category-text">{normalizeProductCategory(item.category, item.categoryLabel).categoryLabel}</span>
                      <h3 className="product-name">{item.name}</h3>

                      <div className="product-clean-origin">
                        <School size={15} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                        <span>{clientsList.find((c) => String(c.id) === String(item.clientId))?.name || item.client || item.clientOrigin || 'Azhar Collection'}</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
