import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Shirt,
  Users,
  Scissors,
  MessageSquare,
  Database,
  Cloud,
  ArrowUpRight,
  Clock,
  Send,
  Globe
} from 'lucide-react'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import {
  getKatalogList,
  getKlienList,
  getLayananList,
  getInquiriesList
} from '../../firebase/adminService'
import { getVisitorStats } from '../../firebase/visitorService'
import { isFirebaseConfigured } from '../../firebase/config'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
  const [visitorStats, setVisitorStats] = useState({
    totalVisitors: 0,
    todayVisitors: 0,
    totalPageViews: 0,
    todayPageViews: 0,
    recentDays: []
  })
  const [categoryStats, setCategoryStats] = useState({
    labels: [],
    data: []
  })
  const [recentInquiries, setRecentInquiries] = useState([])

  useEffect(() => {
    const loadDashboardData = async () => {
      const [prods, clis, servs, inqs, visitors] = await Promise.all([
        getKatalogList(),
        getKlienList(),
        getLayananList(),
        getInquiriesList(),
        getVisitorStats()
      ])

      setStats({
        products: prods.length,
        clients: clis.length,
        services: servs.length,
        inquiries: inqs.length
      })
      setVisitorStats(visitors)
      setRecentInquiries(inqs.slice(0, 5))

      const categoryMap = {}
      prods.forEach((p) => {
        const cat = p.categoryLabel || p.category || 'Lainnya'
        categoryMap[cat] = (categoryMap[cat] || 0) + 1
      })
      setCategoryStats({
        labels: Object.keys(categoryMap),
        data: Object.values(categoryMap)
      })
    }

    loadDashboardData()
  }, [])

  const visitorChartData = {
    labels: (visitorStats.recentDays || []).map((d) => d.label),
    datasets: [
      {
        label: 'Pengunjung Unik',
        data: (visitorStats.recentDays || []).map((d) => d.visitors),
        borderColor: '#800080',
        backgroundColor: 'rgba(128, 0, 128, 0.08)',
        fill: true,
        tension: 0.35,
        borderWidth: 2.5,
        pointRadius: 4,
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: '#800080',
        pointBorderWidth: 2
      },
      {
        label: 'Tayangan Halaman',
        data: (visitorStats.recentDays || []).map((d) => d.pageViews),
        borderColor: '#0284c7',
        backgroundColor: 'rgba(2, 132, 199, 0.05)',
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        borderDash: [4, 4],
        pointRadius: 3,
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: '#0284c7',
        pointBorderWidth: 2
      }
    ]
  }

  const visitorChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
          pointStyle: 'circle',
          font: { size: 11, family: 'Poppins, sans-serif' }
        }
      },
      tooltip: {
        backgroundColor: '#475569',
        titleFont: { size: 12, weight: '700', family: 'Poppins, sans-serif' },
        bodyFont: { size: 11, family: 'Poppins, sans-serif' },
        cornerRadius: 8,
        padding: 10
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748B', font: { weight: '600', size: 11, family: 'Poppins, sans-serif' } }
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(226, 232, 240, 0.6)' },
        ticks: {
          color: '#94A3B8',
          font: { family: 'Poppins, sans-serif' },
          precision: 0,
          callback: (v) => v.toLocaleString('id-ID')
        }
      }
    }
  }

  const categoryChartData = {
    labels: categoryStats.labels,
    datasets: [
      {
        label: 'Jumlah Model Busana',
        data: categoryStats.data,
        backgroundColor: 'rgba(128, 0, 128, 0.75)',
        borderColor: '#800080',
        borderWidth: 1,
        borderRadius: 4,
        maxBarThickness: 36
      }
    ]
  }

  const categoryChartOptions = {
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
          label: (context) => ` Jumlah: ${context.parsed.y} Model Busana`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748B', font: { weight: '600', size: 11, family: 'Poppins, sans-serif' } }
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(226, 232, 240, 0.6)' },
        ticks: {
          color: '#94A3B8',
          font: { family: 'Poppins, sans-serif' },
          precision: 0,
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
            Ringkasan master data konveksi, statistik pengunjung, dan pesan konsultasi terbaru.
          </p>
        </div>

        <div className="admin-breadcrumbs">
          <Link to="/admin">Admin</Link>
          <span>/</span>
          <span className="current">Dashboard</span>
        </div>
      </div>

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
            <span>Model seragam dan busana</span>
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
            <span>Sekolah, instansi, dan swasta</span>
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

        <div className="admin-kpi-card">
          <div className="admin-kpi-top">
            <span className="admin-kpi-label">Pengunjung Web</span>
            <div
              className="admin-kpi-icon-wrapper"
              style={{ backgroundColor: 'var(--admin-primary-soft)', color: 'var(--admin-primary)' }}
            >
              <Globe size={20} />
            </div>
          </div>
          <div className="admin-kpi-value">
            {visitorStats.todayVisitors}{' '}
            <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--admin-text-muted)' }}>
              Hari Ini
            </span>
          </div>
          <div className="admin-kpi-footer">
            <span>{visitorStats.totalVisitors.toLocaleString('id-ID')} Total Akumulasi</span>
          </div>
        </div>
      </div>

      <div className="admin-dashboard-charts-grid">
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h2 className="admin-card-title">Statistik Pengunjung Website</h2>
              <p className="admin-card-subtitle">
                Aktivitas kunjungan unik dan tayangan halaman (7 Hari Terakhir)
              </p>
            </div>
            <div className="admin-badge admin-badge-primary">7 Hari Terakhir</div>
          </div>
          <div className="admin-chart-card-body">
            <Line data={visitorChartData} options={visitorChartOptions} />
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h2 className="admin-card-title">Distribusi Kategori Katalog Busana</h2>
              <p className="admin-card-subtitle">
                Komposisi jumlah model seragam dan busana per kategori aktif
              </p>
            </div>
            <div className="admin-badge admin-badge-primary">Katalog Riil</div>
          </div>
          <div className="admin-chart-card-body">
            {categoryStats.labels.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>
                Belum ada data model busana di katalog.
              </div>
            ) : (
              <Bar data={categoryChartData} options={categoryChartOptions} />
            )}
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
              {recentInquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--admin-text-muted)' }}>
                    Belum ada pesan atau permohonan konsultasi yang masuk.
                  </td>
                </tr>
              ) : (
                recentInquiries.map((inq) => {
                  const statusKey = (inq.status || '').toLowerCase()
                  const isNew = statusKey === 'baru'
                  const isDeal = statusKey === 'deal' || statusKey === 'selesai'
                  return (
                    <tr key={inq.id}>
                      <td style={{ fontWeight: 700 }}>{inq.name}</td>
                      <td>{inq.institution || '-'}</td>
                      <td>{inq.whatsapp}</td>
                      <td>{inq.category}</td>
                      <td>
                        <span
                          className={`admin-badge ${
                            isNew
                              ? 'admin-badge-warning'
                              : isDeal
                              ? 'admin-badge-success'
                              : 'admin-badge-primary'
                          }`}
                        >
                          {inq.status}
                        </span>
                      </td>
                      <td>
                        <a
                          href={`https://wa.me/${(inq.whatsapp || '').replace(/\D/g, '')}?text=${encodeURIComponent(
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
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-cloud-grid">
        <div className="admin-card admin-cloud-card">
          <div className="admin-cloud-card-main">
            <div
              className="admin-cloud-status-icon"
              style={{
                backgroundColor: isFirebaseConfigured ? 'var(--admin-success-soft)' : 'var(--admin-warning-soft)',
                color: isFirebaseConfigured ? 'var(--admin-success)' : 'var(--admin-warning)'
              }}
            >
              <Database size={18} />
            </div>
            <div>
              <div className="admin-cloud-status-title">
                Cloud Firestore (Firebase)
              </div>
              <div className="admin-cloud-status-desc">
                Basis data cloud & sinkronisasi real-time
              </div>
            </div>
          </div>

          <span
            className={`admin-badge ${isFirebaseConfigured ? 'admin-badge-success' : 'admin-badge-warning'}`}
            style={{ padding: '0.35rem 0.75rem', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'inline-flex', alignItems: 'center' }}
          >
            {isFirebaseConfigured && <span className="admin-status-dot" />}
            {isFirebaseConfigured ? 'Firebase Terhubung' : 'Firebase Offline'}
          </span>
        </div>

        <div className="admin-card admin-cloud-card">
          <div className="admin-cloud-card-main">
            <div
              className="admin-cloud-status-icon"
              style={{
                backgroundColor: 'var(--admin-success-soft)',
                color: 'var(--admin-success)'
              }}
            >
              <Cloud size={18} />
            </div>
            <div>
              <div className="admin-cloud-status-title">
                Cloudinary Media Storage
              </div>
              <div className="admin-cloud-status-desc">
                CDN media aset gambar & galeri portofolio
              </div>
            </div>
          </div>

          <span
            className="admin-badge admin-badge-success"
            style={{ padding: '0.35rem 0.75rem', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'inline-flex', alignItems: 'center' }}
          >
            <span className="admin-status-dot" />
            Cloudinary Terhubung
          </span>
        </div>
      </div>
    </div>
  )
}
