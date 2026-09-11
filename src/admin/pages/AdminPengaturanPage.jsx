import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Save, CheckCircle } from 'lucide-react'
import {
  getCompanySettings,
  saveCompanySettings
} from '../../firebase/adminService'

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
  const [saveSuccess, setSaveSuccess] = useState(false)

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

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Pengaturan Profil Perusahaan</h1>
          <p className="admin-page-desc">
            Kelola data kontak resmi perusahaan, nomor WhatsApp, dan alamat workshop konveksi.
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

      <div className="admin-card">
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
    </div>
  )
}
