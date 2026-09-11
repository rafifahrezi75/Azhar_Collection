import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { newsData as fallbackNews } from '../data/siteData'
import { getBeritaList } from '../firebase/adminService'
import { Calendar, Clock, User, ArrowLeft, Loader2 } from 'lucide-react'

export default function NewsDetailPage() {
  const { slug } = useParams()
  const [news, setNews] = useState(fallbackNews)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    getBeritaList()
      .then((list) => {
        if (isMounted && list && list.length > 0) {
          setNews(list)
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const article = news.find((n) => n.slug === slug || String(n.id) === String(slug))

  if (loading) {
    return (
      <div className="news-detail-page">
        <PageHeader
          title="Memuat Berita..."
          subtitle="Mengambil artikel berita terbaru."
          breadcrumb="Detail Berita"
        />
        <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
          <Loader2 size={36} className="spin-animation" style={{ margin: '0 auto 1rem auto', color: 'var(--color-primary)' }} />
          <p style={{ color: 'var(--color-text-muted)' }}>Sedang memuat artikel...</p>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="news-detail-page">
        <PageHeader
          title="Artikel Tidak Ditemukan"
          subtitle="Halaman artikel yang Anda tuju tidak tersedia atau tautan salah."
          breadcrumb="Detail Berita"
        />
        <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            Silakan kembali ke daftar berita untuk melihat artikel dan kabar lainnya.
          </p>
          <Link to="/berita" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={16} />
            <span>Kembali ke Berita</span>
          </Link>
        </div>
      </div>
    )
  }

  const otherArticles = news.filter((n) => String(n.id) !== String(article.id)).slice(0, 3)

  return (
    <div className="news-detail-page">
      <PageHeader
        title={article.title}
        subtitle={`${article.category} | Ditulis oleh ${article.author}`}
        breadcrumb="Detail Berita"
      />

      <section style={{ padding: '3.5rem 0' }}>
        <div className="container">
          <div className="article-layout-grid">
            <article className="article-main-card">
              <div className="article-meta-header">
                <span className="news-category-badge">{article.category}</span>
                <span className="news-meta-item">
                  <Calendar size={14} />
                  {article.date}
                </span>
                <span className="news-meta-item">
                  <Clock size={14} />
                  {article.readTime}
                </span>
                <span className="news-meta-item">
                  <User size={14} />
                  {article.author}
                </span>
              </div>

              <h1 className="article-main-title">{article.title}</h1>

              <div className="article-hero-img-wrapper">
                <img
                  src={article.image}
                  alt={article.title}
                  className="article-hero-img"
                />
              </div>

              <div className="article-body-text">
                {article.excerpt && <p className="article-lead-text">{article.excerpt}</p>}

                {typeof article.content === 'string' && article.content.includes('<') ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: article.content }}
                    style={{ lineHeight: 1.8 }}
                  />
                ) : Array.isArray(article.content) ? (
                  article.content.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))
                ) : (
                  <p style={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>{article.content}</p>
                )}
              </div>
            </article>

            <aside className="article-sidebar">
              <div className="sidebar-card">
                <h3 className="sidebar-title">Artikel Lainnya</h3>
                <div className="sidebar-news-list">
                  {otherArticles.map((item) => (
                    <Link key={item.id} to={`/berita/${item.slug || item.id}`} className="sidebar-news-item">
                      <img src={item.image} alt={item.title} className="sidebar-news-thumb" />
                      <div>
                        <span className="sidebar-news-cat">{item.category}</span>
                        <h4 className="sidebar-news-title">{item.title}</h4>
                        <span className="sidebar-news-date">{item.date}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
