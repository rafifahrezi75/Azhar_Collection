import PageHeader from '../components/PageHeader'
import ServicesSection from '../components/ServicesSection'
import SizeGuideSection from '../components/SizeGuideSection'
import { MessageSquare, Scissors, Cpu, CheckCircle2, Truck } from 'lucide-react'

export default function ServicesPage() {
  const steps = [
    {
      step: '01',
      title: 'Konsultasi & Pilihan Bahan',
      desc: 'Diskusikan model seragam, kebutuhan kain (Famatex, Oxford, Drill), jumlah pesanan, dan anggaran bersama tim kami.',
      icon: <MessageSquare size={24} />
    },
    {
      step: '02',
      title: 'Pola & Sampel (Dummy)',
      desc: 'Pembuatan pola potong presisi dan sampel awal seragam untuk persetujuan model dan ukuran sebelum produksi massal.',
      icon: <Scissors size={24} />
    },
    {
      step: '03',
      title: 'Produksi & Bordir Komputer',
      desc: 'Proses penjahitan oleh tim terampil dan bordir badge logo sekolah menggunakan mesin bordir multi-head 12 kepala.',
      icon: <Cpu size={24} />
    },
    {
      step: '04',
      title: 'Quality Control & Finishing',
      desc: 'Pemeriksaan benang sisa, toleransi ukuran, setrika uap industri suhu tinggi, dan kemasan plastik bersih per pcs.',
      icon: <CheckCircle2 size={24} />
    },
    {
      step: '05',
      title: 'Distribusi & Bergaransi',
      desc: 'Pengiriman aman langsung ke alamat sekolah atau instansi Anda di Jawa Timur maupun seluruh penjuru Indonesia.',
      icon: <Truck size={24} />
    }
  ]

  return (
    <div className="services-page">
      <PageHeader
        title="Layanan Konveksi & Garment"
        subtitle="Solusi Jahit Kustom Skala Menengah hingga Partai Besar untuk Sekolah, Lembaga, dan Perusahaan"
        breadcrumb="Layanan"
      />

      <ServicesSection />

      <section style={{ padding: '4rem 0', background: 'var(--color-bg-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem auto' }}>
            <span className="section-tag">ALUR KERJA MUDAH & TRANSPARAN</span>
            <h2 className="section-title">5 Tahap Proses Pemesanan Kustom</h2>
            <p className="section-subtitle">
              Sistem pengerjaan terstruktur demi menjamin kesesuaian desain, kualitas kain, dan ketepatan waktu pengiriman.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {steps.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: '#FFFFFF',
                  padding: '1.75rem 1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--color-border)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: 'var(--color-primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                    {item.icon}
                  </div>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-border)', letterSpacing: '0.05em' }}>
                    {item.step}
                  </span>
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginTop: 'auto' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SizeGuideSection />
    </div>
  )
}
