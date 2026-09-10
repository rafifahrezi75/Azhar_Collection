import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit2, Trash2, Star, MessageCircle, Eye, User } from 'lucide-react'
import AdminModal from '../components/AdminModal'
import { getTestimonialList, deleteTestimonialItem } from '../../firebase/adminService'

export default function AdminTestimoniPage() {
  const [testis, setTestis] = useState([])
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  const loadData = async () => {
    const list = await getTestimonialList()
    setTestis(list)
  }

  useEffect(() => {
    let isMounted = true
    getTestimonialList().then((list) => {
      if (isMounted) setTestis(list)
    })
    return () => {
      isMounted = false
    }
  }, [])

  const handleDelete = async () => {
    if (!deleteConfirmId) return
    await deleteTestimonialItem(deleteConfirmId)
    await loadData()
    setDeleteConfirmId(null)
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h1 className="admin-page-title" style={{ margin: 0 }}>Ulasan & Testimoni Mitra</h1>
            <div className="admin-inline-actions">
              <Link
                to="/admin/testimoni/tambah"
                className="admin-action-icon-btn admin-action-icon-btn-primary"
                title="Tambah Testimoni Baru"
                aria-label="Tambah Testimoni Baru"
              >
                <Plus size={18} />
              </Link>
            </div>
          </div>
          <p className="admin-page-desc" style={{ margin: '0.25rem 0 0 0' }}>
            Kelola ulasan kepuasan, rating bintang, dan feedback institusi yang tampil di beranda website.
          </p>
        </div>

        <div className="admin-breadcrumbs">
          <Link to="/admin">Admin</Link>
          <span>/</span>
          <span className="current">Testimoni</span>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>
            Daftar Ulasan ({testis.length})
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Klien / Mitra</th>
                <th>Jabatan / Institusi</th>
                <th>Rating</th>
                <th>Kutipan Ulasan</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {testis.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--admin-text-muted)' }}>
                    <MessageCircle size={36} style={{ margin: '0 auto 0.75rem auto', opacity: 0.4 }} />
                    <p style={{ margin: 0, fontWeight: 600 }}>Belum ada testimoni tersedia.</p>
                  </td>
                </tr>
              ) : (
                testis.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            backgroundColor: 'var(--admin-surface-hover)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          {t.avatar || t.image ? (
                            <img
                              src={t.avatar || t.image}
                              alt={t.clientName || t.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <User size={18} style={{ color: 'var(--admin-text-subtle)' }} />
                          )}
                        </div>
                        <span style={{ fontWeight: 700 }}>{t.clientName || t.name}</span>
                      </div>
                    </td>
                    <td>{t.role || t.institution || '-'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '2px', color: 'var(--admin-warning)' }}>
                        {[...Array(t.rating || 5)].map((_, i) => (
                          <Star key={i} size={14} fill="currentColor" />
                        ))}
                      </div>
                    </td>
                    <td style={{ maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {typeof (t.comment || t.quote) === 'string'
                        ? (t.comment || t.quote).replace(/<[^>]+>/g, '')
                        : '-'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.375rem' }}>
                        <Link
                          to={`/admin/testimoni/detail/${t.id}`}
                          className="admin-icon-btn"
                          title="Lihat Detail Ulasan"
                        >
                          <Eye size={15} />
                        </Link>
                        <Link
                          to={`/admin/testimoni/edit/${t.id}`}
                          className="admin-icon-btn"
                          title="Ubah Testimoni"
                        >
                          <Edit2 size={15} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(t.id)}
                          className="admin-icon-btn"
                          style={{ color: 'var(--admin-danger)' }}
                          title="Hapus Testimoni"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AdminModal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        title="Konfirmasi Hapus Testimoni"
        maxWidth="440px"
        footer={
          <>
            <button
              type="button"
              onClick={() => setDeleteConfirmId(null)}
              className="admin-btn admin-btn-secondary"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="admin-btn admin-btn-danger"
            >
              Hapus Sekarang
            </button>
          </>
        }
      >
        <p style={{ margin: 0, fontSize: '0.875rem' }}>
          Apakah Anda yakin ingin menghapus ulasan testimoni ini? Data yang dihapus tidak dapat dipulihkan kembali.
        </p>
      </AdminModal>
    </div>
  )
}
