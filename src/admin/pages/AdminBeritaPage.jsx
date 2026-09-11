import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Edit2, Trash2, Newspaper, Eye, Calendar, Tag } from 'lucide-react'
import AdminPagination from '../components/AdminPagination'
import { getBeritaList, deleteBeritaItem } from '../../firebase/adminService'
import { showDeleteConfirm, showToast, showErrorAlert } from '../utils/swal'

export default function AdminBeritaPage() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const loadData = async () => {
    const list = await getBeritaList()
    setItems(list)
  }

  useEffect(() => {
    let isMounted = true
    getBeritaList().then((list) => {
      if (isMounted) setItems(list)
    })
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [search, categoryFilter])

  const handleDelete = async (item) => {
    const res = await showDeleteConfirm({
      title: 'Hapus Berita / Artikel?',
      text: `Apakah Anda yakin ingin menghapus artikel "${item.title}"? Data yang dihapus tidak dapat dipulihkan.`
    })
    if (res.isConfirmed) {
      try {
        await deleteBeritaItem(item.id)
        setItems((prev) => prev.filter((it) => String(it.id) !== String(item.id)))
        showToast({ icon: 'success', title: 'Artikel berita berhasil dihapus' })
      } catch (err) {
        showErrorAlert('Gagal Menghapus', err?.message)
      }
    }
  }

  const categories = Array.from(new Set(items.map((i) => i.category).filter(Boolean)))

  const filteredItems = items.filter((item) => {
    const matchSearch =
      (item.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.author || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.excerpt || '').toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === 'all' || item.category === categoryFilter
    return matchSearch && matchCat
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
          <h1 className="admin-page-title">Berita & Edukasi Busana</h1>
          <p className="admin-page-desc">
            Kelola publikasi artikel, panduan bahan kain, dan pengumuman seputar konveksi Azhar Collection.
          </p>
        </div>

        <div className="admin-breadcrumbs">
          <Link to="/admin">Admin</Link>
          <span>/</span>
          <span className="current">Berita & Artikel</span>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header admin-table-card-header">
          <div className="admin-table-tools">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="admin-select admin-table-select-filter"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <div className="admin-table-search-box">
              <input
                type="text"
                placeholder="Cari judul artikel / penulis..."
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
              to="/admin/berita/tambah"
              className="admin-action-icon-btn admin-action-icon-btn-primary"
              title="Tulis Artikel Berita Baru"
              aria-label="Tulis Artikel Berita Baru"
            >
              <Plus size={16} />
            </Link>
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Artikel</th>
                <th>Kategori</th>
                <th>Penulis</th>
                <th>Tanggal Rilis</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="admin-table-empty">
                    <div style={{ padding: '3rem 1rem', textAlign: 'center' }}>
                      <Newspaper size={40} style={{ margin: '0 auto 0.75rem auto', color: 'var(--admin-text-subtle)', opacity: 0.5 }} />
                      <p style={{ fontWeight: 600, color: 'var(--admin-text-main)', margin: '0 0 0.25rem 0' }}>
                        Tidak Ada Artikel Berita
                      </p>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--admin-text-muted)', margin: 0 }}>
                        {search || categoryFilter !== 'all' ? 'Coba ubah kata kunci atau filter pencarian Anda.' : 'Mulai publikasikan tulisan berita dan wawasan konveksi.'}
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
                            width: '46px',
                            height: '46px',
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
                              alt={item.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <Newspaper size={20} style={{ color: 'var(--admin-text-subtle)' }} />
                          )}
                        </div>
                        <div>
                          <Link
                            to={`/admin/berita/detail/${item.id}`}
                            className="admin-table-title-link"
                            style={{ fontWeight: 800, color: 'var(--admin-text-main)', display: 'block', lineHeight: 1.3 }}
                          >
                            {item.title}
                          </Link>
                          <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-subtle)', marginTop: '2px' }}>
                            {item.readTime || '3 Menit Baca'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="admin-badge admin-badge-primary">
                        {item.category || 'Berita'}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--admin-text-main)', fontWeight: 500 }}>
                        {item.author || '-'}
                      </span>
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
                          to={`/admin/berita/detail/${item.id}`}
                          className="admin-icon-btn"
                          title="Lihat Detail Artikel"
                        >
                          <Eye size={15} />
                        </Link>
                        <Link
                          to={`/admin/berita/edit/${item.id}`}
                          className="admin-icon-btn"
                          title="Ubah Artikel"
                        >
                          <Edit2 size={15} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="admin-icon-btn"
                          style={{ color: 'var(--admin-danger)' }}
                          title="Hapus Artikel"
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
          totalItems={filteredItems.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}
