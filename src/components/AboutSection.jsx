import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { aboutData } from '../data/siteData'

export default function AboutSection() {
  return (
    <section id="about" className="about-section">
      <div className="container">
        <div className="about-grid">
          <div className="about-image-wrapper reveal-left">
            <img
              src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1000&q=80"
              alt="Produksi Busana Azhar Collection"
              className="about-image-main"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1000&q=80'
              }}
            />

            <div className="about-stats-card reveal-up delay-200">
              {aboutData.stats.slice(0, 3).map((stat, idx) => (
                <div key={idx} className="stat-item">
                  <p className="stat-value">{stat.value}</p>
                  <p className="stat-label">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="about-text-content reveal-right delay-150">
            <span className="section-tag">{aboutData.tag}</span>
            <h1 className="section-title" style={{ textAlign: 'left' }}>
              {aboutData.title}
            </h1>
            <p className="about-p">{aboutData.paragraph1}</p>
            <p className="about-p">{aboutData.paragraph2}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84375rem', color: 'var(--color-primary-dark)', fontWeight: 600 }}>
                <CheckCircle2 size={16} style={{ color: 'var(--color-accent)' }} />
                <span>Pesanan 100% Kustom</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84375rem', color: 'var(--color-primary-dark)', fontWeight: 600 }}>
                <CheckCircle2 size={16} style={{ color: 'var(--color-accent)' }} />
                <span>Desain Timeless & Mutu Prima</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84375rem', color: 'var(--color-primary-dark)', fontWeight: 600 }}>
                <CheckCircle2 size={16} style={{ color: 'var(--color-accent)' }} />
                <span>Pemberdayaan Penjahit Rumahan</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.84375rem', color: 'var(--color-primary-dark)', fontWeight: 600 }}>
                <CheckCircle2 size={16} style={{ color: 'var(--color-accent)' }} />
                <span>Konsep Zero Waste Kain Perca</span>
              </div>
            </div>

            <div>
              <Link to="/tentang-kami" className="btn-primary">
                <span>Profil Azhar Collection</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
