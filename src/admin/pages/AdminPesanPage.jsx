import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Eye, Trash2, Mail, MessageSquare } from 'lucide-react'
import AdminPagination from '../components/AdminPagination'
import {
  getInquiriesList,
  updateInquiryStatus,
  deleteInquiry
} from '../../firebase/adminService'
import { showDeleteConfirm, showToast, showErrorAlert } from '../utils/swal'

export default function AdminPesanPage() {
  const [inquiries, setInquiries] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const loadData = async () => {
    const list = await getInquiriesList()
    setInquiries(list)
  }

  useEffect(() => {
    let isMounted = true
    getInquiriesList().then((list) => {
      if (isMounted) setInquiries(list)
    })
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [search, statusFilter])

  const handleStatusChange = async (id, newStatus) => {
    await updateInquiryStatus(id, newStatus)
    await loadData()
    showToast({ icon: 'success', title: 'Status pesan diperbarui' })
  }

  const handleDelete = async (inq) => {
    const res = await showDeleteConfirm({
      title: 'Hapus Pesan Masuk?',
      text: `Apakah Anda yakin ingin menghapus pesan dari "${inq.name}"? Data yang dihapus tidak dapat dipulihkan.`
    })
    if (res.isConfirmed) {
      try {
        await deleteInquiry(inq.id)
        setInquiries((prev) => prev.filter((item) => item.id !== inq.id))
        showToast({ icon: 'success', title: 'Pesan berhasil dihapus' })
      } catch (err) {
        showErrorAlert('Gagal Menghapus', err?.message)
      }
    }
  }

  const filteredInquiries = inquiries.filter((inq) => {
    const matchSearch =
      (inq.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (inq.institution || '').toLowerCase().includes(search.toLowerCase()) ||
      (inq.whatsapp || '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || inq.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage) || 1
  const paginatedInquiries = filteredInquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Pesan & Permintaan Penawaran</h1>
          <p className="admin-page-desc">
            Kelola pesan masuk dan permohonan konsultasi pemesanan seragam dari pengunjung website.
          </p>
        </div>

        <div className="admin-breadcrumbs">
          <Link to="/admin">Admin</Link>
          <span>/</span>
          <span className="current">Pesan Masuk</span>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header admin-table-card-header">
          <div className="admin-table-tools">
            <select
              className="admin-select admin-table-select-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Semua Status</option>
              <option value="baru">Belum Dibaca</option>
              <option value="proses">Dalam Proses</option>
              <option value="selesai">Selesai</option>
            </select>

            <div className="admin-table-search-box">
              <input
                type="text"
                placeholder="Cari pengirim / instansi..."
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
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Pengirim</th>
                <th>Instansi</th>
                <th>Kategori & Qty</th>
                <th>Status</th>
                <th>Waktu</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--admin-text-muted)' }}>
                    <MessageSquare size={36} style={{ margin: '0 auto 0.75rem auto', opacity: 0.4 }} />
                    <p style={{ margin: 0, fontWeight: 600 }}>Tidak ada pesan masuk.</p>
                  </td>
                </tr>
              ) : (
                paginatedInquiries.map((inq) => (
                  <tr key={inq.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{inq.name}</div>
                      <div style={{ fontSize: '0.71875rem', color: 'var(--admin-text-subtle)' }}>
                        {inq.whatsapp}
                      </div>
                    </td>
                    <td>{inq.institution || '-'}</td>
                    <td>
                      <div>{inq.category}</div>
                      {inq.estimatedQty && (
                        <div style={{ fontSize: '0.71875rem', color: 'var(--admin-text-subtle)' }}>
                          Estimasi: {inq.estimatedQty} pcs
                        </div>
                      )}
                    </td>
                    <td>
                      <select
                        value={inq.status}
                        onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                        className={`admin-badge ${
                          inq.status === 'baru'
                            ? 'admin-badge-danger'
                            : inq.status === 'proses'
                            ? 'admin-badge-warning'
                            : 'admin-badge-success'
                        }`}
                        style={{ cursor: 'pointer', border: 'none' }}
                      >
                        <option value="baru">Belum Dibaca</option>
                        <option value="proses">Proses</option>
                        <option value="selesai">Selesai</option>
                      </select>
                    </td>
                    <td style={{ fontSize: '0.8125rem' }}>
                      {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.375rem' }}>
                        <Link
                          to={`/admin/pesan/detail/${inq.id}`}
                          className="admin-icon-btn"
                          title="Buka Detail Pesan"
                        >
                          <Eye size={15} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(inq)}
                          className="admin-icon-btn"
                          style={{ color: 'var(--admin-danger)' }}
                          title="Hapus Catatan"
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
          totalItems={filteredInquiries.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}
