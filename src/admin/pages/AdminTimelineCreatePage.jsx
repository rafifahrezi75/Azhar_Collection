import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Loader2, Calendar, Tag, Type, AlignLeft, Hash } from 'lucide-react'
import { saveTimelineItem, getTimelineList } from '../../firebase/adminService'
import { showSuccessAlert, showErrorAlert } from '../utils/swal'

export default function AdminTimelineCreatePage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    year: '',
    badge: '',
    title: '',
    desc: '',
    order: 1
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    getTimelineList().then((list) => {
      if (isMounted && list && list.length > 0) {
        const maxOrder = list.reduce((max, item) => Math.max(max, Number(item.order) || 0), 0)
        setFormData((prev) => ({ ...prev, order: maxOrder + 1 }))
      }
    })
    return () => {
      isMounted = false
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.year.trim() || !formData.title.trim()) {
      setError('Tahun/Periode dan Judul Milestone wajib diisi.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      await saveTimelineItem({
        year: formData.year.trim(),
        badge: formData.badge.trim() || 'Milestone',
        title: formData.title.trim(),
        desc: formData.desc.trim(),
        order: Number(formData.order) || 1
      })

      await showSuccessAlert('Milestone Disimpan', 'Data perjalanan karir baru berhasil ditambahkan.')
      navigate('/admin/karir')
    } catch (err) {
      const errMsg = err?.message || 'Gagal menyimpan data milestone.'
      setError(errMsg)
      await showErrorAlert('Gagal Menyimpan', errMsg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Tambah Milestone Karir Baru</h1>
          <p className="admin-page-desc">
            Tambahkan tahapan rekam jejak dan pencapaian perjalanan usaha Azhar Collection.
          </p>
        </div>

        <div className="admin-breadcrumbs">
          <Link to="/admin">Admin</Link>
          <span>/</span>
          <Link to="/admin/karir">Perjalanan Karir</Link>
          <span>/</span>
          <span className="current">Tambah</span>
        </div>
      </div>

      <div className="admin-card">
        <div
          className="admin-card-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
            padding: '1rem 1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/admin/karir" className="admin-back-btn" title="Kembali" aria-label="Kembali">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h2 className="admin-card-title" style={{ margin: 0 }}>Formulir Milestone Karir</h2>
              <p className="admin-card-subtitle" style={{ margin: '0.25rem 0 0 0' }}>
                Lengkapi rincian tahun, badge status, judul, dan deskripsi histori.
              </p>
            </div>
          </div>

          <div className="admin-inline-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="submit"
              disabled={submitting}
              className="admin-action-icon-btn admin-action-icon-btn-primary"
              title={submitting ? 'Menyimpan...' : 'Simpan Milestone'}
              aria-label="Simpan Milestone"
            >
              {submitting ? <Loader2 size={16} className="spin-animation" /> : <Save size={16} />}
            </button>
          </div>
        </div>

        <div style={{ padding: '1.25rem' }}>
          {error && (
            <div className="admin-alert admin-alert-danger" style={{ marginBottom: '1.25rem' }}>
              <span>{error}</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className="admin-form-group">
              <label className="admin-label" htmlFor="timeline-year">
                Tahun / Periode <span style={{ color: 'var(--admin-danger)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Calendar
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--admin-text-subtle)',
                    pointerEvents: 'none'
                  }}
                />
                <input
                  id="timeline-year"
                  type="text"
                  required
                  className="admin-input"
                  style={{ paddingLeft: '2.25rem' }}
                  placeholder="Contoh: 2004 atau 2024 - Sekarang"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label" htmlFor="timeline-badge">
                Label Badge
              </label>
              <div style={{ position: 'relative' }}>
                <Tag
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--admin-text-subtle)',
                    pointerEvents: 'none'
                  }}
                />
                <input
                  id="timeline-badge"
                  type="text"
                  className="admin-input"
                  style={{ paddingLeft: '2.25rem' }}
                  placeholder="Contoh: Langkah Pertama, Teknologi Modern"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label" htmlFor="timeline-order">
                Urutan Tampilan
              </label>
              <div style={{ position: 'relative' }}>
                <Hash
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--admin-text-subtle)',
                    pointerEvents: 'none'
                  }}
                />
                <input
                  id="timeline-order"
                  type="number"
                  min="1"
                  className="admin-input"
                  style={{ paddingLeft: '2.25rem' }}
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="admin-form-group" style={{ marginTop: '1rem' }}>
            <label className="admin-label" htmlFor="timeline-title">
              Judul Milestone <span style={{ color: 'var(--admin-danger)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Type
                size={16}
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--admin-text-subtle)',
                  pointerEvents: 'none'
                }}
              />
              <input
                id="timeline-title"
                type="text"
                required
                className="admin-input"
                style={{ paddingLeft: '2.25rem' }}
                placeholder="Contoh: Modernisasi Mesin Bordir Komputer"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-form-group" style={{ marginTop: '1rem' }}>
            <label className="admin-label" htmlFor="timeline-desc">
              Deskripsi / Rincian Histori
            </label>
            <div style={{ position: 'relative' }}>
              <AlignLeft
                size={16}
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '1rem',
                  color: 'var(--admin-text-subtle)',
                  pointerEvents: 'none'
                }}
              />
              <textarea
                id="timeline-desc"
                rows={4}
                className="admin-textarea"
                style={{ paddingLeft: '2.25rem' }}
                placeholder="Jelaskan secara ringkas perkembangan atau pencapaian pada milestone ini..."
                value={formData.desc}
                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
