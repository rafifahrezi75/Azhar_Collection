import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Save, AlertCircle, Loader2, Calendar, Sparkles } from 'lucide-react'
import AdminImageUploader from '../components/AdminImageUploader'
import { getGalleryById, saveGalleryItem } from '../../firebase/adminService'
import { uploadToCloudinary, deleteFromCloudinary } from '../../firebase/cloudinaryService'
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

  const slashFullMatch = str.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/)
  if (slashFullMatch) {
    const day = slashFullMatch[1].padStart(2, '0')
    const month = slashFullMatch[2].padStart(2, '0')
    const year = slashFullMatch[3]
    return { type: 'full', value: `${year}-${month}-${day}` }
  }

  const slashMonthMatch = str.match(/^(\d{1,2})[\/-](\d{4})$/)
  if (slashMonthMatch) {
    const month = slashMonthMatch[1].padStart(2, '0')
    const year = slashMonthMatch[2]
    return { type: 'month', value: `${year}-${month}` }
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

  return { type: 'full', value: new Date().toISOString().split('T')[0] }
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

export default function AdminGaleriEditPage() {
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
    getGalleryById(id)
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
      setError('Foto dokumentasi galeri wajib diunggah. Silakan pilih berkas gambar dari perangkat Anda atau masukkan URL foto.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const oldImage = formData.image
      let finalImageUrl = formData.image
      if (imageFile) {
        finalImageUrl = await uploadToCloudinary(imageFile, 'azhar_gallery')
      }

      const formattedDate = formatDateToIndonesian(dateValue, dateType)

      await saveGalleryItem({
        id,
        title: formData.title.trim(),
        image: finalImageUrl,
        date: formattedDate
      })

      if (imageFile && oldImage && oldImage !== finalImageUrl) {
        await deleteFromCloudinary(oldImage).catch(() => {})
      }

      await showSuccessAlert('Perubahan Tersimpan', 'Foto galeri berhasil diperbarui.')
      navigate('/admin/galeri')
    } catch (err) {
      const errMsg = err?.message || 'Gagal menyimpan perubahan foto galeri. Mohon periksa koneksi internet Anda.'
      setError(errMsg)
      await showErrorAlert('Gagal Menyimpan Perubahan', errMsg)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <Loader2 size={36} className="spin-animation" style={{ color: 'var(--admin-primary)', margin: '0 auto 1rem auto' }} />
        <p style={{ color: 'var(--admin-text-muted)', fontWeight: 600 }}>Memuat data foto galeri...</p>
      </div>
    )
  }

  return (
    <form id="gallery-edit-form" onSubmit={handleSubmit}>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Ubah Foto Galeri</h1>
          <p className="admin-page-desc">
            Perbarui foto dokumentasi atau tanggal upload foto galeri #{id}.
          </p>
        </div>

        <div className="admin-breadcrumbs">
          <Link to="/admin">Admin</Link>
          <span>/</span>
          <Link to="/admin/galeri">Galeri Foto</Link>
          <span>/</span>
          <span className="current">Ubah</span>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/admin/galeri" className="admin-back-btn" title="Kembali" aria-label="Kembali">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h2 className="admin-card-title" style={{ margin: 0 }}>Formulir Perubahan Foto Galeri</h2>
              <p className="admin-card-subtitle" style={{ margin: '0.25rem 0 0 0' }}>
                Perbarui judul/keterangan foto galeri #{id} dan tentukan tanggal upload.
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
                <label className="admin-label" htmlFor="gallery-title">
                  Nama / Judul Foto Galeri
                </label>
                <input
                  id="gallery-title"
                  type="text"
                  className="admin-input"
                  placeholder="Contoh: Proses Bordir Komputer Logo Sekolah"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.375rem' }}>
                  <label htmlFor="gallery-date" className="admin-label" style={{ margin: 0 }}>
                    Tanggal Upload <span style={{ color: 'var(--admin-danger)' }}>*</span>
                  </label>

                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, color: 'var(--admin-text-main)', userSelect: 'none' }}>
                    <input
                      type="checkbox"
                      checked={dateType === 'month'}
                      onChange={(e) => {
                        const isMonth = e.target.checked
                        setDateType(isMonth ? 'month' : 'full')
                        if (isMonth) {
                          if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
                            setDateValue(dateValue.slice(0, 7))
                          } else if (!/^\d{4}-\d{2}$/.test(dateValue)) {
                            setDateValue(new Date().toISOString().slice(0, 7))
                          }
                        } else {
                          if (/^\d{4}-\d{2}$/.test(dateValue)) {
                            setDateValue(`${dateValue}-01`)
                          } else if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
                            setDateValue(new Date().toISOString().split('T')[0])
                          }
                        }
                      }}
                      style={{ accentColor: 'var(--admin-primary)', cursor: 'pointer' }}
                    />
                    <span>Periode (Hanya Bulan & Tahun)</span>
                  </label>
                </div>

                <div style={{ position: 'relative' }}>
                  <Calendar size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-subtle)', pointerEvents: 'none', zIndex: 1 }} />
                  {dateType === 'month' ? (
                    <input
                      id="gallery-date"
                      type="month"
                      className="admin-input"
                      style={{ paddingLeft: '2.25rem' }}
                      value={dateValue.length > 7 ? dateValue.slice(0, 7) : dateValue}
                      onChange={(e) => setDateValue(e.target.value)}
                      required
                    />
                  ) : (
                    <input
                      id="gallery-date"
                      type="date"
                      className="admin-input"
                      style={{ paddingLeft: '2.25rem' }}
                      value={dateValue.length > 10 ? dateValue.slice(0, 10) : dateValue}
                      onChange={(e) => setDateValue(e.target.value)}
                      required
                    />
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ padding: '1rem', border: '1px solid var(--admin-border)', borderRadius: '6px', backgroundColor: 'var(--admin-surface-hover)' }}>
                <AdminImageUploader
                  label="Foto Galeri Dokumentasi *"
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
