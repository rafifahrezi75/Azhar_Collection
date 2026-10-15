import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { School, ArrowRight } from 'lucide-react'
import { getKatalogList, getKlienList, normalizeProductImages, createSlug } from '../firebase/adminService'
import { portfolioProducts as fallbackProducts, clientsData as fallbackClients } from '../data/siteData'
import { ProductCatalogSkeleton } from './SkeletonLoader'

export default function ProductCatalogSection({ limit, showHeader = false, showViewAll = false }) {
  const [items, setItems] = useState(fallbackProducts)
  const [clientsList, setClientsList] = useState(fallbackClients)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    Promise.all([getKatalogList(), getKlienList()])
      .then(([prods, clis]) => {
        if (isMounted) {
          if (prods && prods.length > 0) setItems(prods)
          if (clis && clis.length > 0) setClientsList(clis)
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [])

  const displayedItems = limit ? items.slice(0, limit) : items

  return (
    <section id="products" className="catalog-section" style={{ padding: showHeader ? '4.5rem 0' : '2rem 0 4rem 0' }}>
      <div className="container">
        {showHeader && (
          <div className="reveal-up" style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem auto' }}>
            <span className="section-tag">KATALOG PRODUKSI</span>
            <h2 className="section-title">Contoh Busana & Seragam yang Pernah Dikerjakan</h2>
            <p className="section-subtitle">
              Dokumentasi seragam sekolah, pakaian dinas, dan busana pesanan dari berbagai sekolah serta lembaga pemesan.
            </p>
          </div>
        )}

        {loading ? (
          <ProductCatalogSkeleton count={limit || 8} />
        ) : displayedItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: 'var(--color-bg-light)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--color-border)' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: 0 }}>
              Belum ada data produk katalog yang ditampilkan. Silakan tambahkan produk baru melalui Admin Panel.
            </p>
          </div>
        ) : (
          <div className="products-grid">
            {displayedItems.map((product, idx) => {
              const productImages = normalizeProductImages(product)
              const coverImg = productImages[0]?.url || product.image
              const itemSlug = product.slug || createSlug(product.name) || product.id
              const clientMatch = clientsList.find((c) => String(c.id) === String(product.clientId))
              const originName = clientMatch ? clientMatch.name : (product.client || product.clientOrigin || 'Azhar Collection')

              return (
                <Link
                  key={product.id}
                  to={`/katalog/${itemSlug}`}
                  className={`product-card product-card-clean reveal-up delay-${Math.min((idx % 4) * 100 + 100, 400)}`}
                >
                  <div className="product-img-wrapper">
                    {coverImg ? (
                      <img
                        src={coverImg}
                        alt={`${product.name} - Konveksi Pakaian Azhar Collection`}
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
                    <span className="product-category-text">{product.categoryLabel || product.category}</span>
                    <h3 className="product-name">{product.name}</h3>

                    <div className="product-clean-origin">
                      <School size={15} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                      <span>{originName}</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {showViewAll && displayedItems.length > 0 && (
          <div className="reveal-up delay-200" style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/katalog" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem', padding: '0.875rem 2.25rem' }}>
              <span>Lihat Seluruh Katalog Busana</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

