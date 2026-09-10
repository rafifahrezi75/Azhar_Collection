import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { School, ArrowRight } from 'lucide-react'
import { getKatalogList } from '../firebase/adminService'
import { portfolioProducts as fallbackProducts } from '../data/siteData'

export default function ProductCatalogSection({ limit, showHeader = false, showViewAll = false }) {
  const [items, setItems] = useState(fallbackProducts)

  useEffect(() => {
    let isMounted = true
    getKatalogList().then((list) => {
      if (isMounted && list) setItems(list)
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
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem auto' }}>
            <span className="section-tag">KATALOG PRODUKSI</span>
            <h2 className="section-title">Katalog Baju Yang Pernah Dikerjakan</h2>
            <p className="section-subtitle">
              Pilihan model busana kustom, seragam sekolah, pakaian dinas lembaga, dan almamater hasil karya konveksi Azhar Collection.
            </p>
          </div>
        )}

        {displayedItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: 'var(--color-bg-light)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--color-border)' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: 0 }}>
              Belum ada data produk katalog yang ditampilkan. Silakan tambahkan produk baru melalui Admin Panel.
            </p>
          </div>
        ) : (
          <div className="products-grid">
            {displayedItems.map((product) => (
              <Link
                key={product.id}
                to={`/katalog/${product.id}`}
                className="product-card product-card-clean"
              >
                <div className="product-img-wrapper">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
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
                    <span>{product.clientOrigin || product.client || 'Azhar Collection'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {showViewAll && displayedItems.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/katalog" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem', padding: '0.875rem 2.25rem' }}>
              <span>Lihat Semua Katalog Lebih Lengkap</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

