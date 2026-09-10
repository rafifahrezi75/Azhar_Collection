import { X, MessageSquare, Ruler, Info } from 'lucide-react'
import { sizeChartData } from '../data/siteData'

export default function DetailModal({
  isOpen,
  type,
  data,
  onClose
}) {
  if (!isOpen || !data) return null

  const renderContent = () => {
    if (type === 'service') {
      return (
        <div>
          <img
            src={data.image}
            alt={data.title}
            style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem' }}
          />
          <h4 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-primary-dark)', marginBottom: '0.75rem' }}>
            {data.title}
          </h4>
          <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            {data.fullDesc}
          </p>

          <table className="spec-table" style={{ marginBottom: '1.75rem' }}>
            <tbody>
              <tr>
                <th style={{ width: '35%' }}>Bahan Kain Rekomendasi</th>
                <td>{data.materials?.join(', ')}</td>
              </tr>
              <tr>
                <th>Minimum Pemesanan (MOQ)</th>
                <td>{data.moq}</td>
              </tr>
              <tr>
                <th>Estimasi Waktu Pengerjaan</th>
                <td>{data.leadTime}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <a
              href={`https://wa.me/6281330666807?text=Halo%20Pak%20Haris%20Azhar%20Collection%2C%20saya%20tertarik%20dengan%20layanan%20${encodeURIComponent(data.title)}.%20Mohon%20info%20penawaran.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ flex: 1 }}
            >
              <MessageSquare size={16} />
              <span>Konsultasi Layanan Ini</span>
            </a>
            <button type="button" onClick={onClose} className="btn-outline">
              Tutup
            </button>
          </div>
        </div>
      )
    }

    if (type === 'product') {
      return (
        <div>
          <img
            src={data.image}
            alt={data.name}
            style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase' }}>
              {data.categoryLabel} - {data.id}
            </span>
            <span className="product-badge" style={{ position: 'static' }}>{data.badge}</span>
          </div>

          <h4 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-primary-dark)', marginBottom: '0.75rem' }}>
            {data.name}
          </h4>

          <div style={{ background: 'var(--color-primary-soft)', padding: '0.875rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.8125rem' }}>
            <strong style={{ color: 'var(--color-primary-dark)' }}>Contoh Pemesan / Mitra: </strong>
            <span style={{ color: 'var(--color-text-main)' }}>{data.client}</span>
          </div>

          <table className="spec-table" style={{ marginBottom: '1.5rem' }}>
            <tbody>
              <tr>
                <th style={{ width: '35%' }}>Bahan Kain</th>
                <td>{data.specs}</td>
              </tr>
              <tr>
                <th>Fitur & Kustomisasi</th>
                <td>{data.customDetails}</td>
              </tr>
              <tr>
                <th>Status Produksi</th>
                <td>Menerima pesanan kustom serupa dengan modifikasi logo, model, dan warna</td>
              </tr>
            </tbody>
          </table>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <a
              href={`https://wa.me/6281330666807?text=Halo%20Pak%20Haris%20Azhar%20Collection%2C%20saya%20tertarik%20memesan%20kustom%20seperti%20model%20${encodeURIComponent(data.name)}%20(${data.id}).%20Mohon%20info%20selengkapnya.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ flex: 1 }}
            >
              <MessageSquare size={16} />
              <span>Konsultasi Model Ini via WhatsApp</span>
            </a>
            <button type="button" onClick={onClose} className="btn-outline">
              Tutup
            </button>
          </div>
        </div>
      )
    }

    if (type === 'sizeChart') {
      return (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Ruler size={20} style={{ color: 'var(--color-accent)' }} />
            <h4 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
              Panduan Standar Ukuran Baju Seragam Nasional (SNI)
            </h4>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
            Toleransi jahitan konveksi kurang lebih 1 - 2 cm. Pastikan mengukur lingkar dada secara pas sebelum pemesanan massal.
          </p>

          <h5 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)', marginTop: '1rem', marginBottom: '0.5rem' }}>
            1. Standar Seragam SD (Sekolah Dasar)
          </h5>
          <table className="spec-table" style={{ fontSize: '0.75rem' }}>
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
              {sizeChartData.sd.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 700 }}>{row.size}</td>
                  <td>{row.chest}</td>
                  <td>{row.shirtLen}</td>
                  <td>{row.waist}</td>
                  <td>{row.pantLen}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h5 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            2. Standar Seragam SMP (Sekolah Menengah Pertama)
          </h5>
          <table className="spec-table" style={{ fontSize: '0.75rem' }}>
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
              {sizeChartData.smp.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 700 }}>{row.size}</td>
                  <td>{row.chest}</td>
                  <td>{row.shirtLen}</td>
                  <td>{row.waist}</td>
                  <td>{row.pantLen}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h5 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
            3. Standar Seragam SMA / SMK & Dewasa (Kemeja PDH / Almamater)
          </h5>
          <table className="spec-table" style={{ fontSize: '0.75rem', marginBottom: '1.5rem' }}>
            <thead>
              <tr>
                <th>Ukuran</th>
                <th>Lingkar Dada</th>
                <th>Panjang Baju</th>
                <th>Lingkar Pinggang</th>
                <th>Panjang Celana</th>
              </tr>
            </thead>
            <tbody>
              {sizeChartData.sma.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 700 }}>{row.size}</td>
                  <td>{row.chest}</td>
                  <td>{row.shirtLen}</td>
                  <td>{row.waist}</td>
                  <td>{row.pantLen}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button type="button" onClick={onClose} className="btn-primary" style={{ width: '100%' }}>
            Tutup Panduan Ukuran
          </button>
        </div>
      )
    }

    if (type === 'about') {
      return (
        <div>
          <img
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80"
            alt="Profil Azhar Collection"
            style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem' }}
          />
          <h4 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-primary-dark)', marginBottom: '0.75rem' }}>
            Profil & Sejarah Azhar Collection
          </h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
            Azhar Collection berawal dari bengkel jahit konveksi di Damarsi, Buduran - Sidoarjo. Berbekal komitmen terhadap kerapian jahitan, kami terus berkembang menjadi mitra pengadaan seragam sekolah dan seragam dinas tepercaya untuk ratusan instansi pendidikan dan perkantoran di Jawa Timur hingga luar pulau.
          </p>

          <div style={{ background: 'var(--color-primary-soft)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
            <h5 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
              Visi Perusahaan:
            </h5>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              Menjadi produsen konveksi dan garment terdepan di Indonesia yang dipercaya karena keaslian bahan baku, standar jahitan prima, ketepatan waktu, dan integritas kemitraan jangka panjang.
            </p>
          </div>

          <div style={{ background: 'var(--color-accent-soft)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <h5 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-accent-hover)', marginBottom: '0.5rem' }}>
              Misi Perusahaan:
            </h5>
            <ul style={{ fontSize: '0.8125rem', color: 'var(--color-text-main)', paddingLeft: '1.25rem', lineHeight: 1.6 }}>
              <li>Menggunakan bahan kain otentik bersertifikasi pabrik tekstil resmi.</li>
              <li>Menerapkan sistem manajemen produksi terpadu dengan pengawasan mutu 3 tahap.</li>
              <li>Memberdayakan penjahit lokal dengan upah layak dan lingkungan kerja bermartabat.</li>
              <li>Memberikan harga langsung produsen tanpa biaya perantara yang membebani sekolah.</li>
            </ul>
          </div>

          <button type="button" onClick={onClose} className="btn-primary" style={{ width: '100%' }}>
            Kembali
          </button>
        </div>
      )
    }

    if (type === 'imagePreview') {
      return (
        <div style={{ textAlign: 'center' }}>
          <img
            src={data.image}
            alt={data.title}
            style={{ width: '100%', maxHeight: '65vh', objectFit: 'contain', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}
          />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase' }}>
            {data.category}
          </span>
          <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginTop: '0.25rem' }}>
            {data.title}
          </h4>
        </div>
      )
    }

    return null
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Info size={20} style={{ color: 'var(--color-primary)' }} />
            <h3 className="modal-title">
              {type === 'service' && 'Detail Layanan Konveksi'}
              {type === 'product' && 'Detail Portofolio & Spesifikasi'}
              {type === 'sizeChart' && 'Panduan Ukuran Pakaian'}
              {type === 'about' && 'Tentang Azhar Collection'}
              {type === 'imagePreview' && 'Pratinjau Foto Workshop'}
            </h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">{renderContent()}</div>
      </div>
    </div>
  )
}
