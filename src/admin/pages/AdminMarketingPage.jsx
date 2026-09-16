import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit2, Trash2, Eye, Search, Phone, ExternalLink, Image as ImageIcon, Users } from 'lucide-react'
import AdminPagination from '../components/AdminPagination'
import { getMarketingList, deleteMarketingItem } from '../../firebase/adminService'
import { showDeleteConfirm, showToast, showErrorAlert } from '../utils/swal'

export default function AdminMarketingPage() {
  const [team, setTeam] = useState([])
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  useEffect(() => {
    let isMounted = true
    getMarketingList().then((list) => {
      if (isMounted && list) setTeam(list)
    })
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  const handleDelete = async (member) => {
    const res = await showDeleteConfirm({
      title: 'Hapus Petugas Marketing?',
      text: `Apakah Anda yakin ingin menghapus "${member.name}" dari tim marketing? Data yang dihapus tidak dapat dipulihkan.`
    })
    if (res.isConfirmed) {
      try {
        await deleteMarketingItem(member.id)
        setTeam((prev) => prev.filter((item) => item.id !== member.id))
        showToast({ icon: 'success', title: 'Petugas marketing berhasil dihapus' })
      } catch (err) {
        showErrorAlert('Gagal Menghapus', err?.message)
      }
    }
  }

  const filteredTeam = team.filter((member) => {
    const q = search.toLowerCase()
    return (
      (member.name || '').toLowerCase().includes(q) ||
      (member.division || '').toLowerCase().includes(q) ||
      (member.phone || '').toLowerCase().includes(q)
    )
  })

  const totalPages = Math.ceil(filteredTeam.length / itemsPerPage) || 1
  const paginatedTeam = filteredTeam.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Tim Marketing & Kontak</h1>
          <p className="admin-page-desc">
            Kelola data petugas marketing, nomor kontak WhatsApp, dan informasi ketersediaan yang tampil di website.
          </p>
        </div>

        <div className="admin-breadcrumbs">
          <Link to="/admin">Admin</Link>
          <span>/</span>
          <span className="current">Marketing</span>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header admin-table-card-header">
          <div className="admin-table-tools">
            <div className="admin-table-search-box">
              <input
                type="text"
                placeholder="Cari nama, posisi, nomor..."
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
              to="/admin/marketing/tambah"
              className="admin-action-icon-btn admin-action-icon-btn-primary"
              title="Tambah Petugas Baru"
              aria-label="Tambah Petugas Baru"
            >
              <Plus size={16} />
            </Link>
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Petugas</th>
                <th>Divisi / Jabatan</th>
                <th>Kontak WhatsApp</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeam.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--admin-text-muted)' }}>
                    <Users size={36} style={{ margin: '0 auto 0.75rem auto', opacity: 0.4 }} />
                    <p style={{ margin: 0, fontWeight: 600 }}>Belum ada data tim marketing.</p>
                  </td>
                </tr>
              ) : (
                paginatedTeam.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'var(--color-primary-soft)',
                            color: 'var(--color-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            flexShrink: 0
                          }}
                        >
                          {m.photo ? (
                            <img
                              src={m.photo}
                              alt={m.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                                if (e.currentTarget.nextElementSibling) {
                                  e.currentTarget.nextElementSibling.style.display = 'flex'
                                }
                              }}
                            />
                          ) : null}
                          <div
                            style={{
                              display: m.photo ? 'none' : 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '100%',
                              height: '100%'
                            }}
                          >
                            <ImageIcon size={18} />
                          </div>
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--admin-text-main)' }}>
                            {m.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                            Urutan: {m.order || 1}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 500, color: 'var(--admin-text-main)' }}>
                        {m.division}
                      </span>
                    </td>
                    <td>
                      <a
                        href={m.waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          color: 'var(--color-primary)',
                          fontWeight: 600,
                          fontSize: '0.8125rem'
                        }}
                      >
                        <Phone size={14} />
                        <span>{m.phone}</span>
                        <ExternalLink size={12} style={{ opacity: 0.6 }} />
                      </a>
                    </td>
                    <td>
                      <span
                        className="admin-badge"
                        style={{
                          background: 'rgba(16, 185, 129, 0.1)',
                          color: '#059669',
                          fontWeight: 600
                        }}
                      >
                        {m.status || 'Aktif'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <Link
                          to={`/admin/marketing/detail/${m.id}`}
                          className="admin-action-icon-btn"
                          title="Lihat Detail"
                          aria-label="Lihat Detail"
                        >
                          <Eye size={15} />
                        </Link>
                        <Link
                          to={`/admin/marketing/edit/${m.id}`}
                          className="admin-action-icon-btn admin-action-icon-btn-primary"
                          title="Ubah"
                          aria-label="Ubah"
                        >
                          <Edit2 size={15} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(m)}
                          className="admin-action-icon-btn admin-action-icon-btn-danger"
                          title="Hapus"
                          aria-label="Hapus"
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
          totalItems={filteredTeam.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}
