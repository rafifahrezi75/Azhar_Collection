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
    legalName: 'CV. Azhar Collection Konveksi',
    tagline: 'Produsen Konveksi & Jahit Kustom Terpercaya - Garansi Mutu Nomor 1',
    phonePrimary: '+6281330666807',
    phoneSecondary: '+6287855476538',
    contactPersonPrimary: 'Ach. Haris',
    contactPersonSecondary: 'Lazuardi',
    phone: '+6281330666807',
    whatsapp: '6281330666807',
    email: 'azharcollection@gmail.com',
    address: 'Damarsi Rt.03 Rw.01, Kec. Buduran, Kab. Sidoarjo, Jawa Timur 61252',
    workingHours: 'Senin - Sabtu: 08.00 - 17.00 WIB',
    hours: 'Senin - Sabtu: 08.00 - 17.00 WIB',
    mapsEmbedUrl: 'https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1sAzhar+Collection+Buduran!6i17',
    mapsUrl: 'https://maps.app.goo.gl/BAAqNXmsJQaVS2pn6',
    socials: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      tiktok: 'https://tiktok.com',
      whatsapp: 'https://wa.me/6281330666807'
    },
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
        setSettings((prev) => ({
          ...prev,
          ...data,
          socials: {
            facebook: data.socials?.facebook || prev.socials.facebook,
            instagram: data.socials?.instagram || prev.socials.instagram,
            tiktok: data.socials?.tiktok || prev.socials.tiktok,
            whatsapp: data.socials?.whatsapp || prev.socials.whatsapp
          }
        }))
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
      hours: settings.workingHours || settings.hours,
      phone: settings.phonePrimary || settings.phone,
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
            Kelola data kontak resmi, penanggung jawab (CP), jam kerja, media sosial, serta Visi & Misi Azhar Collection.
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
              <h2 className="admin-card-title">Identitas Brand & Badan Hukum</h2>
              <p className="admin-card-subtitle">
                Nama brand, legalitas usaha, dan tagline promosi yang ditampilkan pada website.
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
                <label className="admin-label">Nama Badan Hukum (Legal Name)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={settings.legalName || ''}
                  onChange={(e) => setSettings({ ...settings, legalName: e.target.value })}
                />
              </div>
            </div>

            <div className="admin-input-group" style={{ marginTop: '1rem' }}>
              <label className="admin-label">Tagline Promosi Perusahaan</label>
              <input
                type="text"
                className="admin-input"
                value={settings.tagline || ''}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <div className="admin-card-header">
            <div>
              <h2 className="admin-card-title">Kontak & Penanggung Jawab (Contact Person)</h2>
              <p className="admin-card-subtitle">
                Kelola nomor telepon CP 1, CP 2, WhatsApp resmi, dan jam operasional workshop.
              </p>
            </div>
          </div>

          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              <div className="admin-input-group">
                <label className="admin-label">Nama CP Utama (Primary CP)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={settings.contactPersonPrimary || ''}
                  onChange={(e) => setSettings({ ...settings, contactPersonPrimary: e.target.value })}
                  placeholder="Contoh: Ach. Haris"
                />
              </div>

              <div className="admin-input-group">
                <label className="admin-label">Nomor Telepon / WA CP Utama</label>
                <input
                  type="text"
                  className="admin-input"
                  value={settings.phonePrimary || ''}
                  onChange={(e) => setSettings({ ...settings, phonePrimary: e.target.value, phone: e.target.value })}
                  placeholder="Contoh: +6281330666807"
                />
              </div>

              <div className="admin-input-group">
                <label className="admin-label">Nama CP Sekunder (Secondary CP)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={settings.contactPersonSecondary || ''}
                  onChange={(e) => setSettings({ ...settings, contactPersonSecondary: e.target.value })}
                  placeholder="Contoh: Lazuardi"
                />
              </div>

              <div className="admin-input-group">
                <label className="admin-label">Nomor Telepon / WA CP Sekunder</label>
                <input
                  type="text"
                  className="admin-input"
                  value={settings.phoneSecondary || ''}
                  onChange={(e) => setSettings({ ...settings, phoneSecondary: e.target.value })}
                  placeholder="Contoh: +6287855476538"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
              <div className="admin-input-group">
                <label className="admin-label">Nomor WhatsApp Link Direct (Awali 62)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={settings.whatsapp || ''}
                  onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                  placeholder="Contoh: 6281330666807"
                />
              </div>

              <div className="admin-input-group">
                <label className="admin-label">Alamat Email Resmi</label>
                <input
                  type="email"
                  className="admin-input"
                  value={settings.email || ''}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                />
              </div>

              <div className="admin-input-group">
                <label className="admin-label">Jam Operasional Workshop</label>
                <input
                  type="text"
                  className="admin-input"
                  value={settings.workingHours || settings.hours || ''}
                  onChange={(e) => setSettings({ ...settings, workingHours: e.target.value, hours: e.target.value })}
                />
              </div>
            </div>

            <div className="admin-input-group" style={{ marginTop: '1rem' }}>
              <label className="admin-label">Alamat Lengkap Workshop</label>
              <input
                type="text"
                className="admin-input"
                value={settings.address || ''}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
          <div className="admin-card-header">
            <div>
              <h2 className="admin-card-title">Media Sosial Perusahaan</h2>
              <p className="admin-card-subtitle">
                Link akun media sosial resmi yang ditampilkan pada footer dan halaman kontak.
              </p>
            </div>
          </div>

          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              <div className="admin-input-group">
                <label className="admin-label">Facebook URL</label>
                <input
                  type="text"
                  className="admin-input"
                  value={settings.socials?.facebook || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    socials: { ...settings.socials, facebook: e.target.value }
                  })}
                />
              </div>

              <div className="admin-input-group">
                <label className="admin-label">Instagram URL</label>
                <input
                  type="text"
                  className="admin-input"
                  value={settings.socials?.instagram || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    socials: { ...settings.socials, instagram: e.target.value }
                  })}
                />
              </div>

              <div className="admin-input-group">
                <label className="admin-label">TikTok URL</label>
                <input
                  type="text"
                  className="admin-input"
                  value={settings.socials?.tiktok || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    socials: { ...settings.socials, tiktok: e.target.value }
                  })}
                />
              </div>

              <div className="admin-input-group">
                <label className="admin-label">WhatsApp Direct URL (wa.me)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={settings.socials?.whatsapp || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    socials: { ...settings.socials, whatsapp: e.target.value }
                  })}
                />
              </div>
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

