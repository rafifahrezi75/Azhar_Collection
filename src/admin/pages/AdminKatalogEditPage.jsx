import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, AlertCircle, Loader2, Plus, Trash2, Star, Image as ImageIcon } from 'lucide-react'
import AdminImageUploader from '../components/AdminImageUploader'
import { uploadToCloudinary } from '../../firebase/cloudinaryService'
import { getKatalogById, getKlienList, saveKatalogItem, createSlug } from '../../firebase/adminService'
import AdminClientAutocomplete from '../components/AdminClientAutocomplete'
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
  const [materials, setMaterials] = useState([''])
  const [clientsList, setClientsList] = useState([])

  const [photos, setPhotos] = useState([
    { id: 'p-1', url: '', file: null, gender: 'Laki-laki' }
  ])

  const [formData, setFormData] = useState({
    name: '',
    category: 'seragam',
    categoryLabel: 'Seragam Sekolah',
    clientId: '',
    client: '',
    specs: ''
  })

  useEffect(() => {
    let isMounted = true
    Promise.all([getKatalogById(id), getKlienList()])
      .then(([data, clients]) => {
        if (!isMounted) return
        if (clients) setClientsList(clients)

        if (data) {
          let initMaterials = ['']
          if (Array.isArray(data.materials) && data.materials.length > 0) {
            initMaterials = data.materials.slice(0, 3)
          } else if (typeof data.material === 'string' && data.material.trim()) {
            const parts = data.material.split(',').map((s) => s.trim()).filter(Boolean)
            initMaterials = parts.length > 0 ? parts.slice(0, 3) : ['']
          }
          setMaterials(initMaterials)

          let initialPhotos = []
          if (Array.isArray(data.images) && data.images.length > 0) {
            initialPhotos = data.images.map((img, idx) => ({
              id: `p-${idx + 1}`,
              url: typeof img === 'string' ? img : img.url || '',
              file: null,
              gender: (typeof img === 'object' && img.gender) ? img.gender : 'Unisex'
            }))
          } else if (data.image) {
            initialPhotos = [
              { id: 'p-1', url: data.image, file: null, gender: 'Unisex' }
            ]
          } else {
            initialPhotos = [
              { id: 'p-1', url: '', file: null, gender: 'Laki-laki' }
            ]
          }
          setPhotos(initialPhotos)

          let matchedClientId = data.clientId || ''
          if (!matchedClientId && data.client && clients && clients.length > 0) {
            const found = clients.find(
              (c) => c.name?.toLowerCase() === data.client?.toLowerCase() ||
                     c.name?.toLowerCase().includes(data.client?.toLowerCase())
            )
            if (found) matchedClientId = found.id
          }

          setFormData({
            id: data.id,
            name: data.name || '',
            category: data.category || 'seragam',
            categoryLabel: data.categoryLabel || categoryLabels[data.category] || 'Seragam Sekolah',
            clientId: matchedClientId,
            client: data.client || '',
            specs: data.specs || data.customDetails || ''
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

  const handleClientChange = (clientId) => {
    const selected = clientsList.find((c) => String(c.id) === String(clientId))
    setFormData((prev) => ({
      ...prev,
      clientId,
      client: selected ? selected.name : ''
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

  const handleAddPhoto = () => {
    setPhotos((prev) => [
      ...prev,
      {
        id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        url: '',
        file: null,
        gender: prev.length === 1 && prev[0].gender === 'Laki-laki' ? 'Perempuan' : 'Unisex'
      }
    ])
  }

  const handleRemovePhoto = (index) => {
    if (photos.length > 1) {
      setPhotos((prev) => prev.filter((_, i) => i !== index))
    }
  }

  const handleSetPrimaryPhoto = (index) => {
    if (index === 0) return
    setPhotos((prev) => {
      const target = prev[index]
      const remaining = prev.filter((_, i) => i !== index)
      return [target, ...remaining]
    })
  }

  const handlePhotoFileSelected = (index, file) => {
    setPhotos((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], file }
      return next
    })
  }

  const handlePhotoUrlChanged = (index, url) => {
    setPhotos((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], url }
      return next
    })
  }

  const handlePhotoGenderChanged = (index, gender) => {
    setPhotos((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], gender }
      return next
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setError('Nama model busana wajib diisi')
      return
    }

    let finalClientId = formData.clientId
    if (!finalClientId && formData.client) {
      const match = clientsList.find((c) => c.name.toLowerCase() === formData.client.trim().toLowerCase())
      if (match) finalClientId = match.id
    }
    if (!finalClientId && !formData.client) {
      setError('Silakan pilih Instansi / Mitra Pemesan dari data klien')
      return
    }

    const hasAnyPhoto = photos.some((p) => p.file || (p.url && p.url.trim()))
    if (!hasAnyPhoto) {
      setError('Harap unggah minimal 1 foto model produk busana')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const uploadedImages = []
      for (const item of photos) {
        let finalUrl = item.url
        if (item.file) {
          finalUrl = await uploadToCloudinary(item.file)
        }
        if (finalUrl && finalUrl.trim()) {
          uploadedImages.push({
            url: finalUrl.trim(),
            gender: item.gender || 'Tanpa Badge'
          })
        }
      }

      if (uploadedImages.length === 0) {
        throw new Error('Gagal memproses foto produk. Harap unggah foto valid.')
      }

      const validMaterials = materials.map((m) => m.trim()).filter(Boolean)
      const slug = createSlug(formData.name) || product?.slug

      await saveKatalogItem({
        ...formData,
        id,
        clientId: finalClientId,
        slug,
        materials: validMaterials,
        material: validMaterials.join(', '),
        image: uploadedImages[0]?.url || '',
        images: uploadedImages
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
                Perbarui rincian spesifikasi, bahan, galeri foto gender, dan mitra klien pemesan.
              </p>
            </div>
          </div>

          <div className="admin-inline-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="submit"
              disabled={submitting}
              className="admin-action-icon-btn admin-action-icon-btn-primary"
              title={submitting ? 'Memperbarui...' : 'Simpan'}
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
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
                  <label className="admin-label" htmlFor="product-client-autocomplete">
                    Instansi / Mitra Pemesan (Dari Data Klien) <span style={{ color: 'var(--admin-danger)' }}>*</span>
                  </label>
                  <AdminClientAutocomplete
                    clients={clientsList}
                    value={formData.clientId}
                    clientName={formData.client}
                    onChange={({ clientId, clientName }) => {
                      setFormData((prev) => ({
                        ...prev,
                        clientId,
                        client: clientName
                      }))
                    }}
                    required
                    placeholder="Ketik untuk cari instansi / sekolah pemesan..."
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
                  rows={4}
                  className="admin-input"
                  style={{ resize: 'vertical', lineHeight: 1.6, minHeight: '100px' }}
                  placeholder="Tuliskan rincian spesifikasi jahitan jarum dua, tipe kancing, furing, bordir logo komputer, dsb..."
                  value={formData.specs}
                  onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                />
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--admin-border)', margin: '0.5rem 0 0 0' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--admin-text-main)' }}>
                    Galeri Foto Produk & Varian Gender
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--admin-text-muted)', marginTop: '0.125rem' }}>
                    Anda dapat menambahkan lebih dari 1 foto dengan label Laki-laki / Perempuan.
                  </div>
                </div>
                <button
                  type="button"
                  className="admin-btn admin-btn-primary"
                  onClick={handleAddPhoto}
                  style={{ padding: '0.45rem 0.875rem', fontSize: '0.8125rem' }}
                >
                  <Plus size={14} />
                  <span>Tambah Foto</span>
                </button>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))',
                  gap: '1.25rem'
                }}
              >
                {photos.map((item, idx) => (
                  <div key={item.id} className="admin-photo-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap', borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--admin-text-main)' }}>
                          Foto #{idx + 1}
                        </span>
                        {idx === 0 ? (
                          <span className="admin-badge admin-badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Star size={10} />
                            Foto Cover Utama
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryPhoto(idx)}
                            className="admin-action-icon-btn"
                            title="Jadikan Foto Utama / Cover"
                            aria-label="Jadikan Foto Utama / Cover"
                            style={{ height: '24px', padding: '0 0.5rem', fontSize: '0.6875rem', borderRadius: '4px' }}
                          >
                            Jadikan Utama
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {photos.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(idx)}
                            className="admin-action-icon-btn admin-action-icon-btn-danger"
                            title="Hapus Foto Ini"
                            aria-label="Hapus Foto Ini"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <label className="admin-label" style={{ margin: 0, fontSize: '0.78125rem', whiteSpace: 'nowrap' }}>
                        Badge Gender / Varian:
                      </label>
                      <select
                        className="admin-select"
                        value={item.gender || 'Tanpa Badge'}
                        onChange={(e) => handlePhotoGenderChanged(idx, e.target.value)}
                        style={{ height: '34px', fontSize: '0.8125rem', width: 'auto', minWidth: '140px' }}
                      >
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                        <option value="Unisex">Unisex</option>
                        <option value="Tanpa Badge">Tanpa Badge</option>
                      </select>
                      {item.gender && item.gender !== 'Tanpa Badge' ? (
                        <span
                          className={`admin-badge ${
                            item.gender === 'Laki-laki'
                              ? 'admin-badge-male'
                              : item.gender === 'Perempuan'
                              ? 'admin-badge-female'
                              : 'admin-badge-unisex'
                          }`}
                        >
                          {item.gender}
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-subtle)' }}>
                          (Tanpa Badge)
                        </span>
                      )}
                    </div>

                    <AdminImageUploader
                      label=""
                      ratioHint="Rasio 4:3 (Landscape, misal 800 x 600 px)"
                      currentImage={item.url}
                      selectedFile={item.file}
                      onFileSelected={(file) => handlePhotoFileSelected(idx, file)}
                      onUrlChanged={(url) => handlePhotoUrlChanged(idx, url)}
                      folder="azhar/products"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
