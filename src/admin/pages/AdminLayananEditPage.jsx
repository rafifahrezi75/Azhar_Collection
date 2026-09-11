import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, AlertCircle, Loader2 } from 'lucide-react'
import AdminImageUploader from '../components/AdminImageUploader'
import AdminRichEditor from '../components/AdminRichEditor'
import { uploadToCloudinary } from '../../firebase/cloudinaryService'
import { getLayananById, saveLayananItem } from '../../firebase/adminService'
import { showSuccessAlert, showErrorAlert } from '../utils/swal'

export default function AdminLayananEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    let isMounted = true
    getLayananById(id)
      .then((data) => {
        if (!isMounted) return
        if (data) {
          setFormData({
            id: data.id,
            title: data.title || '',
            shortDesc: data.shortDesc || data.desc || '',
            fullDesc: data.fullDesc || data.detailedDesc || data.desc || '',
            materials: Array.isArray(data.materials) ? data.materials.join(', ') : data.materials || '',
            moq: data.moq || '24 Pcs / Desain',
            leadTime: data.leadTime || '7 - 14 Hari Kerja',
            image: data.image || '',
            icon: data.icon || 'Shirt'
          })
        } else {
          setError('Data layanan tidak ditemukan')
        }
      })
      .catch((err) => {
        if (isMounted) setError(err?.message || 'Gagal memuat data layanan')
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [id])

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
        id,
        image: finalImageUrl
      })

      await showSuccessAlert('Berhasil Diperbarui', 'Perubahan layanan konveksi berhasil disimpan.')
      navigate('/admin/layanan')
    } catch (err) {
      setError(err?.message || 'Gagal memperbarui layanan')
      showErrorAlert('Gagal Menyimpan', err?.message || 'Gagal memperbarui layanan')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <Loader2 size={36} className="spin-animation" style={{ color: 'var(--admin-primary)', margin: '0 auto 1rem auto' }} />
        <p style={{ color: 'var(--admin-text-muted)', fontWeight: 600 }}>Memuat data layanan konveksi...</p>
      </div>
    )
  }

  return (
    <form id="layanan-edit-form" onSubmit={handleSubmit}>
      <div className="admin-card">
        <div className="admin-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/admin/layanan" className="admin-back-btn" title="Kembali" aria-label="Kembali">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="admin-page-title" style={{ margin: 0 }}>Ubah Layanan Konveksi</h1>
              <p className="admin-page-desc" style={{ margin: '0.25rem 0 0 0' }}>
                Perbarui judul, bahan kain, estimasi pengerjaan, dan deskripsi lengkap layanan.
              </p>
            </div>
          </div>

          <div className="admin-inline-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="submit"
              disabled={submitting}
              className="admin-action-icon-btn admin-action-icon-btn-primary"
              title="Simpan Perubahan"
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
                  <label className="admin-label" htmlFor="service-title">
                    Nama Layanan <span style={{ color: 'var(--admin-danger)' }}>*</span>
                  </label>
                  <input
                    id="service-title"
                    type="text"
                    className="admin-input"
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ padding: '1rem', border: '1px solid var(--admin-border)', borderRadius: '6px', backgroundColor: 'var(--admin-surface-hover)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.8125rem', marginBottom: '0.75rem', color: 'var(--admin-text-main)' }}>
                    Foto Sampel Layanan
                  </div>
                  <AdminImageUploader
                    label="Unggah Foto Layanan"
                    ratioHint="Rasio 4:3 (Landscape, misal 800 x 600 px)"
                    currentImage={formData.image}
                    onFileSelected={(file) => setImageFile(file)}
                    onUrlChanged={(url) => setFormData({ ...formData, image: url })}
                    folder="azhar/services"
                  />
                </div>
              </div>
            </div>
          </div>
      </div>
    </form>
  )
}
