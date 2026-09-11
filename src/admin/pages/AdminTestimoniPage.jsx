import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit2, Trash2, Star, MessageCircle, Eye, User, Search } from 'lucide-react'
import AdminPagination from '../components/AdminPagination'
import { getTestimonialList, deleteTestimonialItem } from '../../firebase/adminService'
import { showDeleteConfirm, showToast, showErrorAlert } from '../utils/swal'

export default function AdminTestimoniPage() {
  const [testis, setTestis] = useState([])
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

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

  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  const handleDelete = async (t) => {
    const name = t.clientName || t.name || 'Klien'
    const res = await showDeleteConfirm({
      title: 'Hapus Ulasan Testimoni?',
      text: `Apakah Anda yakin ingin menghapus testimoni dari "${name}"? Data yang dihapus tidak dapat dipulihkan.`
    })
    if (res.isConfirmed) {
      try {
        await deleteTestimonialItem(t.id)
        setTestis((prev) => prev.filter((item) => item.id !== t.id))
        showToast({ icon: 'success', title: 'Testimoni berhasil dihapus' })
      } catch (err) {
        showErrorAlert('Gagal Menghapus', err?.message)
      }
    }
  }

  const filteredTestis = testis.filter((t) => {
    const q = search.toLowerCase()
    return (
      (t.clientName || t.name || '').toLowerCase().includes(q) ||
      (t.role || t.institution || '').toLowerCase().includes(q) ||
      (t.comment || t.quote || '').toLowerCase().includes(q)
    )
  })

  const totalPages = Math.ceil(filteredTestis.length / itemsPerPage) || 1
  const paginatedTestis = filteredTestis.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Ulasan & Testimoni Mitra</h1>
          <p className="admin-page-desc">
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
        <div className="admin-card-header admin-table-card-header">
          <div className="admin-table-tools">
            <div className="admin-table-search-box">
              <input
                type="text"
                placeholder="Cari ulasan / klien..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="admin-input"
                style={{ paddingLeft: '2.25rem' }}
              />
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--admin-text-subtle)'
                }}
              />
            </div>

            <Link
              to="/admin/testimoni/tambah"
              className="admin-action-icon-btn admin-action-icon-btn-primary"
              title="Tambah Testimoni Baru"
              aria-label="Tambah Testimoni Baru"
            >
              <Plus size={16} />
            </Link>
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
              {filteredTestis.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--admin-text-muted)' }}>
                    <MessageCircle size={36} style={{ margin: '0 auto 0.75rem auto', opacity: 0.4 }} />
                    <p style={{ margin: 0, fontWeight: 600 }}>Belum ada testimoni tersedia.</p>
                  </td>
                </tr>
              ) : (
                paginatedTestis.map((t) => (
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
                          onClick={() => handleDelete(t)}
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

        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredTestis.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}
