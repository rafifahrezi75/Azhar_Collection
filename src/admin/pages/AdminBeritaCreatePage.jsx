import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Save, AlertCircle, Loader2, Calendar, Sparkles } from 'lucide-react'
import AdminImageUploader from '../components/AdminImageUploader'
import { saveBeritaItem } from '../../firebase/adminService'
import { uploadToCloudinary } from '../../firebase/cloudinaryService'
import { showSuccessAlert, showErrorAlert } from '../utils/swal'

const formatDateToIndonesian = (val, type = 'full') => {
  if (!val) return ''
  if (type === 'month') {
    if (/^\d{4}-\d{2}$/.test(val)) {
      const [y, m] = val.split('-').map(Number)
      const dateObj = new Date(y, m - 1, 1)
      return dateObj.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
      const [y, m] = val.split('-').map(Number)
      const dateObj = new Date(y, m - 1, 1)
      return dateObj.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
    }
    return val
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
    const [y, m, d] = val.split('-').map(Number)
    const dateObj = new Date(y, m - 1, d)
    return dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  }
  if (/^\d{4}-\d{2}$/.test(val)) {
    const [y, m] = val.split('-').map(Number)
    const dateObj = new Date(y, m - 1, 1)
    return dateObj.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
  }
  return val
}

export default function AdminBeritaCreatePage() {
  const navigate = useNavigate()
  const [dateType, setDateType] = useState('full')
  const [dateValue, setDateValue] = useState(new Date().toISOString().split('T')[0])
  const [formData, setFormData] = useState({
    title: '',
    image: ''
  })

  const [imageFile, setImageFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!imageFile && !formData.image) {
      setError('Foto dokumentasi wajib diunggah')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      let finalImageUrl = formData.image
      if (imageFile) {
        finalImageUrl = await uploadToCloudinary(imageFile, 'azhar_gallery')
      }

      const formattedDate = formatDateToIndonesian(dateValue, dateType)

      await saveBeritaItem({
        title: formData.title.trim() || 'Dokumentasi Produksi',
        image: finalImageUrl,
        date: formattedDate
      })

      await showSuccessAlert('Foto Berhasil Disimpan', 'Dokumentasi foto baru telah ditambahkan ke galeri.')
      navigate('/admin/galeri')
    } catch (err) {
      setError(err?.message || 'Gagal menyimpan foto galeri')
      await showErrorAlert('Gagal Menyimpan', err?.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form id="gallery-create-form" onSubmit={handleSubmit}>
      <div className="admin-card">
        <div className="admin-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/admin/galeri" className="admin-back-btn" title="Kembali" aria-label="Kembali">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="admin-page-title" style={{ margin: 0 }}>Unggah Foto Galeri Baru</h1>
              <p className="admin-page-desc" style={{ margin: '0.25rem 0 0 0' }}>
                Tambahkan foto dokumentasi workshop, jahitan, atau bordir komputer dan tentukan tanggal unggah.
              </p>
            </div>
          </div>

          <div className="admin-inline-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="submit"
              disabled={submitting}
              className="admin-action-icon-btn admin-action-icon-btn-primary"
              title={submitting ? 'Menyimpan...' : 'Simpan Foto'}
              aria-label="Simpan Foto"
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
                <label className="admin-label">
                  Nama / Judul Foto Galeri
                </label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Contoh: Proses Bordir Komputer Logo Sekolah"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">
                  <Calendar size={14} style={{ display: 'inline', marginRight: '0.35rem' }} />
                  Format Tanggal Upload <span style={{ color: 'var(--admin-danger)' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600 }}>
                    <input
                      type="radio"
                      name="dateType"
                      value="full"
                      checked={dateType === 'full'}
                      onChange={() => setDateType('full')}
                    />
                    <span>Tanggal Lengkap (misal: 10 September 2024)</span>
                  </label>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600 }}>
                    <input
                      type="radio"
                      name="dateType"
                      value="month"
                      checked={dateType === 'month'}
                      onChange={() => setDateType('month')}
                    />
                    <span>Hanya Bulan & Tahun (misal: September 2024)</span>
                  </label>
                </div>

                {dateType === 'full' ? (
                  <input
                    id="gallery-date"
                    type="date"
                    className="admin-input"
                    value={dateValue}
                    onChange={(e) => setDateValue(e.target.value)}
                    required
                  />
                ) : (
                  <input
                    id="gallery-date"
                    type="month"
                    className="admin-input"
                    value={dateValue.length > 7 ? dateValue.slice(0, 7) : dateValue}
                    onChange={(e) => setDateValue(e.target.value)}
                    required
                  />
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ padding: '1rem', border: '1px solid var(--admin-border)', borderRadius: '6px', backgroundColor: 'var(--admin-surface-hover)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.8125rem', marginBottom: '0.75rem', color: 'var(--admin-text-main)' }}>
                  Foto Galeri Dokumentasi <span style={{ color: 'var(--admin-danger)' }}>*</span>
                </div>
                <AdminImageUploader
                  label="Unggah Foto Galeri"
                  ratioHint="Format JPG, PNG, WebP (Rasio Bebas)"
                  currentImage={formData.image}
                  onFileSelected={(file) => setImageFile(file)}
                  onUrlChanged={(url) => setFormData({ ...formData, image: url })}
                  folder="azhar/gallery"
                />
              </div>

              <div style={{ padding: '1rem', border: '1px solid var(--admin-border)', borderRadius: '6px', backgroundColor: 'var(--admin-surface-hover)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.8125rem', marginBottom: '0.5rem', color: 'var(--admin-text-main)' }}>
                  <Sparkles size={15} style={{ color: 'var(--admin-warning)' }} />
                  <span>Publikasi Galeri</span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-muted)', margin: 0, lineHeight: 1.5 }}>
                  Foto akan langsung ditampilkan pada korsel galeri dokumentasi di beranda dan halaman galeri publik.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

