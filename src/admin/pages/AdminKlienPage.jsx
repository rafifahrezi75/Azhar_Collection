import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Edit2, Trash2, Users, School, Eye } from 'lucide-react'
import AdminModal from '../components/AdminModal'
import { getKlienList, deleteKlienItem } from '../../firebase/adminService'

export default function AdminKlienPage() {
  const [clients, setClients] = useState([])
  const [search, setSearch] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  const loadData = async () => {
    const list = await getKlienList()
    setClients(list)
  }

  useEffect(() => {
    let isMounted = true
    getKlienList().then((list) => {
      if (isMounted) setClients(list)
    })
    return () => {
      isMounted = false
    }
  }, [])

  const handleDelete = async () => {
    if (!deleteConfirmId) return
    await deleteKlienItem(deleteConfirmId)
    await loadData()
    setDeleteConfirmId(null)
  }

  const filteredClients = clients.filter((client) => {
    const matchSearch =
      (client.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (client.city || '').toLowerCase().includes(search.toLowerCase()) ||
      (client.category || '').toLowerCase().includes(search.toLowerCase())
    return matchSearch
  })

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h1 className="admin-page-title" style={{ margin: 0 }}>Mitra & Klien Kami</h1>
            <div className="admin-inline-actions">
              <Link
                to="/admin/klien/tambah"
                className="admin-action-icon-btn admin-action-icon-btn-primary"
                title="Tambah Mitra Baru"
                aria-label="Tambah Mitra Baru"
              >
                <Plus size={18} />
              </Link>
            </div>
          </div>
          <p className="admin-page-desc" style={{ margin: '0.25rem 0 0 0' }}>
            Kelola profil institusi sekolah, kampus, dan instansi pemesan seragam di Azhar Collection.
          </p>
        </div>

        <div className="admin-breadcrumbs">
          <Link to="/admin">Admin</Link>
          <span>/</span>
          <span className="current">Mitra & Klien</span>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div style={{ position: 'relative', minWidth: '220px', maxWidth: '340px', flex: 1 }}>
            <input
              type="text"
              placeholder="Cari nama sekolah / kota..."
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

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Lembaga Mitra</th>
                <th>Kategori</th>
                <th>Kota / Wilayah</th>
                <th>Sejak</th>
                <th>Volume Pesanan</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--admin-text-muted)' }}>
                    <Users size={36} style={{ margin: '0 auto 0.75rem auto', opacity: 0.4 }} />
                    <p style={{ margin: 0, fontWeight: 600 }}>Tidak ada data mitra ditemukan.</p>
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                        <div
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: 'var(--admin-radius)',
                            overflow: 'hidden',
                            backgroundColor: 'var(--admin-surface-hover)',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '4px'
                          }}
                        >
                          {client.image ? (
                            <img
                              src={client.image}
                              alt={client.name}
                              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                            />
                          ) : (
                            <School size={20} style={{ color: 'var(--admin-text-subtle)' }} />
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{client.name}</div>
                          <div style={{ fontSize: '0.71875rem', color: 'var(--admin-text-subtle)' }}>
                            PIC: {client.contactPerson || '-'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="admin-badge admin-badge-primary">
                        {client.category || 'Sekolah'}
                      </span>
                    </td>
                    <td>{client.city || '-'}</td>
                    <td>{client.since || '-'}</td>
                    <td>
                      <span className="admin-badge admin-badge-success">
                        {client.totalPcs || client.totalOrders || 'Rutin'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.375rem' }}>
                        <Link
                          to={`/admin/klien/detail/${client.id}`}
                          className="admin-icon-btn"
                          title="Lihat Detail Profil"
                        >
                          <Eye size={15} />
                        </Link>
                        <Link
                          to={`/admin/klien/edit/${client.id}`}
                          className="admin-icon-btn"
                          title="Ubah Data Mitra"
                        >
                          <Edit2 size={15} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(client.id)}
                          className="admin-icon-btn"
                          style={{ color: 'var(--admin-danger)' }}
                          title="Hapus Mitra"
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
        title="Konfirmasi Hapus Mitra"
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
          Apakah Anda yakin ingin menghapus data mitra lembaga ini? Data yang dihapus tidak dapat dipulihkan kembali.
        </p>
      </AdminModal>
    </div>
  )
}
