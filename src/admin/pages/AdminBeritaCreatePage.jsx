import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Sparkles, AlertCircle, Loader2 } from 'lucide-react'
import AdminImageUploader from '../components/AdminImageUploader'
import AdminRichEditor from '../components/AdminRichEditor'
import { uploadToCloudinary } from '../../firebase/cloudinaryService'
import { saveBeritaItem } from '../../firebase/adminService'
import { showSuccessAlert, showErrorAlert } from '../utils/swal'

export default function AdminBeritaCreatePage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [imageFile, setImageFile] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Panduan Bahan',
    author: 'Tim Produksi Azhar Collection',
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
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

  const handleTitleChange = (val) => {
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    setFormData((prev) => ({ ...prev, title: val, slug: generatedSlug }))
  }

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
      await showSuccessAlert('Artikel Berhasil Disimpan', 'Tulisan baru telah dipublikasikan dan tersimpan dalam sistem.')
      navigate('/admin/berita')
    } catch (err) {
      setError(err?.message || 'Gagal menyimpan artikel')
      await showErrorAlert('Gagal Menyimpan', err?.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form id="news-create-form" onSubmit={handleSubmit}>
      <div className="admin-card">
        <div className="admin-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/admin/berita" className="admin-back-btn" title="Kembali" aria-label="Kembali">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="admin-page-title" style={{ margin: 0 }}>Tulis Artikel Berita Baru</h1>
              <p className="admin-page-desc" style={{ margin: '0.25rem 0 0 0' }}>
                Publikasikan wawasan baru, tips bahan, atau kabar produksi untuk pembaca.
              </p>
            </div>
          </div>

          <div className="admin-inline-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="submit"
              disabled={submitting}
              className="admin-action-icon-btn admin-action-icon-btn-primary"
              title={submitting ? 'Menyimpan...' : 'Simpan Artikel'}
              aria-label="Simpan Artikel"
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
                  onChange={(e) => handleTitleChange(e.target.value)}
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

              <div style={{ padding: '1rem', border: '1px solid var(--admin-border)', borderRadius: '6px', backgroundColor: 'var(--admin-surface-hover)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.8125rem', marginBottom: '0.5rem', color: 'var(--admin-text-main)' }}>
                  <Sparkles size={15} style={{ color: 'var(--admin-warning)' }} />
                  <span>Publikasi</span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-muted)', margin: 0, lineHeight: 1.5 }}>
                  Pastikan judul, ringkasan, dan isi artikel sudah sesuai sebelum menyimpan ke sistem melalui tombol simpan di atas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
