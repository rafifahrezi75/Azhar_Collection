import { Link } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'

export default function CtaBanner() {
  return (
    <section className="cta-banner-section">
      <div className="cta-banner-overlay" />
      <div className="container">
        <div className="cta-banner-content reveal-scale">
          <h2 className="cta-title">Punya Rencana Pengadaan Seragam atau Baju Kerja?</h2>
          <p className="cta-subtitle">
            Konsultasikan kebutuhan bahan, jumlah pesanan, dan jadwal pengerjaan langsung bersama tim Azhar Collection.
          </p>
          <Link
            to="/kontak"
            className="btn-primary"
            style={{ padding: '1rem 2.25rem', fontSize: '1rem', borderRadius: '4px' }}
          >
            <MessageSquare size={18} />
            <span>Mulai Konsultasi Pesanan</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
