import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { clientsData as fallbackClients } from '../data/siteData'
import { getKlienList } from '../firebase/adminService'
import PageHeader from '../components/PageHeader'
import {
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  ArrowLeft,
  School,
  BarChart3,
  Layers,
  Package
} from 'lucide-react'
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
import { Line } from 'react-chartjs-2'

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

export default function ClientDetailPage() {
  const { clientId } = useParams()
  const [clients, setClients] = useState(fallbackClients)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    getKlienList().then((list) => {
      if (isMounted) {
        if (list) setClients(list)
        setIsLoading(false)
      }
    })
    return () => {
      isMounted = false
    }
  }, [])

  const client = clients.find((c) => c.id === clientId)

  if (isLoading) {
    return (
      <div className="client-detail-page">
        <PageHeader
          title="Memuat Data Klien..."
          subtitle="Mengambil riwayat kemitraan dari sistem Azhar Collection"
          breadcrumb="Detail Klien"
        />
        <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>Sedang memuat data...</p>
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="client-detail-page">
        <PageHeader
          title="Klien Tidak Ditemukan"
          subtitle="Data mitra yang Anda cari tidak tersedia atau rute URL tidak sesuai."
          breadcrumb="Detail Klien"
        />
        <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            Silakan kembali ke halaman daftar klien untuk memilih institusi atau sekolah mitra kami.
          </p>
          <Link to="/klien" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={16} />
            <span>Kembali ke Daftar Klien</span>
          </Link>
        </div>
      </div>
    )
  }

  const parseQty = (str) => {
    const match = (str || '').replace(/\./g, '').match(/\d+/)
    return match ? parseInt(match[0], 10) : 100
  }

  const orders = client.orderHistory || []
  const rawMax = Math.max(...orders.map((o) => parseQty(o.qty)), 200)

  const chartData = {
    labels: orders.map((o) => o.year || o.period),
    datasets: [
      {
        label: 'Volume Pemesanan',
        data: orders.map((o) => parseQty(o.qty)),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.08)',
        fill: true,
        tension: 0.35,
        borderWidth: 2.5,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: '#2563EB',
        pointBorderWidth: 2.5,
        pointHoverBackgroundColor: '#2563EB',
        pointHoverBorderColor: '#FFFFFF',
        pointHoverBorderWidth: 2
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 20,
        right: 20,
        bottom: 8,
        left: 8
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#475569',
        titleColor: '#FFFFFF',
        titleFont: { size: 12, weight: '700', family: 'Outfit, sans-serif' },
        bodyColor: '#F1F5F9',
        bodyFont: { size: 11, weight: '500', family: 'Outfit, sans-serif' },
        padding: { top: 10, bottom: 10, left: 12, right: 12 },
        cornerRadius: 8,
        displayColors: true,
        boxWidth: 10,
        boxHeight: 10,
        boxPadding: 4,
        callbacks: {
          title: (context) => {
            const order = orders[context[0].dataIndex]
            return order?.period ? `${order.period}` : `Tahun ${context[0].label}`
          },
          label: (context) => ` Volume: ${context.parsed.y.toLocaleString('id-ID')} Pcs/Setel`,
          afterLabel: (context) => {
            const order = orders[context.dataIndex]
            if (order?.date) return ` Waktu: ${order.date}`
            return ''
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        border: {
          color: '#E2E8F0',
          width: 1.5
        },
        ticks: {
          color: '#334155',
          font: {
            size: 12,
            weight: '700',
            family: 'Outfit, sans-serif'
          },
          padding: 10
        }
      },
      y: {
        beginAtZero: true,
        suggestedMax: Math.ceil(rawMax * 1.15),
        border: {
          display: false
        },
        grid: {
          color: '#F1F5F9',
          lineWidth: 1
        },
        ticks: {
          color: '#94A3B8',
          font: {
            size: 11,
            weight: '500',
            family: 'Outfit, sans-serif'
          },
          padding: 12,
          callback: (value) => value.toLocaleString('id-ID')
        }
      }
    }
  }

  return (
    <div className="client-detail-page">
      <PageHeader
        title={client.name}
        subtitle={`Riwayat Pemesanan dan Model Busana Kustom yang Pernah Dikerjakan untuk ${client.name}`}
        breadcrumb={client.name}
      />

      <section style={{ padding: '2rem 0 5rem 0' }}>
        <div className="container">
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-border)',
              borderTop: '4px solid var(--color-primary)',
              boxShadow: 'var(--shadow-sm)',
              padding: '2.5rem',
              marginBottom: '3.5rem'
            }}
          >
            <div
              className="client-detail-top-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
                gap: '2.5rem',
                alignItems: 'start',
                paddingBottom: '2.25rem',
                borderBottom: '1px solid var(--color-border-subtle)'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Building2 size={18} style={{ color: 'var(--color-primary)' }} />
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: 'var(--color-accent)'
                    }}
                  >
                    {client.category}
                  </span>
                </div>

                <h1
                  style={{
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: 'var(--color-primary-dark)',
                    margin: 0,
                    lineHeight: 1.25
                  }}
                >
                  {client.name}
                </h1>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', marginTop: '0.25rem' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--color-bg-light)',
                      border: '1px solid var(--color-border)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: 'var(--color-text-main)'
                    }}
                  >
                    <MapPin size={14} style={{ color: 'var(--color-primary)' }} />
                    <span>{client.city}</span>
                  </div>

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--color-bg-light)',
                      border: '1px solid var(--color-border)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: 'var(--color-text-main)'
                    }}
                  >
                    <Calendar size={14} style={{ color: 'var(--color-primary)' }} />
                    <span>Kemitraan Sejak {client.since}</span>
                  </div>

                  {client.contactPerson && (
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.35rem 0.75rem',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--color-bg-light)',
                        border: '1px solid var(--color-border)',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: 'var(--color-text-main)'
                      }}
                    >
                      <CheckCircle2 size={14} style={{ color: 'var(--color-primary)' }} />
                      <span>PIC: {client.contactPerson}</span>
                    </div>
                  )}
                </div>

                {client.summary?.includes('<') ? (
                  <div
                    className="rich-content-view"
                    style={{
                      fontSize: '0.9375rem',
                      color: 'var(--color-text-muted)',
                      lineHeight: 1.7,
                      margin: '0.5rem 0 0 0'
                    }}
                    dangerouslySetInnerHTML={{ __html: client.summary }}
                  />
                ) : (
                  <p
                    style={{
                      fontSize: '0.9375rem',
                      color: 'var(--color-text-muted)',
                      lineHeight: 1.7,
                      margin: '0.5rem 0 0 0'
                    }}
                  >
                    {client.summary}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div
                  style={{
                    background: 'var(--color-primary-soft)',
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-primary-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)', display: 'block', marginBottom: '0.2rem' }}>
                      TOTAL VOLUME PEMESANAN
                    </span>
                    <div style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                      {client.totalPcs}
                    </div>
                  </div>
                  <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'rgba(128, 0, 128, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                    <Package size={20} />
                  </div>
                </div>

                <div
                  style={{
                    background: 'var(--color-bg-light)',
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-accent)', display: 'block', marginBottom: '0.2rem' }}>
                      PERIODE KERJASAMA
                    </span>
                    <div style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                      {client.totalOrders}
                    </div>
                  </div>
                  <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'var(--color-accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent-hover)' }}>
                    <Calendar size={20} />
                  </div>
                </div>

                <div
                  style={{
                    background: 'var(--color-bg-light)',
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-accent)', display: 'block', marginBottom: '0.2rem' }}>
                      VARIAN MODEL BUSANA
                    </span>
                    <div style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                      {client.orderedProducts?.length || 0} Model
                    </div>
                  </div>
                  <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'var(--color-accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent-hover)' }}>
                    <Layers size={20} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ paddingTop: '2.25rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  marginBottom: '1.75rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)', marginBottom: '0.25rem' }}>
                    <BarChart3 size={18} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      STATISTIK RIWAYAT KERJA SAMA
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: 0 }}>
                    Grafik Riwayat Pemesanan
                  </h2>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0' }}>
                    Visualisasi tren kuantitas produksi tahunan (pcs/setel) 5 tahun terakhir.
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    flexWrap: 'wrap',
                    background: 'var(--color-bg-light)',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78125rem', fontWeight: 600, color: 'var(--color-primary-dark)' }}>
                    <span style={{ width: '16px', height: '3px', borderRadius: '2px', background: '#3B82F6' }} />
                    <span>Volume Pemesanan (Pcs/Setel)</span>
                  </div>
                </div>
              </div>

              <div style={{ width: '100%', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                <div style={{ minWidth: '480px', height: '280px', position: 'relative' }}>
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div style={{ marginBottom: '1.75rem' }}>
              <span className="section-tag">KATALOG SERAGAM MITRA</span>
              <h2
                style={{
                  fontSize: '1.375rem',
                  fontWeight: 800,
                  color: 'var(--color-primary-dark)',
                  margin: '0.25rem 0 0.375rem 0'
                }}
              >
                Model Baju Yang Pernah Dipesan
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Katalog model seragam dan busana kustom yang diproduksi untuk {client.name}.
              </p>
            </div>

            <div className="products-grid">
              {(client.orderedProducts || []).map((product) => (
                <Link
                  key={product.id}
                  to={`/katalog/${product.id}`}
                  className="product-card product-card-clean"
                >
                  <div className="product-img-wrapper">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-img"
                      loading="lazy"
                    />
                  </div>

                  <div className="product-content">
                    <span className="product-category-text">{product.category}</span>
                    <h3 className="product-name">{product.name}</h3>

                    <div className="product-clean-origin">
                      <School size={15} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                      <span>{client.name}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
