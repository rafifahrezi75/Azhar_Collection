import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, AlertCircle, Loader2, Plus, Trash2 } from 'lucide-react'
import AdminImageUploader from '../components/AdminImageUploader'
import { uploadToCloudinary } from '../../firebase/cloudinaryService'
import { getKatalogById, saveKatalogItem } from '../../firebase/adminService'
import { showSuccessAlert, showErrorAlert } from '../utils/swal'

const categoryLabels = {
  seragam: 'Seragam Sekolah',
  batik: 'Batik Identitas',
  kemeja: 'Kemeja PDH / PDL',
  jas: 'Jas Almamater',
  jaket: 'Jaket & Rompi',
  kaos: 'Kaos & Olahraga'
}

export default function AdminKatalogEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [materials, setMaterials] = useState([''])

  const [formData, setFormData] = useState({
    name: '',
    category: 'seragam',
    categoryLabel: 'Seragam Sekolah',
    client: '',
    specs: '',
    image: ''
  })

  useEffect(() => {
    let isMounted = true
    getKatalogById(id)
      .then((data) => {
        if (!isMounted) return
        if (data) {
          let initMaterials = ['']
          if (Array.isArray(data.materials) && data.materials.length > 0) {
            initMaterials = data.materials.slice(0, 3)
          } else if (typeof data.material === 'string' && data.material.trim()) {
            const parts = data.material.split(',').map((s) => s.trim()).filter(Boolean)
            initMaterials = parts.length > 0 ? parts.slice(0, 3) : ['']
          }
          setMaterials(initMaterials)

          setFormData({
            id: data.id,
            name: data.name || '',
            category: data.category || 'seragam',
            categoryLabel: data.categoryLabel || categoryLabels[data.category] || 'Seragam Sekolah',
            client: data.client || '',
            specs: data.specs || data.customDetails || '',
            image: data.image || ''
          })
        } else {
          setError('Data model produk tidak ditemukan')
        }
      })
      .catch((err) => {
        if (isMounted) setError(err?.message || 'Gagal memuat data produk')
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [id])

  const handleCategoryChange = (val) => {
    setFormData((prev) => ({
      ...prev,
      category: val,
      categoryLabel: categoryLabels[val] || val
    }))
  }

  const handleMaterialChange = (index, value) => {
    const updated = [...materials]
    updated[index] = value
    setMaterials(updated)
  }

  const handleAddMaterial = () => {
    if (materials.length < 3) {
      setMaterials([...materials, ''])
    }
  }

  const handleRemoveMaterial = (index) => {
    if (materials.length > 1) {
      setMaterials(materials.filter((_, i) => i !== index))
    }
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

      const validMaterials = materials.map((m) => m.trim()).filter(Boolean)

      await saveKatalogItem({
        ...formData,
        id,
        materials: validMaterials,
        material: validMaterials.join(', '),
        image: finalImageUrl
      })

      await showSuccessAlert('Berhasil Diperbarui', 'Perubahan model busana berhasil disimpan.')
      navigate('/admin/katalog')
    } catch (err) {
      setError(err?.message || 'Gagal memperbarui produk')
      showErrorAlert('Gagal Menyimpan', err?.message || 'Gagal memperbarui produk')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <Loader2 size={36} className="spin-animation" style={{ color: 'var(--admin-primary)', margin: '0 auto 1rem auto' }} />
        <p style={{ color: 'var(--admin-text-muted)', fontWeight: 600 }}>Memuat data produk busana...</p>
      </div>
    )
  }

  return (
    <form id="product-edit-form" onSubmit={handleSubmit}>
      <div className="admin-card">
        <div className="admin-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/admin/katalog" className="admin-back-btn" title="Kembali" aria-label="Kembali">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="admin-page-title" style={{ margin: 0 }}>Ubah Model Busana</h1>
              <p className="admin-page-desc" style={{ margin: '0.25rem 0 0 0' }}>
                Perbarui rincian spesifikasi, bahan, foto, dan kategori produk.
              </p>
            </div>
          </div>

          <div className="admin-inline-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="submit"
              disabled={submitting}
              className="admin-action-icon-btn admin-action-icon-btn-primary"
              title={submitting ? 'Memperbarui...' : 'Simpan Perubahan'}
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
                    <label className="admin-label" htmlFor="product-client">Instansi / Mitra Pemesan</label>
                    <input
                      id="product-client"
                      type="text"
                      className="admin-input"
                      value={formData.client}
                      onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                    <label className="admin-label" style={{ margin: 0 }}>
                      Bahan Utama Kain (Maks. 3 Poin)
                    </label>
                    <span className="admin-points-count">
                      {materials.length} / 3 Poin
                    </span>
                  </div>

                  <div className="admin-points-container">
                    {materials.map((mat, idx) => (
                      <div key={idx} className="admin-point-row">
                        <span className="admin-point-index">{idx + 1}.</span>
                        <input
                          type="text"
                          className="admin-input admin-point-input"
                          placeholder={`Poin bahan ${idx + 1}, misal: Nagata Drill Asli Jepang`}
                          value={mat}
                          onChange={(e) => handleMaterialChange(idx, e.target.value)}
                        />
                        {materials.length > 1 && (
                          <button
                            type="button"
                            className="admin-action-icon-btn admin-action-icon-btn-danger"
                            onClick={() => handleRemoveMaterial(idx)}
                            title="Hapus Poin Bahan"
                            aria-label="Hapus Poin Bahan"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                        {idx === materials.length - 1 && materials.length < 3 && (
                          <button
                            type="button"
                            className="admin-action-icon-btn admin-action-icon-btn-primary"
                            onClick={handleAddMaterial}
                            title="Tambah Poin Bahan"
                            aria-label="Tambah Poin Bahan"
                          >
                            <Plus size={15} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label" htmlFor="product-specs">
                    Rincian Spesifikasi dan Keunggulan Model
                  </label>
                  <textarea
                    id="product-specs"
                    rows={6}
                    className="admin-input"
                    style={{ resize: 'vertical', lineHeight: 1.6, minHeight: '130px' }}
                    placeholder="Tuliskan rincian spesifikasi jahitan jarum dua, tipe kancing, furing, bordir logo komputer, dsb..."
                    value={formData.specs}
                    onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ padding: '1rem', border: '1px solid var(--admin-border)', borderRadius: '6px', backgroundColor: 'var(--admin-surface-hover)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.8125rem', marginBottom: '0.75rem', color: 'var(--admin-text-main)' }}>
                    Foto Produk Busana
                  </div>
                  <AdminImageUploader
                    label="Unggah Foto Model"
                    ratioHint="Rasio 4:3 (Landscape, misal 800 x 600 px)"
                    currentImage={formData.image}
                    onFileSelected={(file) => setImageFile(file)}
                    onUrlChanged={(url) => setFormData({ ...formData, image: url })}
                    folder="azhar/products"
                  />
                </div>
              </div>
            </div>
          </div>
      </div>
    </form>
  )
}
