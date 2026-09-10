import { useParams, Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { newsData } from '../data/siteData'
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react'

export default function NewsDetailPage() {
  const { slug } = useParams()
  const article = newsData.find((n) => n.slug === slug)

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

  const otherArticles = newsData.filter((n) => n.id !== article.id).slice(0, 3)

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
                <p className="article-lead-text">{article.excerpt}</p>

                {article.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </article>

            <aside className="article-sidebar">
              <div className="sidebar-card">
                <h3 className="sidebar-title">Artikel Lainnya</h3>
                <div className="sidebar-news-list">
                  {otherArticles.map((item) => (
                    <Link key={item.id} to={`/berita/${item.slug}`} className="sidebar-news-item">
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
