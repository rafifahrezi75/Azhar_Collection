import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { newsData as fallbackNews } from '../data/siteData'
import { getBeritaList } from '../firebase/adminService'
import { Calendar, Clock, ArrowRight, User } from 'lucide-react'

export default function NewsPage() {
  const [news, setNews] = useState(fallbackNews)

  useEffect(() => {
    let isMounted = true
    getBeritaList().then((list) => {
      if (isMounted && list && list.length > 0) {
        setNews(list)
      }
    })
    return () => {
      isMounted = false
    }
  }, [])
  return (
    <div className="news-page">
      <PageHeader
        title="Kabar Terkini & Artikel"
        subtitle="Edukasi Pemilihan Bahan Seragam, Panduan Koperasi Sekolah, dan Perkembangan Produksi Azhar Collection"
        breadcrumb="Berita"
      />

      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem auto' }}>
            <span className="section-tag">INFORMASI & ARTIKEL</span>
            <h2 className="section-title">Wawasan Seputar Busana & Konveksi</h2>
            <p className="section-subtitle">
              Kumpulan artikel informatif untuk membantu pengurus sekolah, bagian pengadaan instansi, dan panitia event dalam menentukan bahan pakaian terbaik.
            </p>
          </div>

          <div className="news-grid">
            {news.map((item) => (
              <article key={item.id} className="news-card">
                <Link to={`/berita/${item.slug || item.id}`} className="news-card-img-wrapper">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="news-card-img"
                    loading="lazy"
                  />
                </Link>

                <div className="news-card-content">
                  <div className="news-card-meta">
                    <span className="news-meta-item">
                      <Calendar size={13} />
                      {item.date}
                    </span>
                    <span className="news-meta-item">
                      <Clock size={13} />
                      {item.readTime}
                    </span>
                  </div>

                  <h3 className="news-card-title">
                    <Link to={`/berita/${item.slug || item.id}`}>{item.title}</Link>
                  </h3>

                  <p className="news-card-excerpt">{item.excerpt}</p>

                  <div className="news-card-footer">
                    <div className="news-author-info">
                      <User size={13} style={{ color: 'var(--color-accent)' }} />
                      <span>{item.author}</span>
                    </div>

                    <Link to={`/berita/${item.slug || item.id}`} className="btn-read-more">
                      <span>Baca</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
