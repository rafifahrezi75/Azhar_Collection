import { useState, useRef, useEffect, useMemo } from 'react'
import { UploadCloud, X, CheckCircle, AlertCircle } from 'lucide-react'

export default function AdminImageUploader({
  currentImageUrl,
  currentImage,
  selectedFile: controlledSelectedFile,
  onSelectFile,
  onFileSelected,
  onRemove,
  onUrlChanged,
  label = 'Foto / Gambar'
}) {
  const [internalFile, setInternalFile] = useState(null)
  const activeFile = controlledSelectedFile !== undefined ? controlledSelectedFile : internalFile
  const [error, setError] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const activeImageUrl = currentImageUrl || currentImage || ''

  const localPreview = useMemo(() => {
    return activeFile ? URL.createObjectURL(activeFile) : ''
  }, [activeFile])

  useEffect(() => {
    return () => {
      if (localPreview) {
        URL.revokeObjectURL(localPreview)
      }
    }
  }, [localPreview])

  const handlePickFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Harap pilih file gambar yang valid (JPG, PNG, WEBP, dll.)')
      return
    }
    setError('')
    setInternalFile(file)
    if (onFileSelected) onFileSelected(file)
    if (onSelectFile) onSelectFile(file)
  }

  const handleRemove = () => {
    setInternalFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (onFileSelected) onFileSelected(null)
    if (onSelectFile) onSelectFile(null)
    if (onUrlChanged) onUrlChanged('')
    if (onRemove) onRemove()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handlePickFile(file)
  }

  const previewSource = localPreview || activeImageUrl

  return (
    <div className="admin-input-group">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
        <label className="admin-label">{label}</label>
        <span style={{ fontSize: '0.6875rem', color: 'var(--admin-primary)', fontWeight: 700 }}>
          Cloudinary Terhubung
        </span>
      </div>

      {error && (
        <div
          style={{
            padding: '0.5rem 0.75rem',
            borderRadius: 'var(--admin-radius)',
            backgroundColor: 'var(--admin-danger-soft)',
            color: 'var(--admin-danger)',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.5rem'
          }}
        >
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handlePickFile(file)
        }}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {previewSource ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.75rem',
            borderRadius: 'var(--admin-radius)',
            border: '1px solid var(--admin-border)',
            backgroundColor: 'var(--admin-surface-hover)'
          }}
        >
          <img
            src={previewSource}
            alt="Preview"
            style={{
              width: '64px',
              height: '64px',
              objectFit: 'cover',
              borderRadius: 'var(--admin-radius)',
              border: '1px solid var(--admin-border)',
              flexShrink: 0
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: '0.8125rem',
                color: 'var(--admin-text-main)',
                fontWeight: 700,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {activeFile ? activeFile.name : 'Foto Tersimpan'}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                fontSize: '0.6875rem',
                marginTop: '0.2rem',
                color: activeFile ? 'var(--admin-primary)' : 'var(--admin-success)'
              }}
            >
              <CheckCircle size={13} />
              <span>
                {activeFile
                  ? `Foto baru dipilih (${(activeFile.size / 1024).toFixed(0)} KB) - Diunggah ke Cloudinary saat klik Simpan`
                  : 'Foto aktif dari Cloudinary / database'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="admin-icon-btn"
            style={{ color: 'var(--admin-danger)', flexShrink: 0 }}
            title="Hapus / Ganti Foto"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragOver(true)
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            padding: '1.5rem',
            borderRadius: 'var(--admin-radius)',
            border: `2px dashed ${isDragOver ? 'var(--admin-primary)' : 'var(--admin-border)'}`,
            backgroundColor: isDragOver ? 'var(--admin-primary-soft)' : 'var(--admin-bg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--admin-radius)',
              backgroundColor: 'var(--admin-primary-soft)',
              color: 'var(--admin-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.5rem'
            }}
          >
            <UploadCloud size={20} />
          </div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--admin-text-main)' }}>
            Klik untuk memilih foto atau drag & drop file
          </div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--admin-text-muted)', marginTop: '0.2rem' }}>
            Foto akan diunggah otomatis ke Cloudinary saat Anda mengklik Simpan
          </div>
        </div>
      )}
    </div>
  )
}
