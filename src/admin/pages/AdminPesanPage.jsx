import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Trash2, MessageSquare, Eye } from 'lucide-react'
import AdminModal from '../components/AdminModal'
import {
  getInquiriesList,
  updateInquiryStatus,
  deleteInquiry
} from '../../firebase/adminService'

export default function AdminPesanPage() {
  const [inquiries, setInquiries] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

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

  const handleStatusChange = async (id, newStatus) => {
    await updateInquiryStatus(id, newStatus)
    await loadData()
  }

  const handleDelete = async () => {
    if (!deleteConfirmId) return
    await deleteInquiry(deleteConfirmId)
    await loadData()
    setDeleteConfirmId(null)
  }

  const filteredInquiries = inquiries.filter((inq) => {
    const matchSearch =
      (inq.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (inq.institution || '').toLowerCase().includes(search.toLowerCase()) ||
      (inq.whatsapp || '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || inq.status === statusFilter
    return matchSearch && matchStatus
  })

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
        <div className="admin-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', minWidth: '220px', maxWidth: '340px', flex: 1 }}>
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

            <select
              className="admin-select"
              style={{ width: 'auto', minWidth: '160px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Semua Status</option>
              <option value="baru">Belum Dibaca</option>
              <option value="proses">Dalam Proses</option>
              <option value="selesai">Selesai</option>
            </select>
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
                filteredInquiries.map((inq) => (
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
                          onClick={() => setDeleteConfirmId(inq.id)}
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
      </div>

      <AdminModal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        title="Konfirmasi Hapus Pesan"
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
          Apakah Anda yakin ingin menghapus catatan pesan ini?
        </p>
      </AdminModal>
    </div>
  )
}
