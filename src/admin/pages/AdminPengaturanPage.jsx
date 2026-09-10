import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Save, Database, Shield, CheckCircle } from 'lucide-react'
import {
  getCompanySettings,
  saveCompanySettings,
  seedInitialDataToFirestore
} from '../../firebase/adminService'
import { isFirebaseConfigured } from '../../firebase/config'

export default function AdminPengaturanPage() {
  const [settings, setSettings] = useState({
    name: 'Azhar Collection',
    phone: '0813-3066-6807',
    whatsapp: '6281330666807',
    email: 'info@azharcollection.com',
    address: 'Dsn. Sumber, Ds. Sumberrejo, Kec. Pandaan, Kab. Pasuruan / Sidoarjo',
    hours: 'Senin - Sabtu: 08.00 - 17.00 WIB'
  })

  const [saving, setSaving] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [seedResult, setSeedResult] = useState('')
  const [seedError, setSeedError] = useState('')

  useEffect(() => {
    const loadSettings = async () => {
      const data = await getCompanySettings()
      if (data) {
        setSettings((prev) => ({ ...prev, ...data }))
      }
    }
    loadSettings()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSaveSuccess(false)
    try {
      await saveCompanySettings(settings)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 4000)
    } finally {
      setSaving(false)
    }
  }

  const handleSeedFirebase = async () => {
    setSeeding(true)
    setSeedResult('')
    setSeedError('')

    try {
      const res = await seedInitialDataToFirestore()
      setSeedResult(
        `Sukses: Data awal (${res.products} produk, ${res.clients} mitra, ${res.services} layanan, ${res.testimonials} testimoni) berhasil diunggah ke Firebase Cloud Firestore!`
      )
    } catch (err) {
      setSeedError(err.message || 'Gagal menyinkronkan data ke Firebase.')
    } finally {
      setSeeding(false)
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Pengaturan Profil & Database</h1>
          <p className="admin-page-desc">
            Kelola data kontak resmi perusahaan, alamat workshop konveksi, dan konfigurasi backend Firebase.
          </p>
        </div>

        <div className="admin-breadcrumbs">
          <Link to="/admin">Admin</Link>
          <span>/</span>
          <span className="current">Pengaturan</span>
        </div>
      </div>

      {saveSuccess && (
        <div className="admin-alert admin-alert-success">
          <CheckCircle size={18} />
          <span>Pengaturan profil perusahaan berhasil disimpan!</span>
        </div>
      )}

      {seedResult && (
        <div className="admin-alert admin-alert-success">
          <CheckCircle size={18} />
          <span>{seedResult}</span>
        </div>
      )}

      {seedError && (
        <div className="admin-alert admin-alert-danger">
          <span>{seedError}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
        <div style={{ gridColumn: 'span 12' }} className="admin-card">
          <div className="admin-card-header">
            <div>
              <h2 className="admin-card-title">Informasi Kontak & Profil Azhar Collection</h2>
              <p className="admin-card-subtitle">
                Data ini ditampilkan pada header, footer, dan halaman kontak website.
              </p>
            </div>
          </div>

          <div style={{ padding: '1.5rem' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                <div className="admin-input-group">
                  <label className="admin-label">Nama Perusahaan / Brand</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={settings.name}
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  />
                </div>

                <div className="admin-input-group">
                  <label className="admin-label">Nomor WhatsApp Resmi (Awali 62)</label>
                  <input
                    type="text"
                    required
                    className="admin-input"
                    value={settings.whatsapp}
                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                  />
                </div>

                <div className="admin-input-group">
                  <label className="admin-label">Nomor Telepon Kantor</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  />
                </div>

                <div className="admin-input-group">
                  <label className="admin-label">Alamat Email Resmi</label>
                  <input
                    type="email"
                    className="admin-input"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-input-group">
                <label className="admin-label">Alamat Workshop / Workshop Konveksi</label>
                <input
                  type="text"
                  className="admin-input"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                />
              </div>

              <div className="admin-input-group">
                <label className="admin-label">Jam Operasional</label>
                <input
                  type="text"
                  className="admin-input"
                  value={settings.hours}
                  onChange={(e) => setSettings({ ...settings, hours: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="admin-btn admin-btn-primary"
              >
                <Save size={16} />
                <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
              </button>
            </form>
          </div>
        </div>

        <div style={{ gridColumn: 'span 12' }} className="admin-card">
          <div className="admin-card-header">
            <div>
              <h2 className="admin-card-title">Konfigurasi Backend Firebase</h2>
              <p className="admin-card-subtitle">
                Status koneksi Cloud Firestore dan kredensial aplikasi.
              </p>
            </div>
            <div
              className={`admin-badge ${
                isFirebaseConfigured ? 'admin-badge-success' : 'admin-badge-warning'
              }`}
            >
              {isFirebaseConfigured ? 'Firebase Terhubung' : 'Mode Demo (Local Fallback)'}
            </div>
          </div>

          <div style={{ padding: '1.5rem' }}>
            <div
              style={{
                padding: '1rem',
                borderRadius: 'var(--admin-radius)',
                backgroundColor: 'var(--admin-surface-hover)',
                marginBottom: '1.25rem',
                fontSize: '0.8125rem',
                lineHeight: 1.6
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 800 }}>
                <Shield size={16} style={{ color: 'var(--admin-primary)' }} />
                <span>Panduan Koneksi Firebase:</span>
              </div>
              <p style={{ margin: '0 0 0.5rem 0' }}>
                Untuk mengaktifkan Firebase secara langsung di production, salin file <code>.env.example</code> ke <code>.env</code> dan masukkan konfigurasi Firebase project Anda:
              </p>
              <pre
                style={{
                  background: 'rgba(0,0,0,0.15)',
                  padding: '0.75rem',
                  borderRadius: 'var(--admin-radius)',
                  overflowX: 'auto',
                  margin: 0,
                  fontSize: '0.75rem'
                }}
              >
                {`VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=azhar-collection.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=azhar-collection
VITE_FIREBASE_STORAGE_BUCKET=azhar-collection.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef`}
              </pre>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.875rem' }}>
                  Sinkronisasi Data Awal ke Firestore
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                  Unggah seluruh master data bawaan (8 mitra klien, produk katalog, dan layanan) ke koleksi Firestore.
                </div>
              </div>

              <button
                type="button"
                disabled={seeding || !isFirebaseConfigured}
                onClick={handleSeedFirebase}
                className="admin-btn admin-btn-secondary"
              >
                <Database size={16} />
                <span>{seeding ? 'Menyinkronkan...' : 'Sinkronkan Data Sekarang'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
