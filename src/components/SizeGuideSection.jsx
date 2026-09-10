import { Ruler, CheckCircle2 } from 'lucide-react'
import { sizeChartData } from '../data/siteData'

export default function SizeGuideSection() {
  const sections = [
    { key: 'sd', label: '1. Standar Seragam SD (Sekolah Dasar)' },
    { key: 'smp', label: '2. Standar Seragam SMP (Sekolah Menengah Pertama)' },
    { key: 'sma', label: '3. Standar Seragam SMA / SMK & Dewasa (Kemeja PDH / Jas)' }
  ]

  return (
    <section id="panduan-ukuran" className="size-guide-section" style={{ padding: '4.5rem 0', background: '#FFFFFF', borderTop: '1px solid var(--color-border)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem auto' }}>
          <span className="section-tag">STANDAR NASIONAL (SNI)</span>
          <h2 className="section-title">Pedoman Ukuran Umum Busana & Seragam</h2>
          <p className="section-subtitle">
            Tabel acuan ukuran standar konveksi Azhar Collection untuk mempermudah pendataan ukuran siswa, mahasiswa, dan pegawai instansi sebelum proses penjahitan massal.
          </p>
        </div>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {sections.map((sec) => (
            <div
              key={sec.key}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem',
                boxShadow: 'var(--shadow-sm)',
                overflowX: 'auto'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem', color: 'var(--color-primary-dark)' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--color-primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                  <Ruler size={18} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                  {sec.label}
                </h3>
              </div>

              <table className="spec-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Ukuran</th>
                    <th>Lingkar Dada</th>
                    <th>Panjang Baju</th>
                    <th>Lingkar Pinggang</th>
                    <th>Panjang Celana/Rok</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeChartData[sec.key].map((row, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>{row.size}</td>
                      <td>{row.chest}</td>
                      <td>{row.shirtLen}</td>
                      <td>{row.waist}</td>
                      <td>{row.pantLen}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          <div style={{ padding: '1.25rem 1.5rem', background: 'var(--color-primary-soft)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-primary-border)', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary-dark)', fontWeight: 700 }}>
              <CheckCircle2 size={18} style={{ color: 'var(--color-primary)' }} />
              <span>Catatan & Tips Pengukuran:</span>
            </div>
            <p style={{ margin: 0, lineHeight: 1.6 }}>
              Toleransi jahitan konveksi berkisar antara 1 - 2 cm. Untuk seragam kemeja harian, disarankan menambahkan kelonggaran 4 - 6 cm dari ukuran pas lingkar dada agar nyaman dipakai seharian untuk aktivitas belajar maupun bekerja.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
