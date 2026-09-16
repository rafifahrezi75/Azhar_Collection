import { useState, useEffect } from 'react'
import PageHeader from '../components/PageHeader'
import { getGalleryList } from '../firebase/adminService'
import { Loader2, Image as ImageIcon } from 'lucide-react'

export default function GalleryPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    getGalleryList()
      .then((data) => {
        if (isMounted && data) {
          setItems(data)
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="gallery-page">
      <PageHeader
        title="Galeri Foto Dokumentasi"
        subtitle="Dokumentasi Proses Produksi, Hasil Penjahitan Busana Kustom, dan Aktivitas Workshop Azhar Collection di Buduran, Sidoarjo"
        breadcrumb="Galeri"
      />

      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div className="reveal-up" style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 2.5rem auto' }}>
            <span className="section-tag">DOKUMENTASI FOTO</span>
            <h2 className="section-title">Foto Aktivitas & Pengerjaan</h2>
            <p className="section-subtitle">
              Kumpulan dokumentasi foto proses jahit, bordir komputer, dan hasil produksi busana seragam Azhar Collection.
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
              <Loader2 size={36} className="spin-animation" style={{ color: 'var(--color-primary)', margin: '0 auto 1rem auto' }} />
              <p style={{ color: 'var(--color-text-muted)' }}>Memuat galeri dokumentasi...</p>
            </div>
          ) : items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <ImageIcon size={48} style={{ color: 'var(--color-text-muted)', margin: '0 auto 1rem auto', opacity: 0.5 }} />
              <p style={{ color: 'var(--color-text-muted)' }}>Belum ada foto dokumentasi di galeri.</p>
            </div>
          ) : (
            <div className="gallery-page-grid">
              {items.map((item, idx) => (
                <div key={item.id} className={`gallery-card reveal-up delay-${Math.min((idx % 4) * 100 + 100, 400)}`}>
                  <div className="gallery-card-img-wrap" style={{ height: '220px' }}>
                    <img
                      src={item.image}
                      alt={item.title || (item.date ? `Foto dokumentasi ${item.date}` : 'Foto galeri')}
                      className="gallery-card-img"
                      loading="lazy"
                    />
                    {item.date && (
                      <span className="gallery-card-date-badge">{item.date}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
