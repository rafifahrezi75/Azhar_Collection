import { Link } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'

export default function CtaBanner() {
  return (
    <section className="cta-banner-section">
      <div className="cta-banner-overlay" />
      <div className="container">
        <div className="cta-banner-content">
          <h2 className="cta-title">Siap Memproduksi Seragam Bergaransi Kualitas Nomor 1?</h2>
          <p className="cta-subtitle">
            Dapatkan sampel gratis, penawaran harga terbaik, dan garansi retur gratis 100% dari produsen konveksi Azhar Collection hari ini!
          </p>
          <Link
            to="/kontak"
            className="btn-primary"
            style={{ padding: '1rem 2.25rem', fontSize: '1rem', borderRadius: '4px' }}
          >
            <MessageSquare size={18} />
            <span>Hubungi Tim Marketing & Pesan Sekarang</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
