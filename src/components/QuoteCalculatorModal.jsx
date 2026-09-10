import { useState } from 'react'
import { X, Calculator, MessageSquare, Sparkles } from 'lucide-react'

export default function QuoteCalculatorModal({ isOpen, onClose }) {
  const [productType, setProductType] = useState('sd')
  const [quantity, setQuantity] = useState(60)
  const [fabricTier, setFabricTier] = useState('standard')
  const [withEmbroidery, setWithEmbroidery] = useState(true)
  const [withIndividualPacking, setWithIndividualPacking] = useState(true)

  if (!isOpen) return null

  const products = {
    sd: { name: 'Setelan Seragam SD Merah Putih', basePrice: 88000, unit: 'Stel' },
    smp: { name: 'Setelan Seragam SMP Biru Putih', basePrice: 98000, unit: 'Stel' },
    sma: { name: 'Setelan Seragam SMA Abu-Abu', basePrice: 108000, unit: 'Stel' },
    pramuka: { name: 'Setelan Pramuka Nasional', basePrice: 102000, unit: 'Stel' },
    pdh: { name: 'Kemeja PDH / PDL Nagata Drill', basePrice: 95000, unit: 'Pcs' },
    almamater: { name: 'Jas Almamater Kampus High Twist', basePrice: 115000, unit: 'Pcs' },
    polo: { name: 'Kaos Polo Shirt Lacoste CVC', basePrice: 65000, unit: 'Pcs' },
    training: { name: 'Setelan Training & Kaos Olahraga', basePrice: 88000, unit: 'Stel' }
  }

  const selectedProduct = products[productType] || products.sd

  let pricePerUnit = selectedProduct.basePrice

  if (fabricTier === 'premium') {
    pricePerUnit += 12000
  }

  if (withEmbroidery) {
    pricePerUnit += 6000
  }

  if (withIndividualPacking) {
    pricePerUnit += 2000
  }

  let discountPercent = 0
  if (quantity >= 300) {
    discountPercent = 15
  } else if (quantity >= 100) {
    discountPercent = 10
  } else if (quantity >= 50) {
    discountPercent = 5
  }

  const finalUnitPrice = Math.round(pricePerUnit * (1 - discountPercent / 100))
  const totalPrice = finalUnitPrice * quantity

  const handleSendToWhatsApp = () => {
    const message = `Halo Bpk. Haris Azhar Collection Sidoarjo,%0A%0ASaya telah mencoba Kalkulator Estimasi di website resmi:%0A- Produk: ${encodeURIComponent(selectedProduct.name)}%0A- Jumlah: ${quantity} ${selectedProduct.unit}%0A- Opsi Bahan: ${fabricTier === 'premium' ? 'Spesifikasi Super / Premium' : 'Standar SNI Oxford/Famatex'}%0A- Bordir Komputer: ${withEmbroidery ? 'Ya (Badge/Nama)' : 'Tidak'}%0A- Kemasan Individu: ${withIndividualPacking ? 'Ya (Plastik Seal Rapi)' : 'Standar Box'}%0A- Diskon Kuantitas: ${discountPercent}%%0A- Estimasi Total: Rp ${totalPrice.toLocaleString('id-ID')}%0A%0AMohon konfirmasi ketersediaan bahan dan penawaran resminya. Terima kasih.`
    window.open(`https://wa.me/6281330666807?text=${message}`, '_blank')
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Calculator size={22} style={{ color: 'var(--color-accent)' }} />
            <h3 className="modal-title">Kalkulator Estimasi Biaya Pesanan</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.84375rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Dapatkan kisaran biaya transparan langsung dari produsen. Diskon otomatis hingga 15% berlaku untuk pemesanan partai besar.
          </p>

          <div className="form-group">
            <label className="form-label">Pilih Jenis Pakaian / Seragam</label>
            <select
              className="form-select"
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
            >
              <option value="sd">Setelan Seragam SD Merah Putih (Oxford + Famatex)</option>
              <option value="smp">Setelan Seragam SMP Biru Putih (TC + Famatex)</option>
              <option value="sma">Setelan Seragam SMA Abu-Abu (Oxford + Famatex)</option>
              <option value="pramuka">Setelan Pramuka Lengkap (Famatex Coklat)</option>
              <option value="pdh">Kemeja PDH / PDL Instansi (Nagata Drill)</option>
              <option value="almamater">Jas Almamater Kampus (High Twist + Furing)</option>
              <option value="polo">Kaos Polo Shirt Berkerah (Lacoste CVC Pique)</option>
              <option value="training">Setelan Training Olahraga (Kaos TC + Diadora)</option>
            </select>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
              <label className="form-label" style={{ margin: 0 }}>
                Jumlah Pesanan (Pcs / Stel)
              </label>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                {quantity} {selectedProduct.unit}
              </span>
            </div>
            <input
              type="range"
              min="24"
              max="1000"
              step="6"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--color-text-light)', marginTop: '0.25rem' }}>
              <span>Min. 24</span>
              <span>50 (Diskon 5%)</span>
              <span>100 (Diskon 10%)</span>
              <span>300+ (Diskon 15%)</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tingkatan Bahan Kain</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setFabricTier('standard')}
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: `1.5px solid ${fabricTier === 'standard' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  background: fabricTier === 'standard' ? 'var(--color-primary-soft)' : '#FFFFFF',
                  color: fabricTier === 'standard' ? 'var(--color-primary-dark)' : 'var(--color-text-main)',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  textAlign: 'left'
                }}
              >
                <div>Standar Pabrik</div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 400, color: 'var(--color-text-muted)' }}>Famatex / Oxford Super</div>
              </button>

              <button
                type="button"
                onClick={() => setFabricTier('premium')}
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: `1.5px solid ${fabricTier === 'premium' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  background: fabricTier === 'premium' ? 'var(--color-primary-soft)' : '#FFFFFF',
                  color: fabricTier === 'premium' ? 'var(--color-primary-dark)' : 'var(--color-text-main)',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  textAlign: 'left'
                }}
              >
                <div>Spesifikasi Ekstra</div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 400, color: 'var(--color-text-muted)' }}>Nagata Asli / High Twist (+12k)</div>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: '1.25rem 0' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.8125rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={withEmbroidery}
                onChange={(e) => setWithEmbroidery(e.target.checked)}
                style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px' }}
              />
              <span style={{ fontWeight: 500 }}>Termasuk Bordir Komputer Badge Logo & Nama (+Rp 6.000)</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.8125rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={withIndividualPacking}
                onChange={(e) => setWithIndividualPacking(e.target.checked)}
                style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px' }}
              />
              <span style={{ fontWeight: 500 }}>Setrika Uap & Plastik Kemasan Per Pcs (+Rp 2.000)</span>
            </label>
          </div>

          <div className="calc-result-box">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 700 }}>
              <Sparkles size={14} />
              <span>ESTIMASI TOTAL HARGA LANGSUNG PRODUSEN</span>
            </div>
            <div className="calc-price">
              Rp {totalPrice.toLocaleString('id-ID')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Setara Rp {finalUnitPrice.toLocaleString('id-ID')} per {selectedProduct.unit}
              {discountPercent > 0 && (
                <span style={{ color: 'var(--color-success)', fontWeight: 700, marginLeft: '6px' }}>
                  (Hemat {discountPercent}%)
                </span>
              )}
            </div>
          </div>

          <div style={{ marginTop: '1.75rem', display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={handleSendToWhatsApp}
              className="btn-primary"
              style={{ flex: 1, padding: '0.875rem' }}
            >
              <MessageSquare size={16} />
              <span>Lanjutkan Chat WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ background: 'var(--color-bg-light)', color: 'var(--color-text-main)', border: '1px solid var(--color-border)', padding: '0.875rem 1.25rem' }}
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
