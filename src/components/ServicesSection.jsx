import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  GraduationCap,
  Briefcase,
  Award,
  Shirt,
  Cpu,
  Scissors,
  ArrowRight
} from 'lucide-react'
import { getLayananList } from '../firebase/adminService'
import { servicesData as fallbackServices } from '../data/siteData'

export default function ServicesSection({ limit }) {
  const [services, setServices] = useState(fallbackServices)

  useEffect(() => {
    let isMounted = true
    getLayananList().then((list) => {
      if (isMounted && list) setServices(list)
    })
    return () => {
      isMounted = false
    }
  }, [])

  const getServiceIcon = (iconName) => {
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap size={36} />
      case 'Briefcase':
        return <Briefcase size={36} />
      case 'Award':
        return <Award size={36} />
      case 'Shirt':
        return <Shirt size={36} />
      case 'Cpu':
        return <Cpu size={36} />
      case 'Scissors':
        return <Scissors size={36} />
      default:
        return <Shirt size={36} />
    }
  }

  const displayedServices = limit ? services.slice(0, limit) : services

  return (
    <section id="services" className="services-section">
      <div className="container">
        <div className="services-header">
          <span className="section-tag">LAYANAN KAMI</span>
          <h2 className="section-title">Solusi Konveksi & Pakaian Kustom</h2>
          <p className="section-subtitle">
            Berbagai layanan penjahitan busana massal dan kustom untuk kebutuhan sekolah, dinas instansi, perkantoran, dan komunitas.
          </p>
        </div>

        {displayedServices.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: 'var(--color-bg-light)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--color-border)' }}>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: 0 }}>
              Belum ada layanan yang ditampilkan. Silakan tambahkan layanan baru melalui Admin Panel.
            </p>
          </div>
        ) : (
          <div className="services-grid">
            {displayedServices.map((item) => (
              <Link
                key={item.id}
                to={`/layanan/${item.slug || item.id}`}
                className="service-card"
              >
                <div className="service-card-bg">
                  {item.image && <img src={item.image} alt={item.title} />}
                  <div className="service-card-bg-overlay" />
                </div>

                <div className="service-card-content">
                  <div className="service-card-icon">
                    {getServiceIcon(item.icon)}
                  </div>

                  <h3 className="service-card-title">{item.title}</h3>
                  <p className="service-card-desc">{item.shortDesc || item.desc}</p>

                  <div className="service-card-action">
                    <span>Lihat Detail Spesifikasi</span>
                    <ArrowRight size={15} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

