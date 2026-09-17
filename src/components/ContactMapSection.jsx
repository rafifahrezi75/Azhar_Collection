import { useState, useEffect } from 'react'
import { PhoneCall, MapPin, Mail, Phone, CheckCircle2, ExternalLink, Image as ImageIcon } from 'lucide-react'
import { companyInfo } from '../data/siteData'
import { saveInquiry, getMarketingList, getCompanySettings } from '../firebase/adminService'
import SliderCaptchaModal from './SliderCaptchaModal'

function getFirstWord(name) {
  if (!name) return ''
  const words = name.trim().split(/\s+/)
  return words[0] || ''
}

export default function ContactMapSection({ showForm = true }) {
  const [marketingList, setMarketingList] = useState([])
  const [info, setInfo] = useState(companyInfo)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    telephone: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isCaptchaOpen, setIsCaptchaOpen] = useState(false)

  useEffect(() => {
    let isMounted = true
    Promise.all([getMarketingList(), getCompanySettings()]).then(([mList, compSettings]) => {
      if (isMounted) {
        if (mList) setMarketingList(mList)
        if (compSettings) setInfo({ ...companyInfo, ...compSettings })
      }
    })
    return () => {
      isMounted = false
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsCaptchaOpen(true)
  }

  const handleCaptchaSuccess = () => {
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
    window.location.href = `mailto:${info.email}?subject=${subject}&body=${body}`
    setIsSubmitted(true)
  }

  return (
    <section id="contact" className="contact-map-section" style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        {showForm ? (
          <div className="contact-form-layout-grid">
            <div className="reveal-left" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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
                  <span>Pesan telah disiapkan. Silakan kirimkan email yang terbuka di perangkat Anda menuju {info.email}.</span>
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

            <div className="reveal-right delay-150" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ paddingBottom: '0.625rem', borderBottom: '2px solid var(--color-border)', marginBottom: '0.875rem' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: 0 }}>
                    Location
                  </h2>
                </div>

                <div style={{ fontSize: '0.84375rem', color: 'var(--color-text-main)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                  <p style={{ fontWeight: 700, margin: '0 0 0.125rem 0', color: 'var(--color-primary-dark)' }}>
                    {info.legalName || 'CV. AZHAR COLLECTION'}
                  </p>
                  <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
                    {info.address}
                  </p>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8125rem' }}>
                  <a
                    href={`mailto:${info.email}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary-dark)', textDecoration: 'none', fontWeight: 600 }}
                  >
                    <Mail size={15} style={{ color: 'var(--color-accent)' }} />
                    <span>{info.email}</span>
                  </a>

                  <a
                    href={`tel:${info.phonePrimary || info.phone}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary-dark)', textDecoration: 'none', fontWeight: 600 }}
                  >
                    <Phone size={15} style={{ color: 'var(--color-accent)' }} />
                    <span>{info.phonePrimary || info.phone}</span>
                  </a>
                </div>
              </div>

              <div>
                <div style={{ paddingBottom: '0.625rem', borderBottom: '2px solid var(--color-border)', marginBottom: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: 0 }}>
                    Map Lokasi
                  </h2>
                  <a
                    href={info.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <span>Buka di Google Maps</span>
                    <ExternalLink size={13} />
                  </a>
                </div>

                <div style={{ borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--color-border)', height: '185px' }}>
                  <iframe
                    src={info.mapsEmbedUrl}
                    title="Lokasi Azhar Collection Sidoarjo di Google Maps"
                    style={{ width: '100%', height: '100%', border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

              {marketingList && marketingList.length > 0 && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ paddingBottom: '0.375rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-primary-dark)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Tim Marketing
                    </span>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                      Siap Melayani Konsultasi
                    </span>
                  </div>

                  <div className={`contact-marketing-grid ${marketingList.length === 3 ? 'cols-3' : marketingList.length === 2 ? 'cols-2' : ''}`}>
                    {marketingList.map((member) => (
                      <div key={member.id} className="marketing-card marketing-card-compact">
                        <div className="marketing-info-left">
                          <div className="marketing-avatar">
                            {member.photo ? (
                              <img
                                src={member.photo}
                                alt={member.name}
                                className="marketing-avatar-img"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                  if (e.currentTarget.nextElementSibling) {
                                    e.currentTarget.nextElementSibling.style.display = 'flex'
                                  }
                                }}
                              />
                            ) : null}
                            <div
                              className="marketing-avatar-placeholder"
                              style={{ display: member.photo ? 'none' : 'flex' }}
                            >
                              <ImageIcon size={18} />
                            </div>
                          </div>
                          <div className="marketing-text-wrap">
                            <h4 className="marketing-name" title={member.name}>
                              {getFirstWord(member.name)}
                            </h4>
                            {member.division && (
                              <p className="marketing-division" title={member.division}>
                                {member.division}
                              </p>
                            )}
                            <span className="status-badge">
                              <span className="status-dot" />
                              <span>{member.status?.toLowerCase().includes('online') ? 'Online' : (member.status || 'Online')}</span>
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
                          <PhoneCall size={15} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="contact-map-header reveal-up">
              <span className="section-tag">LOKASI & KONTAK KAMI</span>
              <h2 className="section-title">Lokasi Workshop & Tim Marketing</h2>
              <p className="section-subtitle">
                Kunjungi workshop kami di Buduran Sidoarjo atau langsung hubungi tim marketing kami melalui WhatsApp.
              </p>
            </div>

            <div className="contact-map-grid">
              <div className="marketing-cards-column reveal-left">
                {marketingList.map((member) => (
                  <div key={member.id} className="marketing-card">
                    <div className="marketing-info-left">
                      <div className="marketing-avatar" style={{ borderRadius: '50%', overflow: 'hidden' }}>
                        {member.photo ? (
                          <img
                            src={member.photo}
                            alt={member.name}
                            className="marketing-avatar-img"
                            style={{ borderRadius: '50%' }}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                              if (e.currentTarget.nextElementSibling) {
                                e.currentTarget.nextElementSibling.style.display = 'flex'
                              }
                            }}
                          />
                        ) : null}
                        <div
                          className="marketing-avatar-placeholder"
                          style={{ display: member.photo ? 'none' : 'flex', borderRadius: '50%' }}
                        >
                          <ImageIcon size={22} />
                        </div>
                      </div>
                      <div>
                        <h3 className="marketing-name">{member.name}</h3>
                        <p className="marketing-division">{member.division}</p>
                        <span className="status-badge">
                          <span className="status-dot" />
                          <span>{member.status || 'Online Siap Melayani'}</span>
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
                    <div className="marketing-avatar" style={{ background: 'var(--color-accent-soft)', color: 'var(--color-accent)', borderRadius: '50%', overflow: 'hidden' }}>
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

              <div className="map-container reveal-right delay-150">
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

      <SliderCaptchaModal
        isOpen={isCaptchaOpen}
        onClose={() => setIsCaptchaOpen(false)}
        onSuccess={handleCaptchaSuccess}
      />
    </section>
  )
}
