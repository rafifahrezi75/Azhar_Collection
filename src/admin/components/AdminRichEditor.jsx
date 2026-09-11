import { useState, useEffect, useRef } from 'react'
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Code,
  Link as LinkIcon,
  RotateCcw,
  RotateCw,
  RemoveFormatting
} from 'lucide-react'

export default function AdminRichEditor({
  id,
  label,
  value = '',
  onChange,
  placeholder = 'Ketik isi teks di sini...',
  height = 260
}) {
  const editorRef = useRef(null)
  const isTypingRef = useRef(false)
  const [isRawView, setIsRawView] = useState(false)

  useEffect(() => {
    if (!editorRef.current) return
    if (isTypingRef.current) {
      isTypingRef.current = false
      return
    }
    if (document.activeElement === editorRef.current) {
      return
    }
    if (editorRef.current.innerHTML !== (value || '')) {
      editorRef.current.innerHTML = value || ''
    }
  }, [value])

  const handleInput = () => {
    if (!editorRef.current) return
    isTypingRef.current = true
    const html = editorRef.current.innerHTML
    if (onChange) {
      onChange(html === '<p><br></p>' || html === '<br>' ? '' : html)
    }
  }

  const formatDoc = (cmd, val = null) => {
    if (!editorRef.current) return
    editorRef.current.focus()
    document.execCommand(cmd, false, val)
    handleInput()
  }

  const handleAddLink = () => {
    const url = window.prompt('Masukkan tautan URL:')
    if (url) {
      formatDoc('createLink', url)
    }
  }

  return (
    <div className="admin-rich-editor-wrapper" id={id}>
      {label && <label className="admin-label">{label}</label>}

      <div
        style={{
          border: '1px solid var(--admin-border)',
          borderRadius: '6px',
          overflow: 'hidden',
          backgroundColor: 'var(--admin-surface)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '2px',
            padding: '6px 8px',
            backgroundColor: 'var(--admin-surface-hover)',
            borderBottom: '1px solid var(--admin-border)'
          }}
        >
          <button
            type="button"
            className="admin-action-icon-btn"
            style={{ width: '28px', height: '28px' }}
            title="Undo"
            onClick={() => formatDoc('undo')}
          >
            <RotateCcw size={14} />
          </button>
          <button
            type="button"
            className="admin-action-icon-btn"
            style={{ width: '28px', height: '28px' }}
            title="Redo"
            onClick={() => formatDoc('redo')}
          >
            <RotateCw size={14} />
          </button>

          <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--admin-border)', margin: '0 4px' }} />

          <button
            type="button"
            className="admin-action-icon-btn"
            style={{ width: '28px', height: '28px' }}
            title="Heading 1"
            onClick={() => formatDoc('formatBlock', '<h1>')}
          >
            <Heading1 size={14} />
          </button>
          <button
            type="button"
            className="admin-action-icon-btn"
            style={{ width: '28px', height: '28px' }}
            title="Heading 2"
            onClick={() => formatDoc('formatBlock', '<h2>')}
          >
            <Heading2 size={14} />
          </button>
          <button
            type="button"
            className="admin-action-icon-btn"
            style={{ width: '28px', height: '28px', fontSize: '11px', fontWeight: 700 }}
            title="Paragraph"
            onClick={() => formatDoc('formatBlock', '<p>')}
          >
            P
          </button>

          <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--admin-border)', margin: '0 4px' }} />

          <button
            type="button"
            className="admin-action-icon-btn"
            style={{ width: '28px', height: '28px' }}
            title="Bold (Tebal)"
            onClick={() => formatDoc('bold')}
          >
            <Bold size={14} />
          </button>
          <button
            type="button"
            className="admin-action-icon-btn"
            style={{ width: '28px', height: '28px' }}
            title="Italic (Miring)"
            onClick={() => formatDoc('italic')}
          >
            <Italic size={14} />
          </button>
          <button
            type="button"
            className="admin-action-icon-btn"
            style={{ width: '28px', height: '28px' }}
            title="Underline (Garis Bawah)"
            onClick={() => formatDoc('underline')}
          >
            <Underline size={14} />
          </button>

          <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--admin-border)', margin: '0 4px' }} />

          <button
            type="button"
            className="admin-action-icon-btn"
            style={{ width: '28px', height: '28px' }}
            title="Bullet List"
            onClick={() => formatDoc('insertUnorderedList')}
          >
            <List size={14} />
          </button>
          <button
            type="button"
            className="admin-action-icon-btn"
            style={{ width: '28px', height: '28px' }}
            title="Numbered List"
            onClick={() => formatDoc('insertOrderedList')}
          >
            <ListOrdered size={14} />
          </button>
          <button
            type="button"
            className="admin-action-icon-btn"
            style={{ width: '28px', height: '28px' }}
            title="Quote"
            onClick={() => formatDoc('formatBlock', '<blockquote>')}
          >
            <Quote size={14} />
          </button>
          <button
            type="button"
            className="admin-action-icon-btn"
            style={{ width: '28px', height: '28px' }}
            title="Link URL"
            onClick={handleAddLink}
          >
            <LinkIcon size={14} />
          </button>

          <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--admin-border)', margin: '0 4px' }} />

          <button
            type="button"
            className="admin-action-icon-btn"
            style={{ width: '28px', height: '28px' }}
            title="Hapus Format"
            onClick={() => formatDoc('removeFormat')}
          >
            <RemoveFormatting size={14} />
          </button>

          <button
            type="button"
            className={`admin-action-icon-btn ${isRawView ? 'admin-action-icon-btn-primary' : ''}`}
            style={{ width: '28px', height: '28px', marginLeft: 'auto' }}
            title="Toggle HTML Source Code"
            onClick={() => setIsRawView(!isRawView)}
          >
            <Code size={14} />
          </button>
        </div>

        {isRawView ? (
          <textarea
            value={value}
            onChange={(e) => {
              if (onChange) onChange(e.target.value)
            }}
            style={{
              width: '100%',
              minHeight: `${height}px`,
              padding: '12px',
              fontFamily: 'monospace',
              fontSize: '13px',
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              color: 'var(--admin-text-main)',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onBlur={handleInput}
            data-placeholder={placeholder}
            style={{
              width: '100%',
              minHeight: `${height}px`,
              padding: '12px 14px',
              outline: 'none',
              fontSize: '13px',
              lineHeight: 1.65,
              color: 'var(--admin-text-main)',
              backgroundColor: 'transparent',
              overflowY: 'auto',
              boxSizing: 'border-box'
            }}
          />
        )}
      </div>
    </div>
  )
}
