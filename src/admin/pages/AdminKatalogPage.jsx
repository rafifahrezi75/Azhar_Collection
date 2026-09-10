import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Edit2, Trash2, Shirt, Image as ImageIcon, Eye } from 'lucide-react'
import AdminModal from '../components/AdminModal'
import { getKatalogList, deleteKatalogItem } from '../../firebase/adminService'

export default function AdminKatalogPage() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

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

  const handleDelete = async () => {
    if (!deleteConfirmId) return
    await deleteKatalogItem(deleteConfirmId)
    await loadData()
    setDeleteConfirmId(null)
  }

  const filteredItems = items.filter((item) => {
    const matchSearch =
      (item.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.client || '').toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === 'all' || item.category === categoryFilter
    return matchSearch && matchCat
  })

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h1 className="admin-page-title" style={{ margin: 0 }}>Katalog Produk & Portofolio</h1>
            <div className="admin-inline-actions">
              <Link
                to="/admin/katalog/tambah"
                className="admin-action-icon-btn admin-action-icon-btn-primary"
                title="Tambah Produk Baru"
                aria-label="Tambah Produk Baru"
              >
                <Plus size={18} />
              </Link>
            </div>
          </div>
          <p className="admin-page-desc" style={{ margin: '0.25rem 0 0 0' }}>
            Kelola model busana, spesifikasi kain, foto seragam, dan badge yang tampil di website.
          </p>
        </div>

        <div className="admin-breadcrumbs">
          <Link to="/admin">Admin</Link>
          <span>/</span>
          <span className="current">Katalog Produk</span>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', minWidth: '220px', maxWidth: '340px', flex: 1 }}>
              <input
                type="text"
                placeholder="Cari model busana / mitra..."
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

            <select
              className="admin-select"
              style={{ width: 'auto', minWidth: '180px' }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">Semua Kategori</option>
              <option value="seragam">Seragam Sekolah</option>
              <option value="batik">Batik Identitas</option>
              <option value="kemeja">Kemeja PDH / PDL</option>
              <option value="jas">Jas Almamater</option>
              <option value="jaket">Jaket & Rompi</option>
              <option value="kaos">Kaos & Olahraga</option>
            </select>
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
                <th>Badge</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--admin-text-muted)' }}>
                    <Shirt size={36} style={{ margin: '0 auto 0.75rem auto', opacity: 0.4 }} />
                    <p style={{ margin: 0, fontWeight: 600 }}>Tidak ada produk katalog ditemukan.</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
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
                          <div style={{ fontSize: '0.71875rem', color: 'var(--admin-text-subtle)' }}>
                            ID: {item.id}
                          </div>
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
                    <td>
                      <span className="admin-badge admin-badge-success">{item.badge || 'Standar'}</span>
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
                          onClick={() => setDeleteConfirmId(item.id)}
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
      </div>

      <AdminModal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        title="Konfirmasi Hapus Produk"
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
          Apakah Anda yakin ingin menghapus produk katalog ini? Data yang dihapus tidak dapat dipulihkan kembali.
        </p>
      </AdminModal>
    </div>
  )
}
