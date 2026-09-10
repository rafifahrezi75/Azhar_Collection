import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function AdminModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = '640px'
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div
        className="admin-modal-card"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-modal-header">
          <div>
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800 }}>
              {title}
            </h3>
            {subtitle && (
              <p
                style={{
                  margin: '0.2rem 0 0 0',
                  fontSize: '0.78125rem',
                  color: 'var(--admin-text-muted)'
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="admin-icon-btn"
            aria-label="Tutup Dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="admin-modal-body">{children}</div>

        {footer && <div className="admin-modal-footer">{footer}</div>}
      </div>
    </div>
  )
}
