import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { getKatalogList, getKlienList } from '../firebase/adminService'
import { portfolioProducts as fallbackProducts, clientsData as fallbackClients } from '../data/siteData'
import {
  ArrowLeft,
  School,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar
} from 'lucide-react'

export default function ProductDetailPage() {
  const { productId } = useParams()
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [productsList, setProductsList] = useState(fallbackProducts)
  const [clientsList, setClientsList] = useState(fallbackClients)
  const [isLoading, setIsLoading] = useState(true)

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

  const product = allProducts.find(
    (p) => p.id === productId || p.id?.toLowerCase() === productId?.toLowerCase()
  )

  const client = product
    ? clientsList.find((c) => c.id === product.clientId) || {
        name: product.clientOrigin || product.client || 'Mitra Instansi',
        image: product.image,
        city: 'Sidoarjo, Jawa Timur',
        since: '2021'
      }
    : null

  const galleryImages = product
    ? [
        product.image,
        ...(client?.orderedProducts?.filter((op) => op.image && op.image !== product.image).map((op) => op.image) || [])
      ].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i)
    : []

  useEffect(() => {
    if (galleryImages.length <= 1) return
    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % galleryImages.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [galleryImages.length])

  if (isLoading) {
    return (
      <div className="product-detail-page">
        <PageHeader
          title="Memuat Detail Produk..."
          subtitle="Mengambil spesifikasi produk dari sistem Azhar Collection"
          breadcrumb="Detail Produk"
        />
        <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>Sedang memuat data...</p>
        </div>
      </div>
    )
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
    .filter((p) => p.id !== product.id)
    .slice(0, 3)

  return (
    <div className="product-detail-page">
      <PageHeader
        title={product.name}
        subtitle="Spesifikasi Bahan Kain, Detail Pengerjaan, dan Riwayat Klien Pemesan"
        breadcrumb={product.name}
      />

      <section style={{ padding: '3rem 0 5rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1.3fr)', gap: '3rem', alignItems: 'start', background: '#FFFFFF', padding: '2.5rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', marginBottom: '4rem' }}>
            <div>
              <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)', height: '420px', background: 'var(--color-bg-light)' }}>
                <img
                  src={galleryImages[activeImageIndex]}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.3s ease' }}
                />

                {galleryImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
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
                        cursor: 'pointer'
                      }}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveImageIndex((prev) => (prev + 1) % galleryImages.length)}
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
                        cursor: 'pointer'
                      }}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${galleryImages.length}, 1fr)`, gap: '0.75rem', marginTop: '0.875rem' }}>
                {galleryImages.map((imgSrc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    style={{
                      height: '76px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: activeImageIndex === idx ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      padding: 0,
                      cursor: 'pointer',
                      opacity: activeImageIndex === idx ? 1 : 0.65,
                      boxShadow: activeImageIndex === idx ? 'var(--shadow-sm)' : 'none',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <img
                      src={imgSrc}
                      alt={`Foto detail ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <span className="section-tag" style={{ margin: 0 }}>{product.categoryLabel}</span>
              </div>

              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: '0 0 1.25rem 0', lineHeight: 1.3 }}>
                {product.name}
              </h1>

              {client && (
                <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: 'var(--radius-lg)', marginBottom: '1.75rem', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-xs)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img
                      src={client.image}
                      alt={client.name}
                      style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-md)', objectFit: 'cover', border: '1px solid var(--color-border)', flexShrink: 0 }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: 0 }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: 0, lineHeight: 1.3 }}>
                        {client.name}
                      </h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <MapPin size={14} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                          <span>{client.city}</span>
                        </div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Calendar size={14} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                          <span>Mitra Sejak {client.since}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: 0 }}>
                  Deskripsi & Spesifikasi Produk
                </h3>
                {product.specs?.includes('<') ? (
                  <div
                    className="rich-content-view"
                    dangerouslySetInnerHTML={{ __html: product.specs }}
                  />
                ) : (
                  <>
                    <p style={{ fontSize: '0.9375rem', lineHeight: 1.8, color: 'var(--color-text-main)', margin: 0 }}>
                      {product.customDetails}
                    </p>
                    <div style={{ background: 'var(--color-bg-light)', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                      <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--color-text-muted)', margin: 0 }}>
                        <strong style={{ color: 'var(--color-primary-dark)' }}>Spesifikasi Bahan:</strong> {product.specs}. Jahitan rapi standar garmen konveksi profesional dengan penguatan di titik-titik krusial serta opsi bordir komputer atau sablon sesuai identitas lembaga.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
              <div>
                <span className="section-tag">PORTOFOLIO LAINNYA</span>
                <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: 0 }}>
                  Model Baju Terkait Yang Pernah Dikerjakan
                </h3>
              </div>
              <Link to="/katalog" className="btn-outline" style={{ fontSize: '0.8125rem', padding: '0.5rem 1rem' }}>
                Lihat Semua Katalog
              </Link>
            </div>

            <div className="products-grid">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  to={`/katalog/${item.id}`}
                  className="product-card product-card-clean"
                >
                  <div className="product-img-wrapper">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="product-img"
                      loading="lazy"
                    />
                  </div>

                  <div className="product-content">
                    <span className="product-category-text">{item.categoryLabel}</span>
                    <h3 className="product-name">{item.name}</h3>

                    <div className="product-clean-origin">
                      <School size={15} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                      <span>{item.clientOrigin}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
