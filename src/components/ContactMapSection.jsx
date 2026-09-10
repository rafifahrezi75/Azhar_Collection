import { useState } from 'react'
import { PhoneCall, MapPin, Mail, Phone, CheckCircle2, ExternalLink } from 'lucide-react'
import { companyInfo, marketingTeam } from '../data/siteData'
import { saveInquiry } from '../firebase/adminService'

export default function ContactMapSection({ showForm = true }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    telephone: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    saveInquiry({
      name: formData.fullName,
      institution: formData.email || '',
      whatsapp: formData.telephone,
      category: 'Formulir Kontak Web',
      estimatedQty: '-',
      message: formData.message,
      status: 'Baru'
    }).catch(() => {})

    const subject = encodeURIComponent(`Permintaan Penawaran dari ${formData.fullName}`)
    const body = encodeURIComponent(
      `Halo Azhar Collection,\n\n` +
      `Nama Lengkap: ${formData.fullName}\n` +
      `Email: ${formData.email}\n` +
      `Telepon: ${formData.telephone}\n\n` +
      `Pesan:\n${formData.message}\n\n` +
      `---\nPesan dikirim melalui formulir website Azhar Collection`
    )
    window.location.href = `mailto:${companyInfo.email}?subject=${subject}&body=${body}`
    setIsSubmitted(true)
  }

  return (
    <section id="contact" className="contact-map-section" style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        {showForm ? (
          <div className="contact-form-layout-grid">
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ paddingBottom: '0.625rem', borderBottom: '2px solid var(--color-border)', marginBottom: '0.875rem' }}>
                <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: 0 }}>
                  Leave us your info
                </h2>
              </div>

              <p style={{ fontSize: '0.84375rem', color: 'var(--color-text-muted)', margin: '0 0 1.25rem 0' }}>
                Dapatkan penawaran menarik dari kami
              </p>

              {isSubmitted && (
                <div style={{ background: 'var(--color-primary-soft)', border: '1px solid var(--color-primary-border)', padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'var(--color-primary-dark)', fontSize: '0.8125rem' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                  <span>Pesan telah disiapkan. Silakan kirimkan email yang terbuka di perangkat Anda menuju {companyInfo.email}.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '0.75rem' }}>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full Name*"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    fontSize: '0.84375rem',
                    color: 'var(--color-text-main)',
                    outline: 'none'
                  }}
                />

                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email*"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    fontSize: '0.84375rem',
                    color: 'var(--color-text-main)',
                    outline: 'none'
                  }}
                />

                <input
                  type="tel"
                  name="telephone"
                  required
                  value={formData.telephone}
                  onChange={handleChange}
                  placeholder="Telephone*"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    fontSize: '0.84375rem',
                    color: 'var(--color-text-main)',
                    outline: 'none'
                  }}
                />

                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Message*"
                  style={{
                    width: '100%',
                    flex: 1,
                    minHeight: '110px',
                    padding: '0.75rem 1rem',
                    background: '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    fontSize: '0.84375rem',
                    color: 'var(--color-text-main)',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />

                <button
                  type="submit"
                  style={{
                    alignSelf: 'flex-start',
                    background: 'var(--color-accent)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.75rem 2rem',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginTop: '0.25rem',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  Kirim Pesan
                </button>
              </form>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ paddingBottom: '0.625rem', borderBottom: '2px solid var(--color-border)', marginBottom: '0.875rem' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: 0 }}>
                    Location
                  </h2>
                </div>

                <div style={{ fontSize: '0.84375rem', color: 'var(--color-text-main)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                  <p style={{ fontWeight: 700, margin: '0 0 0.125rem 0', color: 'var(--color-primary-dark)' }}>
                    CV. AZHAR COLLECTION
                  </p>
                  <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
                    {companyInfo.address}
                  </p>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8125rem' }}>
                  <a
                    href={`mailto:${companyInfo.email}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary-dark)', textDecoration: 'none', fontWeight: 600 }}
                  >
                    <Mail size={15} style={{ color: 'var(--color-accent)' }} />
                    <span>{companyInfo.email}</span>
                  </a>

                  <a
                    href={`tel:${companyInfo.phonePrimary}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary-dark)', textDecoration: 'none', fontWeight: 600 }}
                  >
                    <Phone size={15} style={{ color: 'var(--color-accent)' }} />
                    <span>{companyInfo.phonePrimary}</span>
                  </a>
                </div>
              </div>

              <div>
                <div style={{ paddingBottom: '0.625rem', borderBottom: '2px solid var(--color-border)', marginBottom: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: 0 }}>
                    Map Lokasi
                  </h2>
                  <a
                    href={companyInfo.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <span>Buka di Google Maps</span>
                    <ExternalLink size={13} />
                  </a>
                </div>

                <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--color-border)', height: '185px' }}>
                  <iframe
                    src={companyInfo.mapsEmbedUrl}
                    title="Lokasi Azhar Collection Sidoarjo di Google Maps"
                    style={{ width: '100%', height: '100%', border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.75rem', marginTop: '0.25rem' }}>
                {marketingTeam.map((member) => (
                  <div
                    key={member.id}
                    style={{
                      background: '#FFFFFF',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          background: 'var(--color-primary-soft)',
                          color: 'var(--color-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.875rem',
                          flexShrink: 0
                        }}
                      >
                        {member.name.charAt(0)}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <h4 style={{ fontSize: '0.84375rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {member.name}
                        </h4>
                        <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', margin: '0.125rem 0 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {member.division}
                        </p>
                      </div>
                    </div>

                    <a
                      href={member.waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                      aria-label={`Hubungi ${member.name} via WhatsApp`}
                      title={`Hubungi ${member.name} via WhatsApp`}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginLeft: '0.5rem'
                      }}
                    >
                      <Phone size={16} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="contact-map-header">
              <span className="section-tag">LOKASI & KONTAK KAMI</span>
              <h2 className="section-title">Lokasi Workshop & Tim Marketing</h2>
              <p className="section-subtitle">
                Kunjungi workshop kami di Buduran Sidoarjo atau langsung hubungi tim marketing kami melalui WhatsApp.
              </p>
            </div>

            <div className="contact-map-grid">
              <div className="marketing-cards-column">
                {marketingTeam.map((member) => (
                  <div key={member.id} className="marketing-card">
                    <div className="marketing-info-left">
                      <div className="marketing-avatar">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="marketing-name">{member.name}</h3>
                        <p className="marketing-division">{member.division}</p>
                        <span className="status-badge">
                          <span className="status-dot" />
                          <span>Online Siap Melayani</span>
                        </span>
                      </div>
                    </div>

                    <a
                      href={member.waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="wa-action-btn"
                      title={`Chat WhatsApp dengan ${member.name}`}
                      aria-label={`Chat WhatsApp dengan ${member.name}`}
                    >
                      <PhoneCall size={18} />
                    </a>
                  </div>
                ))}

                <div className="marketing-card marketing-address-card">
                  <div className="marketing-info-left" style={{ width: '100%' }}>
                    <div className="marketing-avatar" style={{ background: 'var(--color-accent-soft)', color: 'var(--color-accent)' }}>
                      <MapPin size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 className="marketing-name" style={{ fontSize: '0.9375rem' }}>
                        Alamat Kantor & Workshop
                      </h3>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.5, margin: '0.25rem 0' }}>
                        {companyInfo.address}
                      </p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 600 }}>
                        {companyInfo.workingHours}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="map-container">
                <iframe
                  src={companyInfo.mapsEmbedUrl}
                  title="Lokasi Azhar Collection Sidoarjo di Google Maps"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div style={{ marginTop: '0.5rem', textAlign: 'right' }}>
                  <a
                    href={companyInfo.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
                  >
                    <span>Buka Rute di Google Maps</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
