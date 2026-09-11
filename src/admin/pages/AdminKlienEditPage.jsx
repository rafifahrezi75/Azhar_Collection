import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, AlertCircle, Loader2 } from 'lucide-react'
import AdminImageUploader from '../components/AdminImageUploader'
import AdminRichEditor from '../components/AdminRichEditor'
import { uploadToCloudinary } from '../../firebase/cloudinaryService'
import { getKlienById, saveKlienItem } from '../../firebase/adminService'
import { showSuccessAlert, showErrorAlert } from '../utils/swal'

export default function AdminKlienEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [imageFile, setImageFile] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    category: 'Sekolah Dasar',
    categoryKey: 'sekolah',
    city: 'Kabupaten Sidoarjo',
    since: '2020',
    summary: '',
    image: '',
    totalOrders: 'Rutin Tiap Tahun Ajaran Baru',
    totalPcs: '1.000+ Setel',
    contactPerson: ''
  })

  const categoryOptions = [
    { label: 'Sekolah Dasar / Madrasah Ibtidaiyah', key: 'sekolah' },
    { label: 'SMP / MTs', key: 'sekolah' },
    { label: 'SMA / SMK / MA', key: 'sekolah' },
    { label: 'Perguruan Tinggi / Universitas', key: 'kampus' },
    { label: 'Instansi Pemerintah / Kedinasan', key: 'instansi' },
    { label: 'Perusahaan Swasta & BUMN', key: 'perusahaan' },
    { label: 'Komunitas / Organisasi', key: 'komunitas' }
  ]

  useEffect(() => {
    let isMounted = true
    getKlienById(id)
      .then((data) => {
        if (!isMounted) return
        if (data) {
          setFormData({
            id: data.id,
            name: data.name || '',
            category: data.category || 'Sekolah Dasar',
            categoryKey: data.categoryKey || 'sekolah',
            city: data.city || 'Kabupaten Sidoarjo',
            since: data.since || '2020',
            summary: data.summary || '',
            image: data.image || '',
            totalOrders: data.totalOrders || '',
            totalPcs: data.totalPcs || '',
            contactPerson: data.contactPerson || ''
          })
        } else {
          setError('Data mitra tidak ditemukan')
        }
      })
      .catch((err) => {
        if (isMounted) setError(err?.message || 'Gagal memuat data mitra')
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [id])

  const handleCategorySelect = (e) => {
    const selected = categoryOptions.find((opt) => opt.label === e.target.value)
    setFormData((prev) => ({
      ...prev,
      category: e.target.value,
      categoryKey: selected ? selected.key : 'sekolah'
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setError('Nama institusi mitra wajib diisi')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      let finalImageUrl = formData.image
      if (imageFile) {
        finalImageUrl = await uploadToCloudinary(imageFile)
      }

      await saveKlienItem({
        ...formData,
        id,
        image: finalImageUrl
      })

      await showSuccessAlert('Berhasil Diperbarui', 'Perubahan profil mitra berhasil disimpan.')
      navigate('/admin/klien')
    } catch (err) {
      setError(err?.message || 'Gagal memperbarui data mitra')
      showErrorAlert('Gagal Menyimpan', err?.message || 'Gagal memperbarui data mitra')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <Loader2 size={36} className="spin-animation" style={{ color: 'var(--admin-primary)', margin: '0 auto 1rem auto' }} />
        <p style={{ color: 'var(--admin-text-muted)', fontWeight: 600 }}>Memuat profil mitra klien...</p>
      </div>
    )
  }

  return (
    <form id="klien-edit-form" onSubmit={handleSubmit}>
      <div className="admin-card">
        <div className="admin-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/admin/klien" className="admin-back-btn" title="Kembali" aria-label="Kembali">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="admin-page-title" style={{ margin: 0 }}>Ubah Data Mitra Lembaga</h1>
              <p className="admin-page-desc" style={{ margin: '0.25rem 0 0 0' }}>
                Perbarui profil instansi, logo, kontak PIC, dan riwayat volume pesanan.
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
                  <label className="admin-label" htmlFor="client-name">
                    Nama Instansi / Sekolah <span style={{ color: 'var(--admin-danger)' }}>*</span>
                  </label>
                  <input
                    id="client-name"
                    type="text"
                    className="admin-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div className="admin-form-group">
                    <label className="admin-label" htmlFor="client-category">Kategori Lembaga</label>
                    <select
                      id="client-category"
                      className="admin-select"
                      value={formData.category}
                      onChange={handleCategorySelect}
                    >
                      {categoryOptions.map((opt) => (
                        <option key={opt.label} value={opt.label}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label" htmlFor="client-city">Kota / Kabupaten</label>
                    <input
                      id="client-city"
                      type="text"
                      className="admin-input"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div className="admin-form-group">
                    <label className="admin-label" htmlFor="client-since">Tahun Mulai Kemitraan</label>
                    <input
                      id="client-since"
                      type="text"
                      className="admin-input"
                      value={formData.since}
                      onChange={(e) => setFormData({ ...formData, since: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label" htmlFor="client-contact">Kontak PIC / Pejabat Lembaga</label>
                    <input
                      id="client-contact"
                      type="text"
                      className="admin-input"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div className="admin-form-group">
                    <label className="admin-label" htmlFor="client-total-orders">Frekuensi Pemesanan</label>
                    <input
                      id="client-total-orders"
                      type="text"
                      className="admin-input"
                      value={formData.totalOrders}
                      onChange={(e) => setFormData({ ...formData, totalOrders: e.target.value })}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label" htmlFor="client-total-pcs">Estimasi Akumulasi Volume</label>
                    <input
                      id="client-total-pcs"
                      type="text"
                      className="admin-input"
                      value={formData.totalPcs}
                      onChange={(e) => setFormData({ ...formData, totalPcs: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <AdminRichEditor
                    id="client-summary-editor"
                    label="Ringkasan Kemitraan & Deskripsi Profil (TinyMCE)"
                    value={formData.summary}
                    onChange={(html) => setFormData((prev) => ({ ...prev, summary: html }))}
                    placeholder="Tuliskan riwayat pemesanan seragam OSIS, batik identitas, jas almamater, atau baju kerja yang dikerjakan untuk mitra ini..."
                    height={260}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ padding: '1rem', border: '1px solid var(--admin-border)', borderRadius: '6px', backgroundColor: 'var(--admin-surface-hover)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.8125rem', marginBottom: '0.75rem', color: 'var(--admin-text-main)' }}>
                    Logo / Foto Mitra
                  </div>
                  <AdminImageUploader
                    label="Unggah Logo Instansi"
                    ratioHint="Rasio 1:1 (Pas Foto 3x3, misal 600 x 600 px)"
                    currentImage={formData.image}
                    onFileSelected={(file) => setImageFile(file)}
                    onUrlChanged={(url) => setFormData({ ...formData, image: url })}
                    folder="azhar/clients"
                  />
                </div>
              </div>
            </div>
          </div>
      </div>
    </form>
  )
}
