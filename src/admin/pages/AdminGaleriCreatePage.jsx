import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Sparkles, AlertCircle, Loader2, Calendar } from 'lucide-react'
import AdminImageUploader from '../components/AdminImageUploader'
import { saveGalleryItem } from '../../firebase/adminService'
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

export default function AdminGaleriCreatePage() {
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
      setError('Foto dokumentasi galeri wajib diunggah. Silakan pilih berkas gambar dari perangkat Anda atau masukkan URL foto.')
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

      await saveGalleryItem({
        title: formData.title.trim(),
        image: finalImageUrl,
        date: formattedDate
      })

      await showSuccessAlert('Foto Berhasil Disimpan', 'Dokumentasi foto baru telah ditambahkan ke galeri.')
      navigate('/admin/galeri')
    } catch (err) {
      const errMsg = err?.message || 'Gagal menyimpan foto ke galeri. Mohon periksa koneksi internet Anda.'
      setError(errMsg)
      await showErrorAlert('Gagal Menyimpan Foto', errMsg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form id="gallery-create-form" onSubmit={handleSubmit}>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Unggah Foto Galeri Baru</h1>
          <p className="admin-page-desc">
            Tambahkan foto dokumentasi workshop, jahitan, atau bordir komputer dan tentukan tanggal unggah.
          </p>
        </div>

        <div className="admin-breadcrumbs">
          <Link to="/admin">Admin</Link>
          <span>/</span>
          <Link to="/admin/galeri">Galeri Foto</Link>
          <span>/</span>
          <span className="current">Tambah</span>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/admin/galeri" className="admin-back-btn" title="Kembali" aria-label="Kembali">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h2 className="admin-card-title" style={{ margin: 0 }}>Formulir Dokumentasi Foto</h2>
              <p className="admin-card-subtitle" style={{ margin: '0.25rem 0 0 0' }}>
                Isi judul/keterangan foto (keperluan admin) dan tentukan tanggal unggah.
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
