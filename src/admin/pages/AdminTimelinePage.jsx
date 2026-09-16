import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Edit2, Trash2, Calendar, Eye, ArrowUp, ArrowDown } from 'lucide-react'
import AdminPagination from '../components/AdminPagination'
import { getTimelineList, deleteTimelineItem, reorderTimelineList } from '../../firebase/adminService'
import { showDeleteConfirm, showToast, showErrorAlert } from '../utils/swal'

export default function AdminTimelinePage() {
  const [timelineList, setTimelineList] = useState([])
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  useEffect(() => {
    let isMounted = true
    getTimelineList().then((list) => {
      if (isMounted && list) {
        const sorted = [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        setTimelineList(sorted)
      }
    })
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  const handleDelete = async (item) => {
    const res = await showDeleteConfirm({
      title: 'Hapus Milestone Karir?',
      text: `Apakah Anda yakin ingin menghapus "${item.title}"? Data yang dihapus tidak dapat dipulihkan.`
    })
    if (res.isConfirmed) {
      try {
        await deleteTimelineItem(item.id)
        setTimelineList((prev) => prev.filter((t) => t.id !== item.id))
        showToast({ icon: 'success', title: 'Milestone karir berhasil dihapus' })
      } catch (err) {
        showErrorAlert('Gagal Menghapus', err?.message)
      }
    }
  }

  const handleMoveUp = async (globalIndex) => {
    if (globalIndex <= 0) return
    const newList = [...timelineList]
    const temp = newList[globalIndex]
    newList[globalIndex] = newList[globalIndex - 1]
    newList[globalIndex - 1] = temp

    const reordered = newList.map((item, i) => ({
      ...item,
      order: i + 1
    }))

    setTimelineList(reordered)

    try {
      const saved = await reorderTimelineList(reordered)
      setTimelineList(saved)
      showToast({ icon: 'success', title: 'Urutan milestone diperbarui' })
    } catch (err) {
      showErrorAlert('Gagal Mengubah Urutan', err?.message)
    }
  }

  const handleMoveDown = async (globalIndex) => {
    if (globalIndex >= timelineList.length - 1) return
    const newList = [...timelineList]
    const temp = newList[globalIndex]
    newList[globalIndex] = newList[globalIndex + 1]
    newList[globalIndex + 1] = temp

    const reordered = newList.map((item, i) => ({
      ...item,
      order: i + 1
    }))

    setTimelineList(reordered)

    try {
      const saved = await reorderTimelineList(reordered)
      setTimelineList(saved)
      showToast({ icon: 'success', title: 'Urutan milestone diperbarui' })
    } catch (err) {
      showErrorAlert('Gagal Mengubah Urutan', err?.message)
    }
  }

  const filteredItems = timelineList.filter((item) => {
    const query = search.toLowerCase()
    return (
      (item.title || '').toLowerCase().includes(query) ||
      (item.year || '').toLowerCase().includes(query) ||
      (item.badge || '').toLowerCase().includes(query) ||
      (item.desc || '').toLowerCase().includes(query)
    )
  })

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Perjalanan Karir & Rekam Jejak</h1>
          <p className="admin-page-desc">
            Kelola tahapan milestone histori dan rekam jejak pertumbuhan usaha Azhar Collection. Gunakan tombol panah di kolom Posisi untuk memindahkan posisi urutan.
          </p>
        </div>

        <div className="admin-breadcrumbs">
          <Link to="/admin">Admin</Link>
          <span>/</span>
          <span className="current">Perjalanan Karir</span>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header admin-table-card-header">
          <div className="admin-table-tools">
            <div className="admin-table-search-box">
              <input
                type="text"
                placeholder="Cari tahun, judul, atau kata kunci..."
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
              to="/admin/karir/tambah"
              className="admin-action-icon-btn admin-action-icon-btn-primary"
              title="Tambah Milestone Baru"
              aria-label="Tambah Milestone Baru"
            >
              <Plus size={16} />
            </Link>
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '70px', textAlign: 'center' }}>Posisi</th>
                <th style={{ width: '70px' }}>Urutan</th>
                <th style={{ width: '130px' }}>Tahun</th>
                <th>Label Badge</th>
                <th>Judul Milestone</th>
                <th>Deskripsi Singkat</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--admin-text-muted)' }}>
                    <Calendar size={36} style={{ margin: '0 auto 0.75rem auto', opacity: 0.4 }} />
                    <p style={{ margin: 0, fontWeight: 600 }}>Tidak ada milestone karir ditemukan.</p>
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item, index) => {
                  const globalIndex = (currentPage - 1) * itemsPerPage + index
                  const displayOrder = item.order ?? globalIndex + 1

                  return (
                    <tr key={item.id}>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                          <button
                            type="button"
                            onClick={() => handleMoveUp(globalIndex)}
                            disabled={globalIndex === 0}
                            className="admin-icon-btn"
                            style={{ opacity: globalIndex === 0 ? 0.3 : 1, padding: '0.15rem' }}
                            title="Naikkan Urutan"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveDown(globalIndex)}
                            disabled={globalIndex === timelineList.length - 1}
                            className="admin-icon-btn"
                            style={{ opacity: globalIndex === timelineList.length - 1 ? 0.3 : 1, padding: '0.15rem' }}
                            title="Turunkan Urutan"
                          >
                            <ArrowDown size={14} />
                          </button>
                        </div>
                      </td>
                      <td>
                        <span className="admin-badge admin-badge-subtle">
                          #{displayOrder}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--admin-primary)' }}>{item.year}</span>
                      </td>
                      <td>
                        <span className="admin-badge admin-badge-primary">{item.badge}</span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{item.title}</div>
                      </td>
                      <td style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.desc || '-'}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.375rem' }}>
                          <Link
                            to={`/admin/karir/detail/${item.id}`}
                            className="admin-icon-btn"
                            title="Lihat Detail Milestone"
                          >
                            <Eye size={15} />
                          </Link>
                          <Link
                            to={`/admin/karir/edit/${item.id}`}
                            className="admin-icon-btn"
                            title="Ubah Milestone"
                          >
                            <Edit2 size={15} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            className="admin-icon-btn"
                            style={{ color: 'var(--admin-danger)' }}
                            title="Hapus Milestone"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredItems.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}
