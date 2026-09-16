import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Edit2, Trash2, Eye, Calendar, Images, Image as ImageIcon, X } from 'lucide-react'
import AdminPagination from '../components/AdminPagination'
import { getBeritaList, deleteBeritaItem } from '../../firebase/adminService'
import { showDeleteConfirm, showToast, showErrorAlert } from '../utils/swal'

const toInputDateFormat = (dateStr) => {
  if (!dateStr) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr
  if (/^\d{4}-\d{2}$/.test(dateStr)) return dateStr
  const months = {
    januari: '01', februari: '02', maret: '03', april: '04',
    mei: '05', juni: '06', juli: '07', agustus: '08',
    september: '09', oktober: '10', november: '11', desember: '12'
  }
  const parts = dateStr.trim().split(/\s+/)
  if (parts.length >= 3) {
    const day = parts[0].padStart(2, '0')
    const month = months[parts[1].toLowerCase()] || '01'
    const year = parts[2]
    return `${year}-${month}-${day}`
  }
  if (parts.length === 2) {
    const month = months[parts[0].toLowerCase()] || '01'
    const year = parts[1]
    return `${year}-${month}`
  }
  const parsed = new Date(dateStr)
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0]
  }
  return ''
}

export default function AdminBeritaPage() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  useEffect(() => {
    let isMounted = true
    getBeritaList().then((list) => {
      if (isMounted && list) setItems(list)
    })
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [search, dateFilter])

  const handleDelete = async (item) => {
    const res = await showDeleteConfirm({
      title: 'Hapus Foto Galeri?',
      text: 'Apakah Anda yakin ingin menghapus foto dokumentasi ini? Data yang dihapus tidak dapat dipulihkan.'
    })
    if (res.isConfirmed) {
      try {
        await deleteBeritaItem(item.id)
        setItems((prev) => prev.filter((it) => String(it.id) !== String(item.id)))
        showToast({ icon: 'success', title: 'Foto galeri berhasil dihapus' })
      } catch (err) {
        showErrorAlert('Gagal Menghapus', err?.message)
      }
    }
  }

  const filteredItems = items
    .filter((item) => {
      const matchSearch = (item.title || '').toLowerCase().includes(search.toLowerCase()) ||
        (item.date || '').toLowerCase().includes(search.toLowerCase()) ||
        String(item.id || '').toLowerCase().includes(search.toLowerCase())
      const formattedItemDate = toInputDateFormat(item.date)
      const matchDate = !dateFilter || formattedItemDate.startsWith(dateFilter)
      return matchSearch && matchDate
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
          <h1 className="admin-page-title">Galeri Foto Dokumentasi</h1>
          <p className="admin-page-desc">
            Kelola foto dokumentasi aktivitas workshop, pengerjaan bordir, dan hasil penjahitan busana Azhar Collection.
          </p>
        </div>

        <div className="admin-breadcrumbs">
          <Link to="/admin">Admin</Link>
          <span>/</span>
          <span className="current">Galeri Foto</span>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header admin-table-card-header">
          <div className="admin-table-tools" style={{ width: '100%', justifyContent: 'space-between' }}>
            <div className="admin-table-search-box" style={{ maxWidth: '340px' }}>
              <input
                type="text"
                placeholder="Cari kata kunci..."
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="admin-input"
                title="Filter berdasarkan tanggal upload"
                style={{ minWidth: '150px' }}
              />
              {dateFilter && (
                <button
                  type="button"
                  onClick={() => setDateFilter('')}
                  className="admin-icon-btn"
                  title="Reset filter tanggal"
                  aria-label="Reset filter tanggal"
                >
                  <X size={15} />
                </button>
              )}

              <Link
                to="/admin/galeri/tambah"
                className="admin-action-icon-btn admin-action-icon-btn-primary"
                title="Unggah Foto Galeri Baru"
                aria-label="Unggah Foto Galeri Baru"
              >
                <Plus size={16} />
              </Link>
            </div>
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Foto Dokumentasi</th>
                <th>Tanggal Upload</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={3} className="admin-table-empty">
                    <div style={{ padding: '3rem 1rem', textAlign: 'center' }}>
                      <Images size={40} style={{ margin: '0 auto 0.75rem auto', color: 'var(--admin-text-subtle)', opacity: 0.5 }} />
                      <p style={{ fontWeight: 600, color: 'var(--admin-text-main)', margin: '0 0 0.25rem 0' }}>
                        Tidak Ada Foto Galeri
                      </p>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-muted)', margin: 0 }}>
                        {search || dateFilter ? 'Tidak ditemukan foto pada tanggal atau kata kunci tersebut.' : 'Mulai unggah foto dokumentasi aktivitas konveksi Anda.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                        <div
                          style={{
                            width: '64px',
                            height: '52px',
                            borderRadius: 'var(--admin-radius)',
                            overflow: 'hidden',
                            backgroundColor: 'var(--admin-surface-hover)',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt="Foto Dokumentasi"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <ImageIcon size={20} style={{ color: 'var(--admin-text-subtle)' }} />
                          )}
                        </div>
                        <div>
                          <Link
                            to={`/admin/galeri/detail/${item.id}`}
                            className="admin-table-title-link"
                            style={{ fontWeight: 700, color: 'var(--admin-text-main)', display: 'block', lineHeight: 1.3 }}
                          >
                            {item.title || `Dokumentasi Foto #${item.id}`}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--admin-text-muted)' }}>
                        <Calendar size={13} />
                        <span>{item.date || '-'}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.375rem' }}>
                        <Link
                          to={`/admin/galeri/detail/${item.id}`}
                          className="admin-icon-btn"
                          title="Lihat Foto"
                        >
                          <Eye size={15} />
                        </Link>
                        <Link
                          to={`/admin/galeri/edit/${item.id}`}
                          className="admin-icon-btn"
                          title="Ubah Foto"
                        >
                          <Edit2 size={15} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="admin-icon-btn admin-icon-btn-danger"
                          title="Hapus Foto"
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

        {totalPages > 1 && (
          <div className="admin-card-footer">
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  )
}
