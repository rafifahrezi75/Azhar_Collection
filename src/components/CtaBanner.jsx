import { Link } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'

export default function CtaBanner() {
  return (
    <section className="cta-banner-section">
      <div className="cta-banner-overlay" />
      <div className="container">
        <div className="cta-banner-content">
          <h2 className="cta-title">Siap Memulai Produksi Seragam Sekolah atau Instansi Anda?</h2>
          <p className="cta-subtitle">
            Konsultasikan desain kustom, sampel kain, dan estimasi anggaran produksi bersama tim spesialis kami hari ini secara gratis.
          </p>
          <Link
            to="/kontak"
            className="btn-primary"
            style={{ padding: '1rem 2.25rem', fontSize: '1rem', borderRadius: '4px' }}
          >
            <MessageSquare size={18} />
            <span>Hubungi Tim Kami Sekarang</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
