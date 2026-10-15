import { useState, useEffect, useRef } from 'react'
import { Building2, Check, ChevronDown, X, MapPin } from 'lucide-react'

export default function AdminClientAutocomplete({
  clients = [],
  value = '',
  clientName = '',
  onChange,
  required = false,
  disabled = false,
  placeholder = 'Ketik untuk cari instansi / sekolah pemesan...'
}) {
  const [query, setQuery] = useState(clientName || '')
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (clientName) {
      setQuery(clientName)
    } else if (value) {
      const match = clients.find((c) => String(c.id) === String(value))
      if (match) setQuery(match.name)
    } else {
      setQuery('')
    }
  }, [value, clientName, clients])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const filteredClients = clients.filter((c) => {
    if (!query || !query.trim()) return true
    const q = query.toLowerCase().trim()
    const matchName = (c.name || '').toLowerCase().includes(q)
    const matchCity = (c.city || '').toLowerCase().includes(q)
    return matchName || matchCity
  })

  const selectedClient = clients.find(
    (c) => String(c.id) === String(value) || (c.name && c.name.toLowerCase() === (query || '').toLowerCase().trim())
  )

  const handleSelect = (client) => {
    setQuery(client.name)
    setIsOpen(false)
    if (onChange) {
      onChange({
        clientId: client.id,
        clientName: client.name,
        client
      })
    }
  }

  const handleInputChange = (e) => {
    const val = e.target.value
    setQuery(val)
    setIsOpen(true)

    const exactMatch = clients.find((c) => c.name.toLowerCase() === val.toLowerCase().trim())
    if (onChange) {
      onChange({
        clientId: exactMatch ? exactMatch.id : '',
        clientName: val,
        client: exactMatch || null
      })
    }
  }

  const handleClear = () => {
    setQuery('')
    setIsOpen(true)
    if (inputRef.current) inputRef.current.focus()
    if (onChange) {
      onChange({
        clientId: '',
        clientName: '',
        client: null
      })
    }
  }

  return (
    <div ref={containerRef} className="admin-autocomplete-root" style={{ position: 'relative' }}>
      <div
        className="admin-autocomplete-input-wrapper"
        style={{
          display: 'flex',
          alignItems: 'center',
          position: 'relative'
        }}
      >
        <Building2
          size={16}
          style={{
            position: 'absolute',
            left: '0.875rem',
            color: 'var(--admin-text-subtle)',
            pointerEvents: 'none'
          }}
        />

        <input
          ref={inputRef}
          type="text"
          id="product-client-autocomplete"
          className="admin-input"
          style={{
            paddingLeft: '2.5rem',
            paddingRight: '4.5rem',
            width: '100%',
            fontWeight: selectedClient ? 700 : 400
          }}
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          required={required && !value && !query}
          disabled={disabled}
          autoComplete="off"
        />

        <div
          style={{
            position: 'absolute',
            right: '0.625rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}
        >
          {query && (
            <button
              type="button"
              onClick={handleClear}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.25rem',
                cursor: 'pointer',
                color: 'var(--admin-text-subtle)',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Hapus / Reset"
              aria-label="Hapus / Reset"
            >
              <X size={14} />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.25rem',
              cursor: 'pointer',
              color: 'var(--admin-text-subtle)',
              display: 'flex',
              alignItems: 'center'
            }}
            tabIndex={-1}
            aria-label="Buka Opsi"
          >
            <ChevronDown size={16} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="admin-autocomplete-dropdown"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: 'var(--admin-surface, #FFFFFF)',
            border: '1px solid var(--admin-border, #E2E8F0)',
            borderRadius: 'var(--admin-radius, 8px)',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            maxHeight: '260px',
            overflowY: 'auto',
            zIndex: 100
          }}
        >
          <div
            style={{
              padding: '0.5rem 0.875rem',
              fontSize: '0.6875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--admin-text-subtle)',
              borderBottom: '1px solid var(--admin-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>Pilih Klien / Instansi Terdaftar</span>
            <span>{filteredClients.length} Klien</span>
          </div>

          {filteredClients.length === 0 ? (
            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--admin-text-muted)', fontSize: '0.8125rem' }}>
              Tidak ada mitra klien yang cocok dengan "{query}".
            </div>
          ) : (
            filteredClients.map((c) => {
              const isSelected = String(c.id) === String(value) || (selectedClient && String(selectedClient.id) === String(c.id))

              return (
                <div
                  key={c.id}
                  onClick={() => handleSelect(c)}
                  style={{
                    padding: '0.625rem 0.875rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    borderBottom: '1px solid var(--admin-border-subtle, rgba(0,0,0,0.03))',
                    backgroundColor: isSelected ? 'var(--admin-surface-hover)' : 'transparent',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--admin-surface-hover)'
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        background: 'var(--admin-surface-hover)',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--admin-border)'
                      }}
                    >
                      {c.logo || c.image ? (
                        <img src={c.logo || c.image} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Building2 size={16} style={{ color: 'var(--admin-text-subtle)' }} />
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                      <span style={{ fontSize: '0.84375rem', fontWeight: 700, color: 'var(--admin-text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {c.name}
                      </span>
                      {c.city && (
                        <span style={{ fontSize: '0.71875rem', color: 'var(--admin-text-subtle)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <MapPin size={11} />
                          {c.city}
                        </span>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <div style={{ color: 'var(--admin-primary)', flexShrink: 0 }}>
                      <Check size={16} />
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
