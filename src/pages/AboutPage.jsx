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
    'Menjadi perusahaan konveksi nasional terpercaya untuk seragam olahraga sekolah serta didukung lini mukena, jilbab serta produk hiasan dari kain perca yang berkelanjutan (sustain). Memberdayakan ekonomi masyarakat sekitar dengan jangkauan pasar ke seluruh pulau di Indonesia pada tahun 2032.'

  const defaultMissionText = `Menjamin kualitas seragam olahraga nomor satu melalui kontrol bahan baku dan proses jahit yang ketat serta sertifikasi standar mutu.
Menciptakan desain seragam yang timeless (tidak mengikuti fast fashion) sehingga bisa dipakai minimal 3 tahun tanpa perlu ganti model.
Memperluas pasar ke luar pulau melalui promosi digital dan kemitraan dengan dinas pendidikan.
Merekrut dan melatih ulang karyawan rumahan dengan sistem insentif berdasarkan ketepatan waktu, bukan hanya jumlah jahitan.
Memberdayakan minimal 20 ibu-ibu tetangga sebagai penjahit & perajin hiasan dari kain perca.
Menjalankan pemasaran digital terintegrasi (Instagram, TikTok, WhatsApp Business, website).`

  const rawMission = settings?.mission || defaultMissionText
  const missionItems = rawMission
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)

  return (
    <div className="about-page">
      <PageHeader
        title="Tentang Azhar Collection"
        subtitle="Produsen Konveksi & Jahit Kustom Terpercaya dengan Pengawasan Mutu QC Ketat & Garansi Retur 100% Cacat Gratis"
        breadcrumb="Tentang Kami"
      />

      <section className="career-journey-section">
        <div className="container">
          <div className="journey-header">
            <span className="section-tag">PERJALANAN DEDIKASI KUALITAS</span>
            <h2 className="section-title">Sejarah Usaha Jahit & Rekam Jejak Prestasi</h2>
            <p className="section-subtitle">
              Tahapan pertumbuhan Azhar Collection dari tradisi jahit keluarga hingga menjadi produsen konveksi tepercaya bagi ratusan lembaga di seluruh Indonesia.
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

      <section style={{ padding: '4.5rem 0', background: 'var(--color-bg-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'left', maxWidth: '720px', marginBottom: '2.5rem' }}>
            <span className="section-tag" style={{ display: 'inline-block', marginBottom: '0.5rem' }}>
              NILAI UTAMA KAMI
            </span>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '0.75rem' }}>
              Visi & Misi Perusahaan
            </h2>
            <p className="section-subtitle" style={{ textAlign: 'left', margin: 0, lineHeight: 1.7 }}>
              Pilar strategis yang melandasi setiap helai jahitan, komitmen mutu prima, dan kemitraan berkelanjutan bersama sekolah serta instansi di seluruh Indonesia.
            </p>
          </div>

          <div className="visi-misi-cards-row">
            <div style={{ background: '#FFFFFF', padding: '2.25rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '4px', background: 'var(--color-primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                  <Award size={24} />
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: 0 }}>
                  Visi
                </h3>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.75, margin: 0 }}>
                {visionText}
              </p>
            </div>

            <div style={{ background: '#FFFFFF', padding: '2.25rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '4px', background: 'var(--color-accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)', flexShrink: 0 }}>
                  <ShieldCheck size={24} />
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: 0 }}>
                  Misi
                </h3>
              </div>
              <ul style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.75, paddingLeft: '0', display: 'flex', flexDirection: 'column', gap: '0.75rem', listStyle: 'none', margin: 0 }}>
                {missionItems.map((point, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
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
