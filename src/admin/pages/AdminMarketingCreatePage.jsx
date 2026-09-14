import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, AlertCircle, Loader2 } from 'lucide-react'
import AdminImageUploader from '../components/AdminImageUploader'
import { uploadToCloudinary } from '../../firebase/cloudinaryService'
import { saveMarketingItem } from '../../firebase/adminService'
import { showSuccessAlert, showErrorAlert } from '../utils/swal'

export default function AdminMarketingCreatePage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [imageFile, setImageFile] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    division: '',
    phone: '',
    photo: '',
    status: 'Online Siap Melayani',
    order: 1
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setError('Nama petugas marketing wajib diisi')
      return
    }
    if (!formData.phone.trim()) {
      setError('Nomor WhatsApp wajib diisi')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      let finalPhotoUrl = formData.photo
      if (imageFile) {
        finalPhotoUrl = await uploadToCloudinary(imageFile)
      }

      await saveMarketingItem({
        ...formData,
        photo: finalPhotoUrl
      })

      await showSuccessAlert('Berhasil Ditambahkan', 'Petugas marketing baru berhasil disimpan.')
      navigate('/admin/marketing')
    } catch (err) {
      setError(err?.message || 'Gagal menyimpan petugas marketing')
      showErrorAlert('Gagal Menyimpan', err?.message || 'Gagal menyimpan petugas marketing')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form id="marketing-create-form" onSubmit={handleSubmit}>
      <div className="admin-card">
        <div className="admin-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/admin/marketing" className="admin-back-btn" title="Kembali" aria-label="Kembali">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="admin-page-title" style={{ margin: 0 }}>Tambah Petugas Marketing</h1>
              <p className="admin-page-desc" style={{ margin: '0.25rem 0 0 0' }}>
                Tambahkan kontak tim marketing baru yang dapat dihubungi pelanggan di website.
              </p>
            </div>
          </div>

          <div className="admin-inline-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="submit"
              disabled={submitting}
              className="admin-action-icon-btn admin-action-icon-btn-primary"
              title="Simpan"
              aria-label="Simpan"
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

          <div className="admin-two-cols-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="admin-form-label">
                  Nama Petugas <span style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ach. Haris"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="admin-input"
                />
              </div>

              <div>
                <label className="admin-form-label">Divisi / Jabatan</label>
                <input
                  type="text"
                  placeholder="Contoh: Marketing & Pemesanan Tender"
                  value={formData.division}
                  onChange={(e) => setFormData((prev) => ({ ...prev, division: e.target.value }))}
                  className="admin-input"
                />
              </div>

              <div>
                <label className="admin-form-label">
                  Nomor WhatsApp / HP <span style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 0813-3066-6807 atau +6281330666807"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  className="admin-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="admin-form-label">Status Ketersediaan</label>
                  <input
                    type="text"
                    placeholder="Contoh: Online Siap Melayani"
                    value={formData.status}
                    onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                    className="admin-input"
                  />
                </div>

                <div>
                  <label className="admin-form-label">Urutan Tampilan</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) => setFormData((prev) => ({ ...prev, order: e.target.value }))}
                    className="admin-input"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="admin-form-label">Foto Profil Petugas</label>
              <AdminImageUploader
                value={formData.photo}
                onChange={(url) => setFormData((prev) => ({ ...prev, photo: url }))}
                onFileSelect={(file) => setImageFile(file)}
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginTop: '0.5rem' }}>
                Opsional. Jika dikosongkan, kartu kontak akan menampilkan ikon foto secara otomatis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
