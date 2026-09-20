import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Edit2, Trash2, Shirt, Image as ImageIcon, Eye } from 'lucide-react'
import AdminPagination from '../components/AdminPagination'
import { getKatalogList, deleteKatalogItem } from '../../firebase/adminService'
import { showDeleteConfirm, showToast, showErrorAlert } from '../utils/swal'

export default function AdminKatalogPage() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const loadData = async () => {
    const list = await getKatalogList()
    setItems(list)
  }

  useEffect(() => {
    let isMounted = true
    getKatalogList().then((list) => {
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
      title: 'Hapus Model Busana?',
      text: `Apakah Anda yakin ingin menghapus "${item.name}" dari katalog? Data yang dihapus tidak dapat dipulihkan.`
    })
    if (res.isConfirmed) {
      try {
        await deleteKatalogItem(item.id, item.image)
        setItems((prev) => prev.filter((it) => it.id !== item.id))
        showToast({ icon: 'success', title: 'Model busana berhasil dihapus' })
      } catch (err) {
        showErrorAlert('Gagal Menghapus', err?.message)
      }
    }
  }

  const filteredItems = items.filter((item) => {
    const matchSearch =
      (item.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.client || '').toLowerCase().includes(search.toLowerCase())
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
          <h1 className="admin-page-title">Katalog Produk & Portofolio</h1>
          <p className="admin-page-desc">
            Kelola model busana, spesifikasi kain, dan foto seragam yang tampil di website.
          </p>
        </div>

        <div className="admin-breadcrumbs">
          <Link to="/admin">Admin</Link>
          <span>/</span>
          <span className="current">Katalog Produk</span>
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
              <option value="seragam">Seragam Sekolah</option>
              <option value="batik">Batik Identitas</option>
              <option value="kemeja">Kemeja PDH / PDL</option>
              <option value="jas">Jas Almamater</option>
              <option value="jaket">Jaket & Rompi</option>
              <option value="kaos">Kaos & Olahraga</option>
            </select>

            <div className="admin-table-search-box">
              <input
                type="text"
                placeholder="Cari model busana / pemesan..."
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
              to="/admin/katalog/tambah"
              className="admin-action-icon-btn admin-action-icon-btn-primary"
              title="Tambah Model Busana Baru"
              aria-label="Tambah Model Busana Baru"
            >
              <Plus size={16} />
            </Link>
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Produk</th>
                <th>Kategori</th>
                <th>Mitra Pemesan</th>
                <th>Bahan Utama</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--admin-text-muted)' }}>
                    <Shirt size={36} style={{ margin: '0 auto 0.75rem auto', opacity: 0.4 }} />
                    <p style={{ margin: 0, fontWeight: 600 }}>Tidak ada produk katalog ditemukan.</p>
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
                              alt={item.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <ImageIcon size={20} style={{ color: 'var(--admin-text-subtle)' }} />
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800 }}>{item.name}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="admin-badge admin-badge-primary">
                        {item.categoryLabel || item.category}
                      </span>
                    </td>
                    <td>{item.client || '-'}</td>
                    <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.material || '-'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.375rem' }}>
                        <Link
                          to={`/admin/katalog/detail/${item.id}`}
                          className="admin-icon-btn"
                          title="Lihat Detail Produk"
                        >
                          <Eye size={15} />
                        </Link>
                        <Link
                          to={`/admin/katalog/edit/${item.id}`}
                          className="admin-icon-btn"
                          title="Ubah Produk"
                        >
                          <Edit2 size={15} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="admin-icon-btn"
                          style={{ color: 'var(--admin-danger)' }}
                          title="Hapus Produk"
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
