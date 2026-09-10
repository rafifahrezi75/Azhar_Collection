import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle
} from 'lucide-react'
import { companyInfo } from '../data/siteData'
import { getLayananList } from '../firebase/adminService'

export default function Footer({
  onOpenQuote
}) {
  const [services, setServices] = useState([])

  useEffect(() => {
    let isMounted = true
    getLayananList().then((list) => {
      if (isMounted && list) setServices(list.slice(0, 5))
    })
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <footer className="footer-wrapper">
      <img src="/globe.png" alt="" className="footer-globe-bg" />

      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand-logo-container" style={{ marginBottom: '1.25rem' }}>
              <div className="brand-text-block">
                <span className="brand-title" style={{ fontSize: '1.25rem' }}>AZHAR</span>
                <span className="brand-tagline" style={{ fontSize: '0.625rem' }}>COLLECTION</span>
              </div>
            </div>

            <p style={{ fontSize: '0.84375rem', color: 'rgba(255, 255, 255, 0.72)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Produsen konveksi dan garment terpercaya di Sidoarjo. Melayani pesanan kustom seragam sekolah, batik identitas, kemeja PDH/PDL, jas almamater, dan pakaian dinas dengan mutu jahitan rapi bergaransi.
            </p>

            <div className="footer-social-links">
              <a
                href={companyInfo.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-icon"
                aria-label="Facebook"
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                </svg>
              </a>
              <a
                href={companyInfo.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-icon"
                aria-label="Instagram"
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href={companyInfo.socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-icon"
                aria-label="WhatsApp"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="footer-col-title">Navigasi Halaman</h4>
            <ul className="footer-links-list">
              <li className="footer-link-item"><Link to="/">Beranda Utama</Link></li>
              <li className="footer-link-item"><Link to="/tentang-kami">Tentang Kami</Link></li>
              <li className="footer-link-item"><Link to="/layanan">Layanan Konveksi</Link></li>
              <li className="footer-link-item"><Link to="/katalog">Katalog Baju Kustom</Link></li>
              <li className="footer-link-item"><Link to="/klien">Daftar Klien & Mitra</Link></li>
              <li className="footer-link-item"><Link to="/berita">Kabar & Berita</Link></li>
              <li className="footer-link-item"><Link to="/kontak">Kontak & Workshop</Link></li>
              <li className="footer-link-item">
                <Link
                  to="/layanan#panduan-ukuran"
                  style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.84375rem' }}
                >
                  Panduan Ukuran (SNI)
                </Link>
              </li>
              <li className="footer-link-item">
                <button
                  type="button"
                  onClick={onOpenQuote}
                  style={{ color: 'var(--color-accent)', fontSize: '0.84375rem', fontWeight: 600, padding: 0, textAlign: 'left' }}
                >
                  Konsultasi Pesanan via WhatsApp
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Layanan Pilihan</h4>
            <ul className="footer-links-list">
              {services.length > 0 ? (
                services.map((item) => (
                  <li key={item.id} className="footer-link-item">
                    <Link
                      to={`/layanan/${item.slug || item.id}`}
                      style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.84375rem' }}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="footer-link-item">
                  <Link
                    to="/layanan"
                    style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.84375rem' }}
                  >
                    Semua Layanan Konveksi
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Kontak & Workshop</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8125rem', color: 'rgba(255, 255, 255, 0.75)' }}>
              <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start' }}>
                <MapPin size={16} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '2px' }} />
                <span>{companyInfo.address}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
                <Phone size={16} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                <span>{companyInfo.phonePrimary} (Ach. Haris)</span>
              </div>
              <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
                <Phone size={16} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                <span>{companyInfo.phoneSecondary} (Lazuardi)</span>
              </div>
              <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
                <Mail size={16} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                <span>{companyInfo.email}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
                <Clock size={16} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                <span>{companyInfo.workingHours}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} {companyInfo.name}. Seluruh hak cipta dilindungi.
          </div>
          <div>Dibuat dengan standar kualitas konveksi terbaik di Sidoarjo.</div>
        </div>
      </div>
    </footer>
  )
}
