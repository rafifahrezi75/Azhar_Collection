import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Save, CheckCircle, Plus, Trash2 } from 'lucide-react'
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
    hours: 'Senin - Sabtu: 08.00 - 17.00 WIB',
    vision: '',
    mission: ''
  })

  const [missionPoints, setMissionPoints] = useState([''])
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    const loadSettings = async () => {
      const data = await getCompanySettings()
      if (data) {
        setSettings((prev) => ({ ...prev, ...data }))
        if (data.mission) {
          const points = data.mission.split('\n').map((p) => p.trim()).filter(Boolean)
          setMissionPoints(points.length > 0 ? points : [''])
        }
      }
    }
    loadSettings()
  }, [])

  const handleMissionPointChange = (index, value) => {
    const updated = [...missionPoints]
    updated[index] = value
    setMissionPoints(updated)
  }

  const handleAddMissionPoint = () => {
    setMissionPoints([...missionPoints, ''])
  }

  const handleRemoveMissionPoint = (index) => {
    if (missionPoints.length <= 1) return
    const updated = missionPoints.filter((_, i) => i !== index)
    setMissionPoints(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSaveSuccess(false)

    const formattedMission = missionPoints.map((p) => p.trim()).filter(Boolean).join('\n')
    const payload = {
      ...settings,
      mission: formattedMission
    }

    try {
      await saveCompanySettings(payload)
      setSettings(payload)
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
            Kelola data kontak resmi perusahaan, nomor WhatsApp, alamat workshop, serta Visi & Misi Azhar Collection.
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

      <form onSubmit={handleSubmit}>
        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <div className="admin-card-header">
            <div>
              <h2 className="admin-card-title">Informasi Kontak & Profil Azhar Collection</h2>
              <p className="admin-card-subtitle">
                Data ini ditampilkan pada header, footer, dan halaman kontak website.
              </p>
            </div>
          </div>

          <div style={{ padding: '1.5rem' }}>
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
          </div>
        </div>

        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <div className="admin-card-header">
            <div>
              <h2 className="admin-card-title">Visi & Misi Perusahaan</h2>
              <p className="admin-card-subtitle">
                Data Visi & Misi yang akan ditampilkan pada Halaman Tentang Kami.
              </p>
            </div>
          </div>

          <div style={{ padding: '1.5rem' }}>
            <div className="admin-input-group">
              <label className="admin-label">Visi Perusahaan</label>
              <textarea
                rows={4}
                className="admin-textarea"
                value={settings.vision || ''}
                onChange={(e) => setSettings({ ...settings, vision: e.target.value })}
                placeholder="Masukkan poin Visi perusahaan..."
              />
            </div>

            <div className="admin-input-group">
              <label className="admin-label">Misi Perusahaan</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {missionPoints.map((point, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="text"
                      className="admin-input"
                      value={point}
                      onChange={(e) => handleMissionPointChange(index, e.target.value)}
                      placeholder={`Poin Misi ${index + 1}`}
                    />
                    {missionPoints.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMissionPoint(index)}
                        className="admin-icon-btn"
                        style={{ color: 'var(--admin-danger)', flexShrink: 0 }}
                        title="Hapus Poin Misi"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}

                <div>
                  <button
                    type="button"
                    onClick={handleAddMissionPoint}
                    className="admin-btn admin-btn-secondary"
                    style={{ marginTop: '0.375rem' }}
                  >
                    <Plus size={15} />
                    <span>Tambah Poin Misi</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="admin-btn admin-btn-primary"
          style={{ marginTop: '0.5rem' }}
        >
          <Save size={16} />
          <span>{saving ? 'Menyimpan...' : 'Simpan Pengaturan'}</span>
        </button>
      </form>
    </div>
  )
}
