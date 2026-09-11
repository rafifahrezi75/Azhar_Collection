import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Star, Sparkles, AlertCircle, Loader2 } from 'lucide-react'
import AdminImageUploader from '../components/AdminImageUploader'
import AdminRichEditor from '../components/AdminRichEditor'
import { uploadToCloudinary } from '../../firebase/cloudinaryService'
import { saveTestimonialItem } from '../../firebase/adminService'
import { showSuccessAlert, showErrorAlert } from '../utils/swal'

export default function AdminTestimoniCreatePage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [imageFile, setImageFile] = useState(null)

  const [formData, setFormData] = useState({
    clientName: '',
    name: '',
    role: '',
    rating: 5,
    comment: '',
    avatar: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nameVal = formData.clientName || formData.name
    if (!nameVal.trim()) {
      setError('Nama klien wajib diisi')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      let finalAvatarUrl = formData.avatar
      if (imageFile) {
        finalAvatarUrl = await uploadToCloudinary(imageFile)
      }

      await saveTestimonialItem({
        ...formData,
        clientName: nameVal,
        name: nameVal,
        avatar: finalAvatarUrl
      })

      await showSuccessAlert('Berhasil Ditambahkan', 'Testimoni ulasan baru berhasil disimpan.')
      navigate('/admin/testimoni')
    } catch (err) {
      setError(err?.message || 'Gagal menyimpan ulasan testimoni')
      showErrorAlert('Gagal Menyimpan', err?.message || 'Gagal menyimpan ulasan testimoni')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form id="testimoni-create-form" onSubmit={handleSubmit}>
      <div className="admin-card">
        <div className="admin-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/admin/testimoni" className="admin-back-btn" title="Kembali" aria-label="Kembali">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="admin-page-title" style={{ margin: 0 }}>Tambah Ulasan Testimoni Baru</h1>
              <p className="admin-page-desc" style={{ margin: '0.25rem 0 0 0' }}>
                Publikasikan testimoni dan umpan balik kepuasan mitra ke beranda website.
              </p>
            </div>
          </div>

          <div className="admin-inline-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="submit"
              disabled={submitting}
              className="admin-action-icon-btn admin-action-icon-btn-primary"
              title="Simpan Testimoni"
              aria-label="Simpan Testimoni"
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="testi-client-name">
                    Nama Klien / Tokoh <span style={{ color: 'var(--admin-danger)' }}>*</span>
                  </label>
                  <input
                    id="testi-client-name"
                    type="text"
                    className="admin-input"
                    placeholder="Contoh: Dra. Hj. Nurul Hidayati, M.Pd."
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="testi-role">Jabatan / Lembaga</label>
                  <input
                    id="testi-role"
                    type="text"
                    className="admin-input"
                    placeholder="Contoh: Kepala SMP Negeri 1 Cirebon"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label" htmlFor="testi-rating">Rating Kepuasan (Bintang)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <select
                    id="testi-rating"
                    className="admin-select"
                    style={{ width: '240px', maxWidth: '100%' }}
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  >
                    <option value={5}>5 Bintang (Sangat Puas)</option>
                    <option value={4}>4 Bintang (Puas)</option>
                    <option value={3}>3 Bintang (Cukup)</option>
                    <option value={2}>2 Bintang (Kurang)</option>
                    <option value={1}>1 Bintang (Tidak Puas)</option>
                  </select>
                  <div style={{ display: 'flex', gap: '2px', color: 'var(--admin-warning)' }}>
                    {[...Array(formData.rating)].map((_, idx) => (
                      <Star key={idx} size={16} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="admin-form-group">
                <AdminRichEditor
                  id="testi-comment-editor"
                  label="Isi Kutipan Ulasan / Pengalaman Mitra (TinyMCE)"
                  value={formData.comment}
                  onChange={(html) => setFormData((prev) => ({ ...prev, comment: html }))}
                  placeholder="Tuliskan pengalaman mitra mengenai ketepatan waktu, kerapian jahitan, atau keramahan pelayanan tim Azhar Collection..."
                  height={240}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ padding: '1rem', border: '1px solid var(--admin-border)', borderRadius: '6px', backgroundColor: 'var(--admin-surface-hover)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.8125rem', marginBottom: '0.75rem', color: 'var(--admin-text-main)' }}>
                  Foto Profil / Avatar
                </div>
                <AdminImageUploader
                  label="Unggah Foto Klien"
                  ratioHint="Rasio 1:1 (Avatar Persegi / Bulat, misal 400 x 400 px)"
                  currentImage={formData.avatar}
                  onFileSelected={(file) => setImageFile(file)}
                  onUrlChanged={(url) => setFormData({ ...formData, avatar: url })}
                  folder="azhar/testimonials"
                />
              </div>

              <div style={{ padding: '1rem', border: '1px solid var(--admin-border)', borderRadius: '6px', backgroundColor: 'var(--admin-surface-hover)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.8125rem', marginBottom: '0.5rem', color: 'var(--admin-text-main)' }}>
                  <Sparkles size={15} style={{ color: 'var(--admin-warning)' }} />
                  <span>Publikasi</span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-muted)', margin: 0, lineHeight: 1.5 }}>
                  Testimoni ini akan ditampilkan di slider testimoni website setelah disimpan melalui tombol simpan di atas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
