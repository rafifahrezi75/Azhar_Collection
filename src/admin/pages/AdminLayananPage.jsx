import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Edit2, Trash2, Scissors, Image as ImageIcon, Eye } from 'lucide-react'
import AdminPagination from '../components/AdminPagination'
import { getLayananList, deleteLayananItem } from '../../firebase/adminService'
import { showDeleteConfirm, showToast, showErrorAlert } from '../utils/swal'

export default function AdminLayananPage() {
  const [servicesList, setServicesList] = useState([])
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const loadData = async () => {
    const list = await getLayananList()
    setServicesList(list)
  }

  useEffect(() => {
    let isMounted = true
    getLayananList().then((list) => {
      if (isMounted) setServicesList(list)
    })
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  const handleDelete = async (service) => {
    const res = await showDeleteConfirm({
      title: 'Hapus Layanan Konveksi?',
      text: `Apakah Anda yakin ingin menghapus "${service.title}"? Data yang dihapus tidak dapat dipulihkan.`
    })
    if (res.isConfirmed) {
      try {
        await deleteLayananItem(service.id)
        setServicesList((prev) => prev.filter((s) => s.id !== service.id))
        showToast({ icon: 'success', title: 'Layanan berhasil dihapus' })
      } catch (err) {
        showErrorAlert('Gagal Menghapus', err?.message)
      }
    }
  }

  const filteredServices = servicesList.filter((service) => {
    const matchSearch =
      (service.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (service.shortDesc || '').toLowerCase().includes(search.toLowerCase()) ||
      (service.materials || '').toLowerCase().includes(search.toLowerCase())
    return matchSearch
  })

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage) || 1
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Layanan Konveksi & Jahit</h1>
          <p className="admin-page-desc">
            Kelola ragam produk seragam, minimal pemesanan (MOQ), estimasi pengerjaan, dan spesifikasi bahan.
          </p>
        </div>

        <div className="admin-breadcrumbs">
          <Link to="/admin">Admin</Link>
          <span>/</span>
          <span className="current">Layanan</span>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header admin-table-card-header">
          <div className="admin-table-tools">
            <div className="admin-table-search-box">
              <input
                type="text"
                placeholder="Cari jenis layanan / bahan..."
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
              to="/admin/layanan/tambah"
              className="admin-action-icon-btn admin-action-icon-btn-primary"
              title="Tambah Layanan Baru"
              aria-label="Tambah Layanan Baru"
            >
              <Plus size={16} />
            </Link>
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Layanan</th>
                <th>Bahan Rekomendasi</th>
                <th>Min. Order</th>
                <th>Waktu Pengerjaan</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--admin-text-muted)' }}>
                    <Scissors size={36} style={{ margin: '0 auto 0.75rem auto', opacity: 0.4 }} />
                    <p style={{ margin: 0, fontWeight: 600 }}>Tidak ada layanan ditemukan.</p>
                  </td>
                </tr>
              ) : (
                paginatedServices.map((service) => (
                  <tr key={service.id}>
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
                          {service.image ? (
                            <img
                              src={service.image}
                              alt={service.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <ImageIcon size={20} style={{ color: 'var(--admin-text-subtle)' }} />
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{service.title}</div>
                          <div style={{ fontSize: '0.71875rem', color: 'var(--admin-text-subtle)' }}>
                            {service.shortDesc ? `${service.shortDesc.slice(0, 48)}...` : '-'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {Array.isArray(service.materials) ? service.materials.join(', ') : service.materials || '-'}
                    </td>
                    <td>
                      <span className="admin-badge admin-badge-primary">
                        {service.moq || '24 Pcs'}
                      </span>
                    </td>
                    <td>{service.leadTime || '7-14 Hari'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.375rem' }}>
                        <Link
                          to={`/admin/layanan/detail/${service.id}`}
                          className="admin-icon-btn"
                          title="Lihat Detail Layanan"
                        >
                          <Eye size={15} />
                        </Link>
                        <Link
                          to={`/admin/layanan/edit/${service.id}`}
                          className="admin-icon-btn"
                          title="Ubah Layanan"
                        >
                          <Edit2 size={15} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(service)}
                          className="admin-icon-btn"
                          style={{ color: 'var(--admin-danger)' }}
                          title="Hapus Layanan"
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
          totalItems={filteredServices.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}
