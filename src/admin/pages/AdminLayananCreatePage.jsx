import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Scissors, Sparkles, AlertCircle, Loader2 } from 'lucide-react'
import AdminImageUploader from '../components/AdminImageUploader'
import AdminRichEditor from '../components/AdminRichEditor'
import { uploadToCloudinary } from '../../firebase/cloudinaryService'
import { saveLayananItem } from '../../firebase/adminService'

export default function AdminLayananCreatePage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [imageFile, setImageFile] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    shortDesc: '',
    fullDesc: '',
    materials: '',
    moq: '24 Pcs / Desain',
    leadTime: '7 - 14 Hari Kerja',
    image: '',
    icon: 'Shirt'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      setError('Judul layanan wajib diisi')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      let finalImageUrl = formData.image
      if (imageFile) {
        finalImageUrl = await uploadToCloudinary(imageFile)
      }

      await saveLayananItem({
        ...formData,
        image: finalImageUrl
      })

      navigate('/admin/layanan')
    } catch (err) {
      setError(err?.message || 'Gagal menyimpan layanan baru')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-form-page">
      <div className="admin-form-header">
        <div className="admin-form-header-left">
          <Link to="/admin/layanan" className="admin-back-btn" title="Kembali" aria-label="Kembali">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h1 className="admin-page-title" style={{ margin: 0 }}>Tambah Layanan Konveksi Baru</h1>
              <div className="admin-inline-actions">
                <button
                  type="submit"
                  form="layanan-create-form"
                  disabled={submitting}
                  className="admin-action-icon-btn admin-action-icon-btn-primary"
                  title="Simpan Layanan"
                  aria-label="Simpan Layanan"
                >
                  {submitting ? <Loader2 size={16} className="admin-spin" /> : <Save size={16} />}
                </button>
              </div>
            </div>
            <p className="admin-page-desc" style={{ margin: '0.25rem 0 0 0' }}>
              Publikasikan lini pengerjaan jahit, bordir komputer, atau seragam kustom.
            </p>
          </div>
        </div>

        <div className="admin-breadcrumbs">
          <Link to="/admin">Admin</Link>
          <span>/</span>
          <Link to="/admin/layanan">Layanan</Link>
          <span>/</span>
          <span className="current">Tambah</span>
        </div>
      </div>

      {error && (
        <div className="admin-alert admin-alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <form id="layanan-create-form" onSubmit={handleSubmit}>
        <div className="admin-form-grid">
          <div className="admin-form-card">
            <h2 className="admin-form-card-title">
              <Scissors size={18} style={{ color: 'var(--admin-primary)' }} />
              <span>Detail Layanan Konveksi</span>
            </h2>

            <div className="admin-form-group">
              <label className="admin-label" htmlFor="service-title">
                Nama Layanan <span style={{ color: 'var(--admin-danger)' }}>*</span>
              </label>
              <input
                id="service-title"
                type="text"
                className="admin-input"
                placeholder="Contoh: Konveksi Seragam Sekolah SD, SMP & SMA"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label" htmlFor="service-short-desc">Deskripsi Singkat</label>
              <input
                id="service-short-desc"
                type="text"
                className="admin-input"
                placeholder="Ringkasan 1-2 kalimat untuk kartu depan"
                value={formData.shortDesc}
                onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="service-moq">Minimum Order (MOQ)</label>
                <input
                  id="service-moq"
                  type="text"
                  className="admin-input"
                  placeholder="Contoh: 24 Pcs / Desain"
                  value={formData.moq}
                  onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label" htmlFor="service-lead-time">Estimasi Pengerjaan</label>
                <input
                  id="service-lead-time"
                  type="text"
                  className="admin-input"
                  placeholder="Contoh: 7 - 14 Hari Kerja"
                  value={formData.leadTime}
                  onChange={(e) => setFormData({ ...formData, leadTime: e.target.value })}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label" htmlFor="service-materials">Pilihan Bahan Kain yang Tersedia</label>
              <input
                id="service-materials"
                type="text"
                className="admin-input"
                placeholder="Contoh: Nagata Drill, Japan Drill, Famatex, Katun Oxford, Katun Prima"
                value={formData.materials}
                onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <AdminRichEditor
                id="service-full-desc-editor"
                label="Deskripsi Lengkap & Alur Pengerjaan (TinyMCE)"
                value={formData.fullDesc}
                onChange={(html) => setFormData((prev) => ({ ...prev, fullDesc: html }))}
                placeholder="Tuliskan secara lengkap alur pemesanan, kelebihan jahitan jarum dua, pilihan kain, dan garansi kualitas produksi..."
                height={260}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="admin-form-card">
              <h2 className="admin-form-card-title">
                <span>Foto Sampel Layanan</span>
              </h2>

              <AdminImageUploader
                label="Unggah Foto Layanan"
                currentImage={formData.image}
                onFileSelected={(file) => setImageFile(file)}
                onUrlChanged={(url) => setFormData({ ...formData, image: url })}
                folder="azhar/services"
              />
            </div>

            <div className="admin-form-card">
              <h2 className="admin-form-card-title">
                <Sparkles size={16} style={{ color: 'var(--admin-warning)' }} />
                <span>Publikasi</span>
              </h2>

              <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-muted)', margin: 0 }}>
                Layanan ini akan langsung ditampilkan di website setelah disimpan melalui tombol simpan di atas.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
