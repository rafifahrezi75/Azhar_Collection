import { useState, useEffect } from 'react'
import PageHeader from '../components/PageHeader'
import {
  ShieldCheck,
  Award,
  Scissors,
  GraduationCap,
  Cpu,
  Building2,
  Trophy,
  CheckCircle2
} from 'lucide-react'
import { getCompanySettings, getTimelineList } from '../firebase/adminService'

const ICON_MAP = [Scissors, GraduationCap, Cpu, Building2, Trophy]

export default function AboutPage() {
  const [settings, setSettings] = useState(null)
  const [journeyMilestones, setJourneyMilestones] = useState([])

  useEffect(() => {
    let isMounted = true
    const fetchData = async () => {
      const [compData, timelineData] = await Promise.all([
        getCompanySettings(),
        getTimelineList()
      ])
      if (isMounted) {
        if (compData) setSettings(compData)
        if (timelineData && timelineData.length > 0) {
          setJourneyMilestones(timelineData)
        }
      }
    }
    fetchData()
    return () => {
      isMounted = false
    }
  }, [])

  const visionText = settings?.vision ||
    'Menjadi produsen konveksi dan garment terdepan di Indonesia yang dipercaya karena keaslian bahan baku, standar jahitan prima, ketepatan waktu distribusi, dan integritas kemitraan jangka panjang bersama lembaga pendidikan maupun instansi kedinasan.'

  const defaultMissionText = `Mengutamakan bahan kain otentik bersertifikat (Famatex, Oxford Super, Nagata Drill).
Menerapkan sistem manajemen produksi terpadu dengan pengawasan mutu tiga lapis.
Memberdayakan tenaga jahit lokal terampil dengan apresiasi dan lingkungan kerja yang bermartabat.
Memberikan harga langsung produsen tanpa mata rantai perantara yang membebani sekolah.`

  const rawMission = settings?.mission || defaultMissionText
  const missionItems = rawMission
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)

  return (
    <div className="about-page">
      <PageHeader
        title="Tentang Azhar Collection"
        subtitle="Rekam Jejak Dedikasi Perjalanan Usaha, Visi, dan Misi Azhar Collection Sejak 2004 di Sidoarjo"
        breadcrumb="Tentang Kami"
      />

      <section className="career-journey-section">
        <div className="container">
          <div className="journey-header">
            <span className="section-tag">REKAM JEJAK & DEDIKASI</span>
            <h2 className="section-title">Perjalanan Karir & Usaha</h2>
            <p className="section-subtitle">
              Tahapan pertumbuhan Azhar Collection dari penjahit mandiri hingga menjadi mitra produsen busana tepercaya bagi ratusan lembaga.
            </p>
          </div>

          <div className="journey-zigzag-wrapper">
            <div className="journey-central-line" />

            <div className="journey-zigzag-list">
              {journeyMilestones.map((item, idx) => {
                const IconComponent = ICON_MAP[idx % ICON_MAP.length] || Scissors
                const isEven = idx % 2 === 0
                return (
                  <div
                    key={item.id || idx}
                    className={`journey-zigzag-row ${isEven ? 'row-left' : 'row-right'}`}
                  >
                    <div className="journey-center-node">
                      <IconComponent size={20} />
                    </div>

                    <div className="journey-normal-card">
                      <div className="journey-card-top">
                        <span className="journey-year-tag">{item.year}</span>
                        <span className="journey-badge-pill">{item.badge}</span>
                      </div>
                      <h3 className="journey-card-heading">{item.title}</h3>
                      <p className="journey-card-text">{item.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '3.5rem 0', background: 'var(--color-bg-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2.5rem auto' }}>
            <span className="section-tag">NILAI UTAMA KAMI</span>
            <h2 className="section-title">Visi & Misi Perusahaan</h2>
            <p className="section-subtitle">
              Pilar yang melandasi setiap helai jahitan dan kemitraan berkelanjutan bersama sekolah dan instansi di seluruh Indonesia.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem' }}>
            <div style={{ background: '#FFFFFF', padding: '2.25rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '4px', background: 'var(--color-primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
                <Award size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)', marginBottom: '0.75rem' }}>
                Visi Azhar Collection
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                {visionText}
              </p>
            </div>

            <div style={{ background: '#FFFFFF', padding: '2.25rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '4px', background: 'var(--color-accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)', marginBottom: '1.25rem' }}>
                <ShieldCheck size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)', marginBottom: '0.75rem' }}>
                Misi Azhar Collection
              </h3>
              <ul style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.7, paddingLeft: '0', display: 'flex', flexDirection: 'column', gap: '0.625rem', listStyle: 'none' }}>
                {missionItems.map((point, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
                    <CheckCircle2 size={16} style={{ color: 'var(--color-primary)', marginTop: '0.2rem', flexShrink: 0 }} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
