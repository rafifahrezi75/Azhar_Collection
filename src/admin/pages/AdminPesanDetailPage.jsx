import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Send, MessageSquare, User, Building2, Phone, Calendar, Package, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react'
import { getInquiryById, updateInquiryStatus } from '../../firebase/adminService'

export default function AdminPesanDetailPage() {
  const { id } = useParams()
  const [inquiry, setInquiry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    getInquiryById(id)
      .then((data) => {
        if (!isMounted) return
        if (data) {
          setInquiry(data)
        } else {
          setError('Pesan tidak ditemukan')
        }
      })
      .catch((err) => {
        if (!isMounted) return
        setError(err?.message || 'Gagal memuat detail pesan')
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [id])

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true)
    try {
      await updateInquiryStatus(id, newStatus)
      const data = await getInquiryById(id)
      if (data) setInquiry(data)
    } finally {
      setUpdatingStatus(false)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <Loader2 size={36} className="spin-animation" style={{ color: 'var(--admin-primary)', margin: '0 auto 1rem auto' }} />
        <p style={{ color: 'var(--admin-text-muted)', fontWeight: 600 }}>Memuat detail pesan masuk...</p>
      </div>
    )
  }

  if (error || !inquiry) {
    return (
      <div className="admin-form-page">
        <Link to="/admin/pesan" className="admin-back-btn" title="Kembali" aria-label="Kembali">
          <ArrowLeft size={18} />
        </Link>
        <div className="admin-alert admin-alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={16} />
          <span>{error || 'Pesan tidak ditemukan'}</span>
        </div>
      </div>
    )
  }

  const cleanPhone = (inquiry.whatsapp || '').replace(/\D/g, '')
  const waReplyUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
        `Halo Bapak/Ibu ${inquiry.name}, kami dari Azhar Collection Konveksi ingin menindaklanjuti permohonan konsultasi seragam Anda.`
      )}`
    : null

  return (
    <div className="admin-card">
      <div className="admin-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link to="/admin/pesan" className="admin-back-btn" title="Kembali" aria-label="Kembali">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
              <h1 className="admin-page-title" style={{ margin: 0 }}>Pesan dari {inquiry.name}</h1>
              <span
                className={`admin-badge ${
                  inquiry.status === 'baru'
                    ? 'admin-badge-danger'
                    : inquiry.status === 'proses'
                    ? 'admin-badge-warning'
                    : 'admin-badge-success'
                }`}
              >
                {inquiry.status === 'baru' ? 'Belum Dibaca' : inquiry.status === 'proses' ? 'Sedang Diproses' : 'Selesai'}
              </span>
            </div>
            <p className="admin-page-desc" style={{ margin: '0.25rem 0 0 0' }}>
              {inquiry.institution || 'Pengunjung Umum'}
            </p>
          </div>
        </div>

        {waReplyUrl && (
          <div className="admin-inline-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <a
              href={waReplyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn admin-btn-primary admin-btn-sm"
              title="Balas via WhatsApp"
              aria-label="Balas via WhatsApp"
            >
              <Send size={14} />
              <span>Balas WhatsApp</span>
            </a>
          </div>
        )}
      </div>

      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="admin-detail-meta-grid">
          <div className="admin-detail-meta-item">
            <span className="admin-detail-meta-label">
              <User size={12} style={{ display: 'inline', marginRight: '4px' }} />
              Nama Lengkap
            </span>
            <span className="admin-detail-meta-value">{inquiry.name}</span>
          </div>

          <div className="admin-detail-meta-item">
            <span className="admin-detail-meta-label">
              <Building2 size={12} style={{ display: 'inline', marginRight: '4px' }} />
              Instansi / Lembaga
            </span>
            <span className="admin-detail-meta-value">{inquiry.institution || '-'}</span>
          </div>

          <div className="admin-detail-meta-item">
            <span className="admin-detail-meta-label">
              <Phone size={12} style={{ display: 'inline', marginRight: '4px' }} />
              Nomor WhatsApp
            </span>
            <span className="admin-detail-meta-value">{inquiry.whatsapp || '-'}</span>
          </div>

          <div className="admin-detail-meta-item">
            <span className="admin-detail-meta-label">
              <Package size={12} style={{ display: 'inline', marginRight: '4px' }} />
              Kategori & Estimasi Qty
            </span>
            <span className="admin-detail-meta-value">
              {inquiry.category || 'Seragam'} {inquiry.estimatedQty ? `(${inquiry.estimatedQty})` : ''}
            </span>
          </div>

          <div className="admin-detail-meta-item">
            <span className="admin-detail-meta-label">
              <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
              Waktu Kirim
            </span>
            <span className="admin-detail-meta-value">
              {inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleString('id-ID') : '-'}
            </span>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '1.25rem' }}>
          <h3 style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 0.75rem 0', color: 'var(--admin-text-main)' }}>
            Isi Pesan Konsultasi
          </h3>

          <div
            style={{
              padding: '1rem',
              borderRadius: '6px',
              backgroundColor: 'var(--admin-surface-hover)',
              lineHeight: 1.6,
              fontSize: '13px',
              whiteSpace: 'pre-line',
              border: '1px solid var(--admin-border)'
            }}
          >
            {inquiry.message || 'Tidak ada isi pesan tertulis.'}
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '1.25rem' }}>
          <h3 style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 0.75rem 0', color: 'var(--admin-text-main)' }}>
            Perbarui Status Tindak Lanjut
          </h3>

          <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              disabled={updatingStatus || inquiry.status === 'baru'}
              onClick={() => handleStatusChange('baru')}
              className={`admin-btn ${inquiry.status === 'baru' ? 'admin-btn-primary' : 'admin-btn-secondary'} admin-btn-sm`}
            >
              <Clock size={13} />
              <span>Tandai Belum Dibaca</span>
            </button>

            <button
              type="button"
              disabled={updatingStatus || inquiry.status === 'proses'}
              onClick={() => handleStatusChange('proses')}
              className={`admin-btn ${inquiry.status === 'proses' ? 'admin-btn-primary' : 'admin-btn-secondary'} admin-btn-sm`}
            >
              <Clock size={13} />
              <span>Sedang Diproses (Follow Up)</span>
            </button>

            <button
              type="button"
              disabled={updatingStatus || inquiry.status === 'selesai'}
              onClick={() => handleStatusChange('selesai')}
              className={`admin-btn ${inquiry.status === 'selesai' ? 'admin-btn-primary' : 'admin-btn-secondary'} admin-btn-sm`}
            >
              <CheckCircle size={13} />
              <span>Selesai Ditindaklanjuti</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
