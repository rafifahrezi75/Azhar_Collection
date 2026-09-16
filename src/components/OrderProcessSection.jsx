import { MessageSquare, Scissors, Cpu, CheckCircle2, Truck } from 'lucide-react'

export default function OrderProcessSection() {
  const steps = [
    {
      step: '01',
      title: 'Konsultasi & Penawaran',
      desc: 'Diskusikan desain, ukuran, bahan, logo, jumlah pesanan, dan anggaran untuk mendapatkan penawaran yang sesuai.',
      icon: <MessageSquare size={24} />
    },
    {
      step: '02',
      title: 'Persiapan Bahan Baku',
      desc: 'Kami menyiapkan kain, benang, bahan pendukung, dan tinta sablon sesuai kebutuhan pesanan dengan pengecekan kualitas awal.',
      icon: <Scissors size={24} />
    },
    {
      step: '03',
      title: 'Produksi & Sablon',
      desc: 'Pola dibuat sesuai ukuran, kemudian kain dipotong, dijahit, dan diberi logo atau tulisan menggunakan teknik sablon yang sesuai.',
      icon: <Cpu size={24} />
    },
    {
      step: '04',
      title: 'Quality Control & Packing',
      desc: 'Setiap seragam diperiksa dari segi ukuran, jahitan, logo, dan kebersihan sebelum dilipat, diberi label, dan dikemas rapi.',
      icon: <CheckCircle2 size={24} />
    },
    {
      step: '05',
      title: 'Pengiriman & Garansi',
      desc: 'Pesanan dikirim dengan aman ke alamat tujuan dan dilengkapi resi serta layanan perbaikan atau penggantian jika terdapat cacat produksi.',
      icon: <Truck size={24} />
    }
  ]

  const bgImageUrl = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1600&q=80'

  return (
    <section
      className="order-process-section"
      style={{
        padding: '5rem 0',
        position: 'relative',
        backgroundImage: `linear-gradient(135deg, rgba(45, 8, 49, 0.92) 0%, rgba(74, 14, 78, 0.94) 100%), url("${bgImageUrl}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: '#FFFFFF'
      }}
    >
      <div className="container">
        <div className="reveal-up" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem auto' }}>
          <span
            className="section-tag"
            style={{
              background: 'transparent',
              border: 'none',
              boxShadow: 'none',
              color: 'var(--color-accent)',
              padding: 0,
              marginBottom: '0.5rem',
              display: 'inline-block'
            }}
          >
            CARA MUDAH PESAN SERAGAM BERGARANSI
          </span>
          <h2 className="section-title" style={{ color: '#FFFFFF' }}>
            5 Tahap Mudah Pemesanan Seragam Kustom
          </h2>
          <p className="section-subtitle" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
            Dari konsultasi sampel gratis, penentuan spesifikasi bahan, produksi terstandar, pengawasan QC 100%, hingga garansi penggantian cacat gratis!
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {steps.map((item, idx) => (
            <div
              key={idx}
              className={`reveal-up delay-${Math.min((idx % 5) * 100 + 100, 500)}`}
              style={{
                background: 'rgba(255, 255, 255, 0.96)',
                padding: '1.75rem 1.25rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '6px', background: 'var(--color-primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                  {item.icon}
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-light)', opacity: 0.7, letterSpacing: '0.05em' }}>
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
  )
}
