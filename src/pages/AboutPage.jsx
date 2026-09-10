import PageHeader from '../components/PageHeader'
import {
  ShieldCheck,
  Award,
  Scissors,
  GraduationCap,
  Cpu,
  Building2,
  Trophy
} from 'lucide-react'

export default function AboutPage() {
  const journeyMilestones = [
    {
      year: '2004',
      title: 'Awal Berdiri & Usaha Jahit Mandiri',
      desc: 'Memulai usaha jahit rumahan dan pakaian kustom lokal di Damarsi, Buduran, Sidoarjo dengan mengutamakan kerapian potongan jahitan.',
      badge: 'Langkah Pertama',
      icon: Scissors
    },
    {
      year: '2010',
      title: 'Kemitraan Koperasi Sekolah',
      desc: 'Dipercaya menjadi rekanan penyedia seragam sekolah reguler merah putih dan pramuka untuk puluhan SD dan SMP di wilayah Sidoarjo.',
      badge: 'Ekspansi Sekolah',
      icon: GraduationCap
    },
    {
      year: '2015',
      title: 'Modernisasi Mesin Bordir Komputer',
      desc: 'Pengadaan mesin bordir komputer otomatis 12 kepala multi-head untuk memproses ribuan badge logo dan emblem dengan presisi tinggi.',
      badge: 'Teknologi Modern',
      icon: Cpu
    },
    {
      year: '2019',
      title: 'Perluasan Tender Instansi & Kampus',
      desc: 'Memperluas layanan jahit kemeja dinas PDH/PDL instansi pemerintah, jas almamater universitas, dan seragam santri pondok pesantren.',
      badge: 'Skala Nasional',
      icon: Building2
    },
    {
      year: '2024 - Sekarang',
      title: 'Produsen Tepercaya Lebih Dari 500 Mitra',
      desc: 'Didukung puluhan penjahit profesional berkapasitas ribuan setel per bulan dengan komitmen harga produsen tangan pertama.',
      badge: 'Masa Kini',
      icon: Trophy
    }
  ]

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
                const IconComponent = item.icon
                const isEven = idx % 2 === 0
                return (
                  <div
                    key={idx}
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
              <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'var(--color-primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', marginBottom: '1.25rem' }}>
                <Award size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)', marginBottom: '0.75rem' }}>
                Visi Azhar Collection
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                Menjadi produsen konveksi dan garment terdepan di Indonesia yang dipercaya karena keaslian bahan baku, standar jahitan prima, ketepatan waktu distribusi, dan integritas kemitraan jangka panjang bersama lembaga pendidikan maupun instansi kedinasan.
              </p>
            </div>

            <div style={{ background: '#FFFFFF', padding: '2.25rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'var(--color-accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)', marginBottom: '1.25rem' }}>
                <ShieldCheck size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)', marginBottom: '0.75rem' }}>
                Misi Azhar Collection
              </h3>
              <ul style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.7, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li>Mengutamakan bahan kain otentik bersertifikat (Famatex, Oxford Super, Nagata Drill).</li>
                <li>Menerapkan sistem manajemen produksi terpadu dengan pengawasan mutu tiga lapis.</li>
                <li>Memberdayakan tenaga jahit lokal terampil dengan apresiasi dan lingkungan kerja yang bermartabat.</li>
                <li>Memberikan harga langsung produsen tanpa mata rantai perantara yang membebani sekolah.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
