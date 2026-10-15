import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, AlertCircle, Loader2, Plus, Trash2, Star, ArrowUp, ArrowDown, Image as ImageIcon } from 'lucide-react'
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

  const [coverUrl, setCoverUrl] = useState('')
  const [coverFile, setCoverFile] = useState(null)
  const [variantPhotos, setVariantPhotos] = useState([])

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

          const rawCover = data.image || (Array.isArray(data.images) && data.images[0] ? (typeof data.images[0] === 'string' ? data.images[0] : data.images[0].url) : '')
          setCoverUrl(rawCover || '')
          let initialVariants = []
          if (Array.isArray(data.images) && data.images.length > 0) {
            initialVariants = data.images
              .filter((img) => {
                const u = typeof img === 'string' ? img : img?.url
                return u && (!rawCover || u !== rawCover)
              })
              .map((img, idx) => ({
                id: `v-${idx + 1}`,
                url: typeof img === 'string' ? img : img.url || '',
                file: null,
                gender: typeof img === 'object' && img.gender ? img.gender : 'Tanpa Badge'
              }))
          }
          setVariantPhotos(initialVariants)

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

  const handleAddVariantPhoto = () => {
    setVariantPhotos((prev) => [
      ...prev,
      {
        id: `v-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        url: '',
        file: null,
        gender: prev.length === 0 ? 'Laki-laki' : prev.length === 1 ? 'Perempuan' : 'Unisex'
      }
    ])
  }

  const handleRemoveVariantPhoto = (index) => {
    setVariantPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleVariantFileSelected = (index, file) => {
    setVariantPhotos((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], file }
      return next
    })
  }

  const handleVariantUrlChanged = (index, url) => {
    setVariantPhotos((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], url }
      return next
    })
  }

  const handleVariantGenderChanged = (index, gender) => {
    setVariantPhotos((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], gender }
      return next
    })
  }

  const handleMoveVariantPhoto = (index, direction) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= variantPhotos.length) return
    setVariantPhotos((prev) => {
      const next = [...prev]
      const temp = next[index]
      next[index] = next[targetIndex]
      next[targetIndex] = temp
      return next
    })
  }

  const handleMakeCover = (index) => {
    const target = variantPhotos[index]
    if (!target) return

    const oldCoverUrl = coverUrl
    const oldCoverFile = coverFile

    setCoverUrl(target.url || '')
    setCoverFile(target.file || null)

    setVariantPhotos((prev) => {
      const next = [...prev]
      if (oldCoverUrl || oldCoverFile) {
        next[index] = {
          id: `v-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          url: oldCoverUrl,
          file: oldCoverFile,
          gender: 'Tanpa Badge'
        }
      } else {
        next.splice(index, 1)
      }
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

    if (!coverFile && (!coverUrl || !coverUrl.trim())) {
      setError('Harap unggah Foto Cover Utama produk')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      let finalCoverUrl = coverUrl
      if (coverFile) {
        finalCoverUrl = await uploadToCloudinary(coverFile)
      }

      if (!finalCoverUrl || !finalCoverUrl.trim()) {
        throw new Error('Gagal memproses Foto Cover Utama. Harap unggah foto valid.')
      }

      const uploadedVariants = []
      for (const item of variantPhotos) {
        let finalUrl = item.url
        if (item.file) {
          finalUrl = await uploadToCloudinary(item.file)
        }
        if (finalUrl && finalUrl.trim()) {
          uploadedVariants.push({
            url: finalUrl.trim(),
            gender: item.gender || 'Tanpa Badge'
          })
        }
      }

      const validMaterials = materials.map((m) => m.trim()).filter(Boolean)
      const slug = createSlug(formData.name) || formData.slug

      await saveKatalogItem({
        ...formData,
        id: formData.id || id,
        clientId: finalClientId,
        slug,
        materials: validMaterials,
        material: validMaterials.join(', '),
        image: finalCoverUrl.trim(),
        images: uploadedVariants
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
                Perbarui foto cover utama, rincian spesifikasi, bahan, galeri foto gender, dan mitra klien pemesan.
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--admin-text-main)' }}>
                    Foto Cover Utama Produk <span style={{ color: 'var(--admin-danger)' }}>*</span>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--admin-text-muted)', marginTop: '0.125rem' }}>
                    Foto utama yang tampil di kartu katalog depan dan tampilan awal saat membuka detail produk.
                  </div>
                </div>
                <span className="admin-badge admin-badge-primary">Cover Utama</span>
              </div>

              <div style={{ maxWidth: '480px' }}>
                <AdminImageUploader
                  label=""
                  ratioHint="Rasio 4:3 (Landscape, misal 800 x 600 px)"
                  currentImage={coverUrl}
                  selectedFile={coverFile}
                  onFileSelected={(file) => setCoverFile(file)}
                  onUrlChanged={(url) => setCoverUrl(url)}
                  folder="azhar/products"
                />
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--admin-border)', margin: '0.5rem 0 0 0' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--admin-text-main)' }}>
                    Galeri Foto Varian Model (Opsional)
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--admin-text-muted)', marginTop: '0.125rem' }}>
                    Tambahkan foto model busana dengan badge khusus seperti Laki-laki, Perempuan, Unisex, atau Tanpa Badge.
                  </div>
                </div>
                <button
                  type="button"
                  className="admin-btn admin-btn-primary"
                  onClick={handleAddVariantPhoto}
                  style={{ padding: '0.45rem 0.875rem', fontSize: '0.8125rem' }}
                >
                  <Plus size={14} />
                  <span>Tambah Foto Varian</span>
                </button>
              </div>

              {variantPhotos.length === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', border: '1px dashed var(--admin-border)', borderRadius: 'var(--admin-radius)', color: 'var(--admin-text-muted)', fontSize: '0.8125rem' }}>
                  Belum ada foto varian tambahan. Klik tombol <strong>Tambah Foto Varian</strong> di atas jika ingin menambahkan foto model Laki-laki atau Perempuan.
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))',
                    gap: '1.25rem'
                  }}
                >
                  {variantPhotos.map((item, idx) => (
                    <div key={item.id} className="admin-photo-card">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap', borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--admin-text-main)' }}>
                          Foto Varian #{idx + 1}
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <button
                            type="button"
                            onClick={() => handleMakeCover(idx)}
                            className="admin-action-icon-btn"
                            title="Jadikan Foto Cover Utama"
                            aria-label="Jadikan Foto Cover Utama"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', height: '26px', padding: '0 0.5rem', fontSize: '0.6875rem', borderRadius: '4px' }}
                          >
                            <Star size={12} />
                            <span>Jadikan Cover</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveVariantPhoto(idx, -1)}
                            disabled={idx === 0}
                            className="admin-action-icon-btn"
                            title="Geser Urutan ke Atas / Kiri"
                            aria-label="Geser Urutan ke Atas"
                            style={{ opacity: idx === 0 ? 0.35 : 1, cursor: idx === 0 ? 'not-allowed' : 'pointer' }}
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveVariantPhoto(idx, 1)}
                            disabled={idx === variantPhotos.length - 1}
                            className="admin-action-icon-btn"
                            title="Geser Urutan ke Bawah / Kanan"
                            aria-label="Geser Urutan ke Bawah"
                            style={{ opacity: idx === variantPhotos.length - 1 ? 0.35 : 1, cursor: idx === variantPhotos.length - 1 ? 'not-allowed' : 'pointer' }}
                          >
                            <ArrowDown size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveVariantPhoto(idx)}
                            className="admin-action-icon-btn admin-action-icon-btn-danger"
                            title="Hapus Foto Varian Ini"
                            aria-label="Hapus Foto Varian Ini"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <label className="admin-label" style={{ margin: 0, fontSize: '0.78125rem', whiteSpace: 'nowrap' }}>
                          Badge Gender / Varian:
                        </label>
                        <select
                          className="admin-select"
                          value={item.gender || 'Tanpa Badge'}
                          onChange={(e) => handleVariantGenderChanged(idx, e.target.value)}
                          style={{ height: '34px', fontSize: '0.8125rem', width: 'auto', minWidth: '140px' }}
                        >
                          <option value="Laki-laki">Laki-laki</option>
                          <option value="Perempuan">Perempuan</option>
                          <option value="Unisex">Unisex</option>
                          <option value="Tanpa Badge">Tanpa Badge</option>
                        </select>
                        {item.gender && item.gender !== 'Tanpa Badge' && (
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
                        )}
                      </div>

                      <AdminImageUploader
                        label=""
                        ratioHint="Rasio 4:3 (Landscape, misal 800 x 600 px)"
                        currentImage={item.url}
                        selectedFile={item.file}
                        onFileSelected={(file) => handleVariantFileSelected(idx, file)}
                        onUrlChanged={(url) => handleVariantUrlChanged(idx, url)}
                        folder="azhar/products"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
