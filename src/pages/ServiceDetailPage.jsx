import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { servicesData as fallbackServices, companyInfo } from '../data/siteData'
import { getLayananList } from '../firebase/adminService'
import {
  ArrowLeft,
  Ruler,
  Phone,
  ChevronRight
} from 'lucide-react'

export default function ServiceDetailPage() {
  const { slug } = useParams()
  const [services, setServices] = useState(fallbackServices)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    getLayananList().then((list) => {
      if (isMounted) {
        if (list) setServices(list)
        setIsLoading(false)
      }
    })
    return () => {
      isMounted = false
    }
  }, [])

  const service = services.find((s) => s.slug === slug || s.id === slug)

  if (isLoading) {
    return (
      <div className="service-detail-page">
        <PageHeader
          title="Memuat Layanan..."
          subtitle="Mengambil detail layanan konveksi Azhar Collection"
          breadcrumb="Detail Layanan"
        />
        <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>Sedang memuat data...</p>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="service-detail-page">
        <PageHeader
          title="Layanan Tidak Ditemukan"
          subtitle="Halaman layanan yang Anda tuju tidak tersedia atau rute tautan salah."
          breadcrumb="Detail Layanan"
        />
        <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            Silakan kembali ke halaman layanan untuk melihat seluruh spesifikasi busana dan penjahitan kami.
          </p>
          <Link to="/layanan" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={16} />
            <span>Kembali ke Daftar Layanan</span>
          </Link>
        </div>
      </div>
    )
  }

  const otherServices = services.filter((s) => s.id !== service.id)

  return (
    <div className="service-detail-page">
      <PageHeader
        title={service.title}
        subtitle="Spesifikasi Rinci, Bahan Baku Rekomendasi, dan Alur Pengerjaan Kustom"
        breadcrumb={service.title}
      />

      <section style={{ padding: '3rem 0 4rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2.5rem', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                <img
                  src={service.image}
                  alt={service.title}
                  style={{ width: '100%', height: '380px', objectFit: 'cover' }}
                />
                <div style={{ padding: '2.25rem' }}>
                  <span className="section-tag" style={{ marginBottom: '0.75rem' }}>LAYANAN KONVEKSI SPESIALIS</span>
                  <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: '0.25rem 0 1rem 0' }}>
                    {service.title}
                  </h1>
                  {service.fullDesc?.includes('<') ? (
                    <div
                      className="rich-content-view"
                      style={{ fontSize: '1rem', color: 'var(--color-text-main)', lineHeight: 1.8, marginBottom: '2rem' }}
                      dangerouslySetInnerHTML={{ __html: service.fullDesc }}
                    />
                  ) : (
                    <p style={{ fontSize: '1rem', color: 'var(--color-text-main)', lineHeight: 1.8, marginBottom: '2rem' }}>
                      {service.fullDesc}
                    </p>
                  )}

                  <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.75rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '1rem' }}>
                      Spesifikasi & Standar Produksi
                    </h3>
                    <table className="spec-table">
                      <tbody>
                        <tr>
                          <th style={{ width: '35%' }}>Bahan Kain Rekomendasi</th>
                          <td>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                              {service.materials?.map((m, idx) => (
                                <span key={idx} style={{ background: 'var(--color-bg-light)', padding: '0.25rem 0.625rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary-dark)' }}>
                                  {m}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <th>Minimum Pemesanan (MOQ)</th>
                          <td style={{ fontWeight: 600, color: 'var(--color-primary-dark)' }}>{service.moq}</td>
                        </tr>
                        <tr>
                          <th>Estimasi Waktu Pengerjaan</th>
                          <td>{service.leadTime}</td>
                        </tr>
                        <tr>
                          <th>Standar Jahitan</th>
                          <td>Obras 4 benang rapi, double stitch di area krusial, dan bordir komputer 12 kepala presisi</td>
                        </tr>
                        <tr>
                          <th>Layanan Sampel</th>
                          <td>Tersedia pembuatan dummy / master sample untuk persetujuan model sebelum jahit massal</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {otherServices.length > 0 && (
                <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-lg)', padding: '1.75rem', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-primary-dark)', marginBottom: '1.25rem' }}>
                    Layanan Lainnya
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    {otherServices.map((item) => (
                      <Link
                        key={item.id}
                        to={`/layanan/${item.slug || item.id}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--radius-md)',
                          background: 'var(--color-bg-light)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-primary-dark)',
                          textDecoration: 'none',
                          fontSize: '0.84375rem',
                          fontWeight: 600,
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        <span>{item.title}</span>
                        <ChevronRight size={16} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-lg)', padding: '1.75rem', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem', color: 'var(--color-accent)' }}>
                  <Ruler size={20} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>PANDUAN UKURAN</span>
                </div>
                <h4 style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
                  Standar Ukuran Nasional (SNI)
                </h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  Gunakan tabel acuan ukuran SD, SMP, SMA, dan baju kerja untuk akurasi pendataan ukuran sebelum proses jahit massal.
                </p>
                <Link
                  to="/layanan#panduan-ukuran"
                  className="btn-outline"
                  style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.8125rem', padding: '0.625rem', textDecoration: 'none' }}
                >
                  <Ruler size={14} />
                  <span>Lihat Tabel Ukuran Lengkap</span>
                </Link>
              </div>

              <div style={{ background: 'var(--color-primary-dark)', color: '#FFFFFF', borderRadius: 'var(--radius-lg)', padding: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
                <h4 style={{ fontSize: '1.0625rem', fontWeight: 800, marginBottom: '0.75rem', color: '#FFFFFF' }}>
                  Workshop & Konveksi
                </h4>
                <p style={{ fontSize: '0.8125rem', color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {companyInfo.address}
                </p>
                <a
                  href={`tel:${companyInfo.phonePrimary}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 700 }}
                >
                  <Phone size={16} />
                  <span>{companyInfo.phonePrimary}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

