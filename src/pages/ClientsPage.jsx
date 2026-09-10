import { useState, useEffect } from 'react'
import PageHeader from '../components/PageHeader'
import { getKlienList } from '../firebase/adminService'
import { clientsData as fallbackClients } from '../data/siteData'
import { MapPin, Calendar } from 'lucide-react'

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
        title="Daftar Klien & Mitra Kami"
        subtitle="Institusi Pendidikan, Kampus, Lembaga Pemerintahan, dan Perusahaan yang Mempercayakan Busana & Seragamnya kepada Azhar Collection"
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
                  <div
                    key={client.id}
                    className="client-clean-card"
                  >
                    <div className="client-clean-img-wrap">
                      {clientImg ? (
                        <img
                          src={clientImg}
                          alt={client.name}
                          className="client-clean-img"
                          loading="lazy"
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F1F5F9', color: '#94A3B8', fontSize: '0.75rem' }}>
                          Logo Mitra
                        </div>
                      )}
                    </div>

                    <div className="client-clean-content">
                      <h3 className="client-clean-title">{client.name}</h3>

                      <div className="client-clean-meta" style={{ marginBottom: 0 }}>
                        {client.city && (
                          <span className="client-meta-item">
                            <MapPin size={13} className="client-meta-icon" />
                            {client.city}
                          </span>
                        )}
                        {client.city && client.since && <span className="client-meta-divider">•</span>}
                        {client.since && (
                          <span className="client-meta-item">
                            <Calendar size={13} className="client-meta-icon" />
                            Mitra Sejak {client.since}
                          </span>
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