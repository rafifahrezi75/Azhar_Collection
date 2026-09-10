import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, Star, MessageSquare, Sparkles, AlertCircle, Loader2 } from 'lucide-react'
import AdminImageUploader from '../components/AdminImageUploader'
import AdminRichEditor from '../components/AdminRichEditor'
import { uploadToCloudinary } from '../../firebase/cloudinaryService'
import { getTestimonialById, saveTestimonialItem } from '../../firebase/adminService'

export default function AdminTestimoniEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [imageFile, setImageFile] = useState(null)

  const [formData, setFormData] = useState({
    clientName: '',
    role: '',
    rating: 5,
    comment: '',
    avatar: ''
  })

  useEffect(() => {
    let isMounted = true
    getTestimonialById(id)
      .then((data) => {
        if (!isMounted) return
        if (data) {
          setFormData({
            id: data.id,
            clientName: data.clientName || data.name || '',
            role: data.role || data.institution || '',
            rating: data.rating || 5,
            comment: data.comment || data.quote || '',
            avatar: data.avatar || data.image || ''
          })
        } else {
          setError('Data ulasan testimoni tidak ditemukan')
        }
      })
      .catch((err) => {
        if (isMounted) setError(err?.message || 'Gagal memuat data testimoni')
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
    if (!formData.clientName.trim()) {
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
        id,
        avatar: finalAvatarUrl
      })

      navigate('/admin/testimoni')
    } catch (err) {
      setError(err?.message || 'Gagal memperbarui ulasan testimoni')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <Loader2 size={36} className="spin-animation" style={{ color: 'var(--admin-primary)', margin: '0 auto 1rem auto' }} />
        <p style={{ color: 'var(--admin-text-muted)', fontWeight: 600 }}>Memuat data testimoni...</p>
      </div>
    )
  }

  return (
    <div className="admin-form-page">
      <div className="admin-form-header">
        <div className="admin-form-header-left">
          <Link to="/admin/testimoni" className="admin-back-btn" title="Kembali" aria-label="Kembali">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h1 className="admin-page-title" style={{ margin: 0 }}>Ubah Ulasan Testimoni</h1>
              <div className="admin-inline-actions">
                <button
                  type="submit"
                  form="testimoni-edit-form"
                  disabled={submitting}
                  className="admin-action-icon-btn admin-action-icon-btn-primary"
                  title="Simpan Perubahan"
                  aria-label="Simpan Perubahan"
                >
                  {submitting ? <Loader2 size={16} className="admin-spin" /> : <Save size={16} />}
                </button>
              </div>
            </div>
            <p className="admin-page-desc" style={{ margin: '0.25rem 0 0 0' }}>
              Perbarui nama tokoh, institusi, rating, dan teks ulasan kepuasan.
            </p>
          </div>
        </div>

        <div className="admin-breadcrumbs">
          <Link to="/admin">Admin</Link>
          <span>/</span>
          <Link to="/admin/testimoni">Testimoni</Link>
          <span>/</span>
          <span className="current">Ubah</span>
        </div>
      </div>

      {error && (
        <div className="admin-alert admin-alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <form id="testimoni-edit-form" onSubmit={handleSubmit}>
        <div className="admin-form-grid">
          <div className="admin-form-card">
            <h2 className="admin-form-card-title">
              <MessageSquare size={18} style={{ color: 'var(--admin-primary)' }} />
              <span>Detail Ulasan Klien</span>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="testi-client-name">
                  Nama Klien / Tokoh <span style={{ color: 'var(--admin-danger)' }}>*</span>
                </label>
                <input
                  id="testi-client-name"
                  type="text"
                  className="admin-input"
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
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label" htmlFor="testi-rating">Rating Kepuasan (Bintang)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <select
                  id="testi-rating"
                  className="admin-select"
                  style={{ width: '160px' }}
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="admin-form-card">
              <h2 className="admin-form-card-title">
                <span>Foto Profil / Avatar</span>
              </h2>

              <AdminImageUploader
                label="Unggah Foto Klien"
                currentImage={formData.avatar}
                onFileSelected={(file) => setImageFile(file)}
                onUrlChanged={(url) => setFormData({ ...formData, avatar: url })}
                folder="azhar/testimonials"
              />
            </div>

            <div className="admin-form-card">
              <h2 className="admin-form-card-title">
                <Sparkles size={16} style={{ color: 'var(--admin-warning)' }} />
                <span>Publikasi</span>
              </h2>

              <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-muted)', margin: 0 }}>
                ID Testimoni: <strong>{id}</strong>
              </p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-muted)', margin: '0.5rem 0 0 0' }}>
                Simpan perubahan ulasan testimoni melalui tombol simpan di atas.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
