import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Shirt,
  Users,
  Scissors,
  MessageSquare,
  Database,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Send,
  Trash2
} from 'lucide-react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import {
  getKatalogList,
  getKlienList,
  getLayananList,
  getInquiriesList,
  seedInitialDataToFirestore,
  clearAllAdminData
} from '../../firebase/adminService'
import { isFirebaseConfigured } from '../../firebase/config'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    products: 0,
    clients: 0,
    services: 0,
    inquiries: 0
  })
  const [recentInquiries, setRecentInquiries] = useState([])
  const [seeding, setSeeding] = useState(false)
  const [seedMessage, setSeedMessage] = useState('')
  const [seedError, setSeedError] = useState('')

  useEffect(() => {
    const loadDashboardData = async () => {
      const [prods, clis, servs, inqs] = await Promise.all([
        getKatalogList(),
        getKlienList(),
        getLayananList(),
        getInquiriesList()
      ])

      setStats({
        products: prods.length,
        clients: clis.length,
        services: servs.length,
        inquiries: inqs.length
      })
      setRecentInquiries(inqs.slice(0, 5))
    }

    loadDashboardData()
  }, [])

  const handleSeedFirebase = async () => {
    setSeeding(true)
    setSeedMessage('')
    setSeedError('')

    try {
      const res = await seedInitialDataToFirestore()
      setSeedMessage(
        `Berhasil sinkronisasi: ${res.products} produk, ${res.clients} mitra, ${res.services} layanan, ${res.testimonials} testimoni ke Firestore!`
      )
    } catch (err) {
      setSeedError(err.message || 'Gagal sinkronisasi data ke Firebase.')
    } finally {
      setSeeding(false)
    }
  }

  const handleClearAllData = async () => {
    if (!window.confirm('Apakah Anda yakin ingin mengosongkan semua data? Tindakan ini akan menghapus semua produk, klien, layanan, testimoni, dan pesan untuk penginputan data baru.')) return
    setSeeding(true)
    setSeedMessage('')
    setSeedError('')
    try {
      await clearAllAdminData()
      setStats({
        products: 0,
        clients: 0,
        services: 0,
        inquiries: 0
      })
      setRecentInquiries([])
      setSeedMessage('Semua data berhasil dikosongkan. Anda siap menginput data baru!')
    } catch (err) {
      setSeedError(err.message || 'Gagal mengosongkan data.')
    } finally {
      setSeeding(false)
    }
  }

  const chartData = {
    labels: ['2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        label: 'Volume Produksi Tahunan (Pcs/Setel)',
        data: [12500, 14200, 16800, 19500, 22400],
        borderColor: '#800080',
        backgroundColor: 'rgba(128, 0, 128, 0.08)',
        fill: true,
        tension: 0.35,
        borderWidth: 2.5,
        pointRadius: 5,
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: '#800080',
        pointBorderWidth: 2.5
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#475569',
        titleFont: { size: 12, weight: '700', family: 'Poppins, sans-serif' },
        bodyFont: { size: 11, family: 'Poppins, sans-serif' },
        cornerRadius: 8,
        padding: 10,
        callbacks: {
          label: (context) => ` Total Produksi: ${context.parsed.y.toLocaleString('id-ID')} Pcs`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748B', font: { weight: '700', family: 'Poppins, sans-serif' } }
      },
      y: {
        grid: { color: 'rgba(226, 232, 240, 0.6)' },
        ticks: {
          color: '#94A3B8',
          font: { family: 'Poppins, sans-serif' },
          callback: (v) => v.toLocaleString('id-ID')
        }
      }
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard Administrasi</h1>
          <p className="admin-page-desc">
            Ringkasan master data konveksi, statistik volume produksi, dan pesan konsultasi terbaru.
          </p>
        </div>

        <div className="admin-breadcrumbs">
          <Link to="/admin">Admin</Link>
          <span>/</span>
          <span className="current">Dashboard</span>
        </div>
      </div>

      {seedMessage && (
        <div className="admin-alert admin-alert-success">
          <span>{seedMessage}</span>
        </div>
      )}

      {seedError && (
        <div className="admin-alert admin-alert-danger">
          <span>{seedError}</span>
        </div>
      )}

      <div className="admin-kpi-grid">
        <div className="admin-kpi-card">
          <div className="admin-kpi-top">
            <span className="admin-kpi-label">Katalog Produk</span>
            <div
              className="admin-kpi-icon-wrapper"
              style={{ backgroundColor: 'var(--admin-primary-soft)', color: 'var(--admin-primary)' }}
            >
              <Shirt size={20} />
            </div>
          </div>
          <div className="admin-kpi-value">{stats.products}</div>
          <div className="admin-kpi-footer">
            <TrendingUp size={14} style={{ color: 'var(--admin-success)' }} />
            <span>Model seragam & busana</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-top">
            <span className="admin-kpi-label">Mitra Klien</span>
            <div
              className="admin-kpi-icon-wrapper"
              style={{ backgroundColor: 'var(--admin-success-soft)', color: 'var(--admin-success)' }}
            >
              <Users size={20} />
            </div>
          </div>
          <div className="admin-kpi-value">{stats.clients}</div>
          <div className="admin-kpi-footer">
            <TrendingUp size={14} style={{ color: 'var(--admin-success)' }} />
            <span>Sekolah, instansi & swasta</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-top">
            <span className="admin-kpi-label">Layanan Konveksi</span>
            <div
              className="admin-kpi-icon-wrapper"
              style={{ backgroundColor: 'var(--admin-warning-soft)', color: 'var(--admin-warning)' }}
            >
              <Scissors size={20} />
            </div>
          </div>
          <div className="admin-kpi-value">{stats.services}</div>
          <div className="admin-kpi-footer">
            <span>Kategori jasa produksi</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-top">
            <span className="admin-kpi-label">Pesan / Permintaan</span>
            <div
              className="admin-kpi-icon-wrapper"
              style={{ backgroundColor: 'var(--admin-primary-soft)', color: 'var(--admin-primary)' }}
            >
              <MessageSquare size={20} />
            </div>
          </div>
          <div className="admin-kpi-value">{stats.inquiries}</div>
          <div className="admin-kpi-footer">
            <Clock size={14} />
            <span>Masuk via formulir kontak</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem', marginBottom: '1.75rem' }}>
        <div style={{ gridColumn: 'span 12' }} className="admin-card">
          <div className="admin-card-header">
            <div>
              <h2 className="admin-card-title">Tren Pertumbuhan Volume Produksi</h2>
              <p className="admin-card-subtitle">
                Total akumulasi kuantitas seragam & busana yang diproduksi per tahun (Pcs/Setel)
              </p>
            </div>
            <div className="admin-badge admin-badge-primary">5 Tahun Terakhir</div>
          </div>
          <div style={{ padding: '1.25rem', height: '300px' }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">Pesan & Permintaan Penawaran Masuk Terbaru</h2>
            <p className="admin-card-subtitle">
              Daftar kontak calon klien yang mengisi formulir konsultasi website
            </p>
          </div>
          <Link to="/admin/pesan" className="admin-btn admin-btn-secondary admin-btn-sm">
            Lihat Semua Pesan
            <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nama Pengirim</th>
                <th>Instansi / Lembaga</th>
                <th>WhatsApp</th>
                <th>Kategori Pesanan</th>
                <th>Status</th>
                <th>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {recentInquiries.map((inq) => (
                <tr key={inq.id}>
                  <td style={{ fontWeight: 700 }}>{inq.name}</td>
                  <td>{inq.institution || '-'}</td>
                  <td>{inq.whatsapp}</td>
                  <td>{inq.category}</td>
                  <td>
                    <span
                      className={`admin-badge ${
                        inq.status === 'Baru'
                          ? 'admin-badge-warning'
                          : inq.status === 'Deal'
                          ? 'admin-badge-success'
                          : 'admin-badge-primary'
                      }`}
                    >
                      {inq.status}
                    </span>
                  </td>
                  <td>
                    <a
                      href={`https://wa.me/${inq.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Halo ${inq.name}, saya dari Azhar Collection ingin menindaklanjuti pesan Anda terkait pesanan ${inq.category}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                    >
                      <Send size={13} />
                      <span>Balas WA</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div
        className="admin-card"
        style={{
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--admin-radius)',
              backgroundColor: 'var(--admin-primary-soft)',
              color: 'var(--admin-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Database size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 800 }}>
              Status Backend Firebase
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
              {isFirebaseConfigured
                ? 'Firebase Firestore terhubung secara aktif.'
                : 'Firebase .env belum terisi. Data berjalan dengan aman via Local Database Fallback.'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            disabled={seeding}
            onClick={handleClearAllData}
            className="admin-btn admin-btn-danger admin-btn-sm"
          >
            <Trash2 size={14} />
            <span>Kosongkan Semua Data</span>
          </button>

          {isFirebaseConfigured && (
            <button
              type="button"
              disabled={seeding}
              onClick={handleSeedFirebase}
              className="admin-btn admin-btn-secondary admin-btn-sm"
            >
              {seeding ? 'Menyinkronkan...' : 'Sinkronkan Data Awal ke Firestore'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
