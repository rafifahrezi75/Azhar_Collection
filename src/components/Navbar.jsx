import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  MapPin,
  Phone,
  Mail,
  Menu,
  X,
  MessageSquare
} from 'lucide-react'
import { companyInfo } from '../data/siteData'

export default function Navbar({ onOpenQuote }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { label: 'Beranda', to: '/' },
    { label: 'Tentang Kami', to: '/tentang-kami' },
    { label: 'Layanan', to: '/layanan' },
    { label: 'Katalog', to: '/katalog' },
    { label: 'Klien Kami', to: '/klien' },
    { label: 'Berita', to: '/berita' },
    { label: 'Kontak', to: '/kontak' }
  ]

  return (
    <>
      <header className="header-wrapper">
        <div className="top-bar">
          <div className="container top-bar-inner">
            <div className="top-bar-left">
              <div className="top-bar-item">
                <MapPin size={14} />
                <span>Damarsi, Buduran - Sidoarjo</span>
              </div>
              <a href={`mailto:${companyInfo.email}`} className="top-bar-item">
                <Mail size={14} />
                <span>{companyInfo.email}</span>
              </a>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginLeft: 'auto' }}>
              <a
                href={`tel:${companyInfo.phonePrimary}`}
                className="top-bar-item"
                style={{ fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none' }}
              >
                <Phone size={13} />
                <span>{companyInfo.phonePrimary}</span>
              </a>

              <button
                type="button"
                className="mobile-toggle-btn"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                aria-label="Buka menu navigasi"
              >
                {isMobileOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>

        <div className={`nav-body ${isScrolled ? 'scrolled' : ''}`}>
          <div className="container nav-inner">
            <Link to="/" className="brand-logo-container" onClick={() => setIsMobileOpen(false)}>
              <div className="brand-text-block">
                <span className="brand-title">AZHAR</span>
                <span className="brand-tagline">COLLECTION</span>
              </div>
            </Link>

            <nav className="nav-links-desktop">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                type="button"
                onClick={onOpenQuote}
                className="btn-primary"
                style={{ padding: '0.625rem 1.25rem', fontSize: '0.84375rem' }}
              >
                <MessageSquare size={16} />
                <span>Konsultasi Pesanan</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        className={`mobile-backdrop ${isMobileOpen ? 'open' : ''}`}
        onClick={() => setIsMobileOpen(false)}
      />

      <aside className={`mobile-drawer ${isMobileOpen ? 'open' : ''}`}>
        <div>
          <div className="drawer-header">
            <Link to="/" className="brand-logo-container" onClick={() => setIsMobileOpen(false)}>
              <div className="brand-text-block">
                <span className="brand-title" style={{ fontSize: '1.125rem' }}>AZHAR</span>
                <span className="brand-tagline" style={{ fontSize: '0.625rem' }}>COLLECTION</span>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              style={{ color: '#FFFFFF', padding: '0.25rem' }}
            >
              <X size={22} />
            </button>
          </div>

          <nav className="drawer-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) => `drawer-nav-item ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <a
              href={`tel:${companyInfo.phonePrimary}`}
              onClick={() => setIsMobileOpen(false)}
              className="btn-secondary"
              style={{ width: '100%', fontSize: '0.8125rem', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none' }}
            >
              <Phone size={16} />
              <span>{companyInfo.phonePrimary}</span>
            </a>
            <button
              type="button"
              onClick={() => {
                setIsMobileOpen(false)
                onOpenQuote()
              }}
              className="btn-primary"
              style={{ width: '100%', fontSize: '0.8125rem', padding: '0.75rem' }}
            >
              <MessageSquare size={16} />
              <span>Konsultasi Pesanan via WA</span>
            </button>
          </div>
        </div>

        <div className="drawer-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={14} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
            <span>Buduran, Sidoarjo</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Phone size={14} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
            <span>{companyInfo.phonePrimary}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Mail size={14} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
            <span>{companyInfo.email}</span>
          </div>
        </div>
      </aside>
    </>
  )
}
