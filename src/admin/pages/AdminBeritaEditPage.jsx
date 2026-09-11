import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, AlertCircle, Loader2 } from 'lucide-react'
import AdminImageUploader from '../components/AdminImageUploader'
import AdminRichEditor from '../components/AdminRichEditor'
import { uploadToCloudinary } from '../../firebase/cloudinaryService'
import { getBeritaById, saveBeritaItem } from '../../firebase/adminService'
import { showSuccessAlert, showErrorAlert } from '../utils/swal'

export default function AdminBeritaEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [imageFile, setImageFile] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Panduan Bahan',
    author: 'Tim Produksi Azhar Collection',
    date: '',
    readTime: '4 Menit Baca',
    excerpt: '',
    content: '',
    image: ''
  })

  const categoryOptions = [
    'Panduan Bahan',
    'Manajemen Sekolah',
    'Teknologi Produksi',
    'Edukasi Busana',
    'Kabar Perusahaan',
    'Tips & Trik'
  ]

  useEffect(() => {
    let isMounted = true
    getBeritaById(id)
      .then((data) => {
        if (!isMounted) return
        if (data) {
          setFormData({
            id: data.id,
            title: data.title || '',
            slug: data.slug || '',
            category: data.category || 'Panduan Bahan',
            author: data.author || 'Tim Produksi Azhar Collection',
            date: data.date || '',
            readTime: data.readTime || '4 Menit Baca',
            excerpt: data.excerpt || '',
            content: typeof data.content === 'string'
              ? data.content
              : Array.isArray(data.content)
              ? data.content.map((p) => `<p>${p}</p>`).join('')
              : '',
            image: data.image || ''
          })
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

    return () => { isMounted = false }
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      setError('Judul artikel wajib diisi')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      let finalImageUrl = formData.image
      if (imageFile) {
        finalImageUrl = await uploadToCloudinary(imageFile, 'azhar_news')
      }

      await saveBeritaItem({ ...formData, image: finalImageUrl })
      await showSuccessAlert('Perubahan Tersimpan', 'Artikel berita berhasil diperbarui.')
      navigate('/admin/berita')
    } catch (err) {
      setError(err?.message || 'Gagal menyimpan perubahan')
      await showErrorAlert('Gagal Menyimpan', err?.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <Loader2 size={36} className="spin-animation" style={{ color: 'var(--admin-primary)', margin: '0 auto 1rem auto' }} />
        <p style={{ color: 'var(--admin-text-muted)', fontWeight: 600 }}>Memuat data artikel berita...</p>
      </div>
    )
  }

  return (
    <form id="news-edit-form" onSubmit={handleSubmit}>
      <div className="admin-card">
        <div className="admin-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/admin/berita" className="admin-back-btn" title="Kembali" aria-label="Kembali">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="admin-page-title" style={{ margin: 0 }}>Ubah Artikel Berita</h1>
              <p className="admin-page-desc" style={{ margin: '0.25rem 0 0 0' }}>
                Perbarui konten, banner gambar, atau kategori artikel berita.
              </p>
            </div>
          </div>

          <div className="admin-inline-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="submit"
              disabled={submitting}
              className="admin-action-icon-btn admin-action-icon-btn-primary"
              title={submitting ? 'Memperbarui...' : 'Simpan Perubahan'}
              aria-label="Simpan Perubahan"
            >
              {submitting ? <Loader2 size={16} className="spin-animation" /> : <Save size={16} />}
            </button>
          </div>
        </div>

        <div style={{ padding: '1.25rem' }}>
          {error && (
            <div className="admin-alert admin-alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="admin-single-card-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="news-title">
                  Judul Artikel <span style={{ color: 'var(--admin-danger)' }}>*</span>
                </label>
                <input
                  id="news-title"
                  type="text"
                  className="admin-input"
                  placeholder="Contoh: Panduan Memilih Bahan Seragam Sekolah: Famatex vs Oxford vs Drill"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label" htmlFor="news-slug">Tautan URL (Slug)</label>
                <input
                  id="news-slug"
                  type="text"
                  className="admin-input"
                  placeholder="panduan-memilih-bahan-seragam-sekolah"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="news-category">Kategori Tulisan</label>
                  <select
                    id="news-category"
                    className="admin-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categoryOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="news-author">Penulis / Kontributor</label>
                  <input
                    id="news-author"
                    type="text"
                    className="admin-input"
                    placeholder="Contoh: Ach. Haris (Marketing Tender)"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="news-date">Tanggal Rilis Publik</label>
                  <input
                    id="news-date"
                    type="text"
                    className="admin-input"
                    placeholder="Contoh: 18 Mei 2024"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="news-read-time">Estimasi Waktu Baca</label>
                  <input
                    id="news-read-time"
                    type="text"
                    className="admin-input"
                    placeholder="Contoh: 4 Menit Baca"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label" htmlFor="news-excerpt">Ringkasan / Excerpt Singkat</label>
                <textarea
                  id="news-excerpt"
                  className="admin-input"
                  rows={3}
                  placeholder="Ringkasan 1-2 kalimat pengantar yang muncul pada kartu artikel..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <AdminRichEditor
                  id="news-content-editor"
                  label="Isi Lengkap Artikel"
                  value={formData.content}
                  onChange={(html) => setFormData((prev) => ({ ...prev, content: html }))}
                  placeholder="Tuliskan isi pembahasan artikel, poin-poin tips bahan seragam, atau dokumentasi kegiatan konveksi..."
                  height={340}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ padding: '1rem', border: '1px solid var(--admin-border)', borderRadius: '6px', backgroundColor: 'var(--admin-surface-hover)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.8125rem', marginBottom: '0.75rem', color: 'var(--admin-text-main)' }}>
                  Banner Gambar Artikel
                </div>
                <AdminImageUploader
                  label="Foto Utama Artikel"
                  ratioHint="Rasio 16:9 (Landscape, misal 1200 x 675 px)"
                  currentImage={formData.image}
                  onFileSelected={(file) => setImageFile(file)}
                  onUrlChanged={(url) => setFormData({ ...formData, image: url })}
                  folder="azhar/news"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
