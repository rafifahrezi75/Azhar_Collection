import { useState, useEffect } from 'react'
import PageHeader from '../components/PageHeader'
import { getKlienList } from '../firebase/adminService'
import { clientsData as fallbackClients } from '../data/siteData'
import { MapPin, Calendar, School } from 'lucide-react'

function ClientLogo({ src, alt }) {
  const [hasError, setHasError] = useState(false)

  if (!src || hasError) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--color-bg-light, #F1F5F9)',
          color: 'var(--color-primary-dark, #0A2540)'
        }}
      >
        <School size={36} strokeWidth={1.75} style={{ opacity: 0.8 }} />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className="client-clean-img"
      loading="lazy"
      onError={() => setHasError(true)}
    />
  )
}

export default function ClientsPage() {
  const [clients, setClients] = useState(fallbackClients)

  useEffect(() => {
    let isMounted = true
    getKlienList().then((list) => {
      if (isMounted && list) setClients(list)
    })
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="clients-page">
      <PageHeader
        title="Daftar Klien & Mitra Langganan Azhar Collection"
        subtitle="Bukti Kepercayaan Ratusan Sekolah, Lembaga Pendidikan, & Instansi Pemesan dari Seluruh Pulau di Indonesia!"
        breadcrumb="Klien Kami"
      />

      <section className="clients-section-main">
        <div className="container">
          {clients.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1.5rem', background: 'var(--color-bg-light)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--color-border)' }}>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', margin: 0 }}>
                Belum ada data mitra klien yang ditampilkan. Silakan tambahkan mitra klien baru melalui Admin Panel.
              </p>
            </div>
          ) : (
            <div className="clients-clean-grid">
              {clients.map((client) => {
                const clientImg = client.image || client.orderedProducts?.[0]?.image
                return (
                  <div key={client.id} className="client-clean-card">
                    <div className="client-clean-img-wrap">
                      <ClientLogo src={clientImg} alt={client.name} />
                    </div>

                    <div className="client-clean-content">
                      <h3 className="client-clean-title">{client.name}</h3>

                      <div className="client-clean-meta">
                        {client.city && (
                          <div className="client-meta-row">
                            <MapPin size={14} className="client-meta-icon" />
                            <span className="client-meta-text">{client.city}</span>
                          </div>
                        )}
                        {client.since && (
                          <div className="client-meta-row">
                            <Calendar size={14} className="client-meta-icon" />
                            <span className="client-meta-text">Mitra Sejak {client.since}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}