import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Edit2,
  ExternalLink,
  Newspaper,
  Tag,
  Calendar,
  Clock,
  User,
  AlertCircle,
  Loader2,
  FileText
} from 'lucide-react'
import { getBeritaById } from '../../firebase/adminService'

export default function AdminBeritaDetailPage() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    getBeritaById(id)
      .then((data) => {
        if (!isMounted) return
        if (data) {
          setArticle(data)
        } else {
          setError('Data artikel berita tidak ditemukan')
        }
      })
      .catch((err) => {
        if (isMounted) setError(err?.message || 'Gagal memuat artikel')
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
        <p style={{ color: 'var(--admin-text-muted)', fontWeight: 600 }}>Memuat detail artikel...</p>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="admin-form-page">
        <Link to="/admin/berita" className="admin-back-btn" title="Kembali" aria-label="Kembali">
          <ArrowLeft size={18} />
        </Link>
        <div className="admin-alert admin-alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={16} />
          <span>{error || 'Artikel tidak ditemukan'}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-detail-page">
      <div className="admin-card">
        <div className="admin-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/admin/berita" className="admin-back-btn" title="Kembali" aria-label="Kembali">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
                <h1 className="admin-page-title" style={{ margin: 0 }}>{article.title}</h1>
                <span className="admin-badge admin-badge-primary">{article.category || 'Berita'}</span>
              </div>
              <p className="admin-page-desc" style={{ margin: '0.25rem 0 0 0' }}>
                Detail publikasi artikel, cuplikan ringkasan, dan konten edukasi busana.
              </p>
            </div>
          </div>

          <div className="admin-inline-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Link
              to={`/admin/berita/edit/${article.id}`}
              className="admin-action-icon-btn admin-action-icon-btn-primary"
              title="Ubah Artikel"
              aria-label="Ubah Artikel"
            >
              <Edit2 size={16} />
            </Link>
            <a
              href={`/berita/${article.slug || article.id}`}
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
            <div className="admin-katalog-media-frame" style={{ aspectRatio: '16 / 9' }}>
              {article.image ? (
                <img
                  src={article.image}
                  alt={article.title}
                />
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--admin-text-subtle)', padding: '2rem 1rem' }}>
                  <Newspaper size={48} style={{ margin: '0 auto 0.5rem auto', opacity: 0.4 }} />
                  <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600 }}>Foto Belum Diunggah</p>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="admin-katalog-meta-cards">
              <div className="admin-katalog-meta-card">
                <div className="admin-katalog-meta-header">
                  <Tag size={13} />
                  <span>Kategori</span>
                </div>
                <div className="admin-katalog-meta-body">
                  {article.category || '-'}
                </div>
              </div>

              <div className="admin-katalog-meta-card">
                <div className="admin-katalog-meta-header">
                  <User size={13} />
                  <span>Penulis</span>
                </div>
                <div className="admin-katalog-meta-body">
                  {article.author || '-'}
                </div>
              </div>

              <div className="admin-katalog-meta-card">
                <div className="admin-katalog-meta-header">
                  <Calendar size={13} />
                  <span>Tanggal Rilis</span>
                </div>
                <div className="admin-katalog-meta-body">
                  {article.date || '-'}
                </div>
              </div>

              <div className="admin-katalog-meta-card">
                <div className="admin-katalog-meta-header">
                  <Clock size={13} />
                  <span>Waktu Baca</span>
                </div>
                <div className="admin-katalog-meta-body">
                  {article.readTime || '-'}
                </div>
              </div>
            </div>

            {article.excerpt && (
              <div className="admin-katalog-spec-box">
                <div className="admin-katalog-spec-header">
                  <FileText size={15} />
                  <span>Ringkasan / Excerpt</span>
                </div>
                <div className="admin-katalog-spec-content">
                  <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--admin-text-main)' }}>
                    {article.excerpt}
                  </p>
                </div>
              </div>
            )}

            <div className="admin-katalog-spec-box">
              <div className="admin-katalog-spec-header">
                <FileText size={15} />
                <span>Isi Lengkap Artikel</span>
              </div>
              <div className="admin-katalog-spec-content">
                {typeof article.content === 'string' && article.content.includes('<') ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: article.content }}
                    style={{ lineHeight: 1.7 }}
                  />
                ) : Array.isArray(article.content) ? (
                  article.content.map((p, idx) => (
                    <p key={idx} style={{ margin: '0 0 0.75rem 0', lineHeight: 1.7 }}>
                      {p}
                    </p>
                  ))
                ) : (
                  <p style={{ margin: 0, lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                    {article.content || '-'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
