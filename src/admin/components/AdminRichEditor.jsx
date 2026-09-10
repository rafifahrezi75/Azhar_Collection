import { useEffect, useRef, useId } from 'react'

export default function AdminRichEditor({
  id,
  label,
  value = '',
  onChange,
  placeholder = '',
  height = 280
}) {
  const generatedId = useId().replace(/:/g, '')
  const editorId = id || `editor-${generatedId}`
  const editorRef = useRef(null)
  const isInternalChangeRef = useRef(false)
  const onChangeRef = useRef(onChange)
  const initialValueRef = useRef(value)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    let checkTimer = null
    let isCancelled = false

    const initEditor = () => {
      if (isCancelled || !window.tinymce) return

      const isDarkMode =
        document.documentElement.classList.contains('admin-dark') ||
        document.body.classList.contains('admin-dark')

      window.tinymce.init({
        selector: `#${editorId}`,
        height: height,
        menubar: false,
        statusbar: true,
        plugins: 'lists link autolink charmap preview searchreplace wordcount',
        toolbar:
          'undo redo | formatselect | bold italic underline | bullist numlist | blockquote link | removeformat',
        content_style:
          'body { font-family: Poppins, sans-serif; font-size: 14px; line-height: 1.6; padding: 12px; }',
        skin: isDarkMode ? 'oxide-dark' : 'oxide',
        content_css: isDarkMode ? 'dark' : 'default',
        placeholder: placeholder,
        setup: (editor) => {
          editorRef.current = editor

          editor.on('init', () => {
            if (initialValueRef.current) {
              editor.setContent(initialValueRef.current)
            }
          })

          const handleUpdate = () => {
            if (isCancelled) return
            const content = editor.getContent()
            isInternalChangeRef.current = true
            if (onChangeRef.current) {
              onChangeRef.current(content)
            }
          }

          editor.on('change input keyup Undo Redo', handleUpdate)
        }
      })
    }

    if (window.tinymce) {
      initEditor()
    } else {
      let attempts = 0
      checkTimer = setInterval(() => {
        attempts += 1
        if (window.tinymce) {
          clearInterval(checkTimer)
          initEditor()
        } else if (attempts > 30) {
          clearInterval(checkTimer)
        }
      }, 200)
    }

    return () => {
      isCancelled = true
      if (checkTimer) clearInterval(checkTimer)
      if (window.tinymce && editorRef.current) {
        try {
          window.tinymce.remove(`#${editorId}`)
        } catch {
          try {
            editorRef.current.destroy()
          } catch {
            return
          }
        }
        editorRef.current = null
      }
    }
  }, [editorId, height, placeholder])

  useEffect(() => {
    if (editorRef.current && !isInternalChangeRef.current) {
      const currentContent = editorRef.current.getContent()
      if (value !== currentContent) {
        editorRef.current.setContent(value || '')
      }
    }
    isInternalChangeRef.current = false
  }, [value])

  return (
    <div className="admin-rich-editor-wrapper">
      {label && <label className="admin-label" htmlFor={editorId}>{label}</label>}
      <div className="admin-rich-editor-container">
        <textarea
          id={editorId}
          defaultValue={value}
          onChange={(e) => {
            if (onChange) onChange(e.target.value)
          }}
          style={{ width: '100%', minHeight: `${height}px`, display: 'block' }}
          className="admin-input"
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}
