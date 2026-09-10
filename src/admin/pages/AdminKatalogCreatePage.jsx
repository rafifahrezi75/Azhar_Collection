import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Shirt, Sparkles, AlertCircle, Loader2 } from 'lucide-react'
import AdminImageUploader from '../components/AdminImageUploader'
import AdminRichEditor from '../components/AdminRichEditor'
import { uploadToCloudinary } from '../../firebase/cloudinaryService'
import { saveKatalogItem } from '../../firebase/adminService'

export default function AdminKatalogCreatePage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [imageFile, setImageFile] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    category: 'seragam',
    categoryLabel: 'Seragam Sekolah',
    client: '',
    material: '',
    specs: '',
    image: '',
    badge: 'Katalog Resmi'
  })

  const categoryLabels = {
    seragam: 'Seragam Sekolah',
    batik: 'Batik Identitas',
    kemeja: 'Kemeja PDH / PDL',
    jas: 'Jas Almamater',
    jaket: 'Jaket & Rompi',
    kaos: 'Kaos & Olahraga'
  }

  const handleCategoryChange = (val) => {
    setFormData((prev) => ({
      ...prev,
      category: val,
      categoryLabel: categoryLabels[val] || val
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setError('Nama model busana wajib diisi')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      let finalImageUrl = formData.image
      if (imageFile) {
        finalImageUrl = await uploadToCloudinary(imageFile)
      }

      await saveKatalogItem({
        ...formData,
        image: finalImageUrl
      })

      navigate('/admin/katalog')
    } catch (err) {
      setError(err?.message || 'Gagal menyimpan produk baru')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-form-page">
      <div className="admin-form-header">
        <div className="admin-form-header-left">
          <Link to="/admin/katalog" className="admin-back-btn" title="Kembali" aria-label="Kembali">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
              <h1 className="admin-page-title" style={{ margin: 0 }}>Tambah Model Busana Baru</h1>
              <div className="admin-inline-actions">
                <button
                  type="submit"
                  form="product-create-form"
                  disabled={submitting}
                  className="admin-action-icon-btn admin-action-icon-btn-primary"
                  title={submitting ? 'Menyimpan...' : 'Simpan Produk'}
                  aria-label="Simpan Produk"
                >
                  {submitting ? <Loader2 size={16} className="spin-animation" /> : <Save size={16} />}
                </button>
              </div>
            </div>
            <p className="admin-page-desc" style={{ margin: '0.25rem 0 0 0' }}>
              Tambahkan model seragam atau busana baru ke dalam portofolio katalog website.
            </p>
          </div>
        </div>

        <div className="admin-breadcrumbs">
          <Link to="/admin">Admin</Link>
          <span>/</span>
          <Link to="/admin/katalog">Katalog</Link>
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

      <form id="product-create-form" onSubmit={handleSubmit}>
        <div className="admin-form-grid">
          <div className="admin-form-card">
            <h2 className="admin-form-card-title">
              <Shirt size={18} style={{ color: 'var(--admin-primary)' }} />
              <span>Informasi Produk Busana</span>
            </h2>

            <div className="admin-form-group">
              <label className="admin-label" htmlFor="product-name">
                Nama Model Busana <span style={{ color: 'var(--admin-danger)' }}>*</span>
              </label>
              <input
                id="product-name"
                type="text"
                className="admin-input"
                placeholder="Contoh: Kemeja PDH Nagata Drill Bordir Komputer"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="product-category">Kategori Busana</label>
                <select
                  id="product-category"
                  className="admin-select"
                  value={formData.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                >
                  <option value="seragam">Seragam Sekolah</option>
                  <option value="batik">Batik Identitas</option>
                  <option value="kemeja">Kemeja PDH / PDL</option>
                  <option value="jas">Jas Almamater</option>
                  <option value="jaket">Jaket & Rompi</option>
                  <option value="kaos">Kaos & Olahraga</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-label" htmlFor="product-badge">Badge Label</label>
                <input
                  id="product-badge"
                  type="text"
                  className="admin-input"
                  placeholder="Contoh: Best Seller / Standar Kwarnas"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="admin-form-group">
                <label className="admin-label" htmlFor="product-client">Instansi / Mitra Pemesan</label>
                <input
                  id="product-client"
                  type="text"
                  className="admin-input"
                  placeholder="Contoh: Koperasi Guru & Siswa SMPN 1 Buduran"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label" htmlFor="product-material">Bahan Utama Kain</label>
                <input
                  id="product-material"
                  type="text"
                  className="admin-input"
                  placeholder="Contoh: Nagata Drill Asli Jepang / Katun Prima"
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <AdminRichEditor
                id="product-specs-editor"
                label="Rincian Spesifikasi & Keunggulan Model (TinyMCE)"
                value={formData.specs}
                onChange={(html) => setFormData((prev) => ({ ...prev, specs: html }))}
                placeholder="Jelaskan spesifikasi jahitan jarum dua, tipe kancing, furing, bordir logo komputer, dsb..."
                height={260}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="admin-form-card">
              <h2 className="admin-form-card-title">
                <span>Foto Produk Busana</span>
              </h2>

              <AdminImageUploader
                label="Unggah Foto Model"
                currentImage={formData.image}
                onFileSelected={(file) => setImageFile(file)}
                onUrlChanged={(url) => setFormData({ ...formData, image: url })}
                folder="azhar/products"
              />
            </div>

            <div className="admin-form-card">
              <h2 className="admin-form-card-title">
                <Sparkles size={16} style={{ color: 'var(--admin-warning)' }} />
                <span>Publikasi</span>
              </h2>

              <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-muted)', margin: 0 }}>
                Pastikan foto produk dan spesifikasi model sudah sesuai sebelum menyimpan ke sistem melalui tombol simpan di atas.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
