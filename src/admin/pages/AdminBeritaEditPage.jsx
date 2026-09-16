import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Save, AlertCircle, Loader2, Calendar, Sparkles } from 'lucide-react'
import AdminImageUploader from '../components/AdminImageUploader'
import { getBeritaById, saveBeritaItem } from '../../firebase/adminService'
import { uploadToCloudinary } from '../../firebase/cloudinaryService'
import { showSuccessAlert, showErrorAlert } from '../utils/swal'

const monthsMap = {
  januari: '01', februari: '02', maret: '03', april: '04',
  mei: '05', juni: '06', juli: '07', agustus: '08',
  september: '09', oktober: '10', november: '11', desember: '12'
}

const parseDateInfo = (dateStr) => {
  if (!dateStr) {
    return { type: 'full', value: new Date().toISOString().split('T')[0] }
  }
  const str = dateStr.trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return { type: 'full', value: str }
  }
  if (/^\d{4}-\d{2}$/.test(str)) {
    return { type: 'month', value: str }
  }

  const parts = str.split(/\s+/)
  if (parts.length >= 3) {
    const day = parts[0].padStart(2, '0')
    const month = monthsMap[parts[1].toLowerCase()] || '01'
    const year = parts[2]
    return { type: 'full', value: `${year}-${month}-${day}` }
  }
  if (parts.length === 2) {
    const month = monthsMap[parts[0].toLowerCase()] || '01'
    const year = parts[1]
    return { type: 'month', value: `${year}-${month}` }
  }

  return { type: 'full', value: str }
}

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

export default function AdminBeritaEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [dateType, setDateType] = useState('full')
  const [dateValue, setDateValue] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    image: ''
  })

  const [imageFile, setImageFile] = useState(null)

  useEffect(() => {
    let isMounted = true
    getBeritaById(id)
      .then((data) => {
        if (!isMounted) return
        if (data) {
          const info = parseDateInfo(data.date)
          setDateType(info.type)
          setDateValue(info.value)
          setFormData({
            title: data.title || '',
            image: data.image || ''
          })
        } else {
          setError('Data foto galeri tidak ditemukan')
        }
      })
      .catch((err) => {
        if (isMounted) setError(err?.message || 'Gagal memuat data')
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
        id,
        title: formData.title.trim() || 'Dokumentasi Produksi',
        image: finalImageUrl,
        date: formattedDate
      })

      await showSuccessAlert('Perubahan Tersimpan', 'Foto galeri berhasil diperbarui.')
      navigate('/admin/galeri')
    } catch (err) {
      setError(err?.message || 'Gagal menyimpan perubahan')
      await showErrorAlert('Gagal Menyimpan', err?.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="admin-loading-container">
        <Loader2 size={32} className="spin-animation" style={{ color: 'var(--admin-primary)' }} />
        <span>Memuat data foto galeri...</span>
      </div>
    )
  }

  return (
    <form id="gallery-edit-form" onSubmit={handleSubmit}>
      <div className="admin-card">
        <div className="admin-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/admin/galeri" className="admin-back-btn" title="Kembali" aria-label="Kembali">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="admin-page-title" style={{ margin: 0 }}>Ubah Foto Galeri</h1>
              <p className="admin-page-desc" style={{ margin: '0.25rem 0 0 0' }}>
                Perbarui foto dokumentasi atau tanggal upload foto galeri #{id}.
              </p>
            </div>
          </div>

          <div className="admin-inline-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="submit"
              disabled={submitting}
              className="admin-action-icon-btn admin-action-icon-btn-primary"
              title={submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
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
                  Perubahan foto galeri ini akan langsung diperbarui di website publik.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

