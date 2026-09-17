import { useState, useEffect, useRef, useCallback } from 'react'
import { X, RotateCw, Check, ArrowRight, ShieldCheck } from 'lucide-react'

const CAPTCHA_IMAGES = [
  'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80'
]

const PW = 44
const PH = 44
const KR = 8
const TOL = 8

function drawPuzzlePath(ctx, x, y, w = PW, h = PH, r = KR) {
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + w, y)
  ctx.lineTo(x + w, y + h / 2 - r)
  ctx.arc(x + w, y + h / 2, r, Math.PI * 1.5, Math.PI * 0.5, false)
  ctx.lineTo(x + w, y + h)
  ctx.lineTo(x + w / 2 + r, y + h)
  ctx.arc(x + w / 2, y + h, r, 0, Math.PI, false)
  ctx.lineTo(x, y + h)
  ctx.lineTo(x, y)
  ctx.closePath()
}

export default function SliderCaptchaModal({ isOpen, onClose, onSuccess }) {
  const [imgIndex, setImgIndex] = useState(0)
  const [sliderPos, setSliderPos] = useState(0)
  const [status, setStatus] = useState('idle')
  const [isLoading, setIsLoading] = useState(true)
  const [targetX, setTargetX] = useState(0)
  const [isShaking, setIsShaking] = useState(false)

  const bgCanvasRef = useRef(null)
  const pieceCanvasRef = useRef(null)
  const trackRef = useRef(null)
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const startPosRef = useRef(0)
  const currentPosRef = useRef(0)
  const targetXRef = useRef(0)
  const verifiedRef = useRef(false)

  const drawFallback = useCallback((bgCtx, pieceCtx, tx, ty) => {
    const W = 300
    const H = 150
    const g = bgCtx.createLinearGradient(0, 0, W, H)
    g.addColorStop(0, '#2D0831')
    g.addColorStop(0.5, '#4A0E4E')
    g.addColorStop(1, '#800080')
    bgCtx.fillStyle = g
    bgCtx.fillRect(0, 0, W, H)

    for (let i = 0; i < 6; i++) {
      bgCtx.beginPath()
      bgCtx.arc(35 + i * 45, 30 + (i % 3) * 35, 22, 0, Math.PI * 2)
      bgCtx.fillStyle = 'rgba(255, 255, 255, 0.08)'
      bgCtx.fill()
    }

    bgCtx.save()
    drawPuzzlePath(bgCtx, tx, ty)
    bgCtx.fillStyle = 'rgba(0, 0, 0, 0.45)'
    bgCtx.fill()
    bgCtx.strokeStyle = 'rgba(255, 255, 255, 0.75)'
    bgCtx.lineWidth = 1.5
    bgCtx.stroke()
    bgCtx.restore()

    pieceCtx.clearRect(0, 0, PW + KR + 6, H)
    pieceCtx.save()
    drawPuzzlePath(pieceCtx, 2, ty)
    pieceCtx.fillStyle = '#FAF5FF'
    pieceCtx.fill()
    pieceCtx.strokeStyle = 'rgba(255, 255, 255, 0.9)'
    pieceCtx.lineWidth = 1.5
    pieceCtx.stroke()
    pieceCtx.restore()
  }, [])

  const loadCaptcha = useCallback(() => {
    setIsLoading(true)
    setStatus('idle')
    setSliderPos(0)
    currentPosRef.current = 0
    verifiedRef.current = false

    const bgCanvas = bgCanvasRef.current
    const pieceCanvas = pieceCanvasRef.current
    if (!bgCanvas || !pieceCanvas) return

    const bgCtx = bgCanvas.getContext('2d')
    const pieceCtx = pieceCanvas.getContext('2d')

    const W = bgCanvas.width
    const H = bgCanvas.height
    const minTx = PW + KR + 25
    const maxTx = W - PW - KR - 25
    const randomTx = minTx + Math.floor(Math.random() * (maxTx - minTx))
    const randomTy = 18 + Math.floor(Math.random() * (H - PH - 36))

    setTargetX(randomTx)
    targetXRef.current = randomTx

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = CAPTCHA_IMAGES[imgIndex % CAPTCHA_IMAGES.length]

    const handleSuccessDraw = () => {
      bgCtx.clearRect(0, 0, W, H)
      bgCtx.drawImage(img, 0, 0, W, H)

      bgCtx.save()
      drawPuzzlePath(bgCtx, randomTx, randomTy)
      bgCtx.fillStyle = 'rgba(0, 0, 0, 0.45)'
      bgCtx.fill()
      bgCtx.strokeStyle = 'rgba(255, 255, 255, 0.75)'
      bgCtx.lineWidth = 1.5
      bgCtx.stroke()
      bgCtx.restore()

      pieceCtx.clearRect(0, 0, PW + KR + 6, H)
      pieceCtx.save()
      drawPuzzlePath(pieceCtx, 2, randomTy)
      pieceCtx.clip()
      pieceCtx.drawImage(img, 2 - randomTx, 0, W, H)
      pieceCtx.restore()

      pieceCtx.save()
      drawPuzzlePath(pieceCtx, 2, randomTy)
      pieceCtx.strokeStyle = 'rgba(255, 255, 255, 0.95)'
      pieceCtx.lineWidth = 1.5
      pieceCtx.stroke()
      pieceCtx.restore()

      setIsLoading(false)
    }

    img.onload = handleSuccessDraw
    img.onerror = () => {
      drawFallback(bgCtx, pieceCtx, randomTx, randomTy)
      setIsLoading(false)
    }
  }, [imgIndex, drawFallback])

  useEffect(() => {
    if (isOpen) {
      loadCaptcha()
    }
  }, [isOpen, loadCaptcha])

  const handleStart = (clientX) => {
    if (verifiedRef.current || isLoading) return
    isDraggingRef.current = true
    startXRef.current = clientX
    startPosRef.current = currentPosRef.current
  }

  const handleMove = (clientX) => {
    if (!isDraggingRef.current) return
    const track = trackRef.current
    if (!track) return

    const maxPx = Math.max(0, track.offsetWidth - 44)
    const diff = clientX - startXRef.current
    const nextPos = Math.max(0, Math.min(maxPx, startPosRef.current + diff))

    setSliderPos(nextPos)
    currentPosRef.current = nextPos

    const bgCanvas = bgCanvasRef.current
    const pieceCanvas = pieceCanvasRef.current
    if (bgCanvas && pieceCanvas) {
      const scale = bgCanvas.width / bgCanvas.getBoundingClientRect().width
      pieceCanvas.style.left = `${nextPos * scale}px`
    }
  }

  const handleEnd = () => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false

    const bgCanvas = bgCanvasRef.current
    if (!bgCanvas) return

    const scale = bgCanvas.width / bgCanvas.getBoundingClientRect().width
    const currentInternalX = currentPosRef.current * scale
    const targetInternalX = targetXRef.current - 2
    const diff = Math.abs(currentInternalX - targetInternalX)

    if (diff <= TOL) {
      verifiedRef.current = true
      setStatus('success')
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 600)
    } else {
      setStatus('fail')
      setIsShaking(true)
      setTimeout(() => {
        setIsShaking(false)
      }, 400)

      setTimeout(() => {
        setSliderPos(0)
        currentPosRef.current = 0
        const pieceCanvas = pieceCanvasRef.current
        if (pieceCanvas) {
          pieceCanvas.style.transition = 'left 0.3s ease'
          pieceCanvas.style.left = '0px'
          setTimeout(() => {
            pieceCanvas.style.transition = ''
            setStatus('idle')
          }, 300)
        } else {
          setStatus('idle')
        }
      }, 500)
    }
  }

  useEffect(() => {
    const onMouseMove = (e) => handleMove(e.clientX)
    const onTouchMove = (e) => {
      if (isDraggingRef.current && e.touches[0]) {
        handleMove(e.touches[0].clientX)
      }
    }

    const onMouseUp = () => handleEnd()
    const onTouchEnd = () => handleEnd()

    if (isOpen) {
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp)
      window.addEventListener('touchmove', onTouchMove, { passive: false })
      window.addEventListener('touchend', onTouchEnd)
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [isOpen])

  if (!isOpen) return null

  const getButtonBg = () => {
    if (status === 'success') return '#10B981'
    if (status === 'fail') return '#EF4444'
    return 'var(--color-primary, #800080)'
  }

  const getTrackFillBg = () => {
    if (status === 'success') return 'linear-gradient(90deg, #10B981, #34D399)'
    if (status === 'fail') return 'linear-gradient(90deg, #EF4444, #F87171)'
    return 'linear-gradient(90deg, var(--color-primary, #800080), #9D4EDD)'
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !verifiedRef.current) onClose()
      }}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          width: '360px',
          maxWidth: '100%',
          padding: '1.5rem',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid #E2E8F0'
        }}
      >
        <button
          type="button"
          onClick={onClose}
          disabled={verifiedRef.current}
          aria-label="Tutup"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s'
          }}
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--color-primary-soft, rgba(128, 0, 128, 0.08))',
              color: 'var(--color-primary, #800080)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.5rem auto'
            }}
          >
            <ShieldCheck size={22} />
          </div>
          <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--color-primary-dark, #2D0831)', margin: 0 }}>
            Verifikasi Keamanan
          </h3>
          <p style={{ fontSize: '0.78125rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
            Geser puzzle ke posisi yang pas untuk mengirimkan formulir
          </p>
        </div>

        <div
          style={{
            position: 'relative',
            width: '100%',
            borderRadius: '10px',
            overflow: 'hidden',
            background: '#E2E8F0',
            marginBottom: '0.875rem',
            boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
        >
          <canvas
            ref={bgCanvasRef}
            width={300}
            height={150}
            style={{
              display: 'block',
              width: '100%',
              height: 'auto',
              borderRadius: '10px'
            }}
          />

          <canvas
            ref={pieceCanvasRef}
            width={PW + KR + 6}
            height={150}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              pointerEvents: 'none',
              height: '100%',
              width: 'auto'
            }}
          />

          {isLoading && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.85)',
                fontSize: '0.8125rem',
                color: '#64748B',
                fontWeight: 600,
                borderRadius: '10px'
              }}
            >
              Memuat gambar...
            </div>
          )}
        </div>

        <div
          ref={trackRef}
          style={{
            position: 'relative',
            width: '100%',
            height: '44px',
            border: '1px solid #E2E8F0',
            borderRadius: '22px',
            background: '#F8FAFC',
            overflow: 'hidden',
            boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.06)',
            userSelect: 'none',
            animation: isShaking ? 'scShake 0.4s ease' : 'none'
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: `${sliderPos + 44}px`,
              background: getTrackFillBg(),
              borderRadius: '22px',
              transition: status === 'idle' && sliderPos === 0 ? 'width 0.3s ease' : 'none'
            }}
          />

          <span
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.78125rem',
              fontWeight: 600,
              color: status === 'success' ? '#065F46' : status === 'fail' ? '#991B1B' : '#64748B',
              pointerEvents: 'none',
              zIndex: 2,
              letterSpacing: '0.02em',
              transition: 'color 0.2s'
            }}
          >
            {status === 'success'
              ? 'Verifikasi Berhasil!'
              : status === 'fail'
              ? 'Kurang tepat, coba geser lagi'
              : 'Geser ke kanan untuk verifikasi'}
          </span>

          <div
            onMouseDown={(e) => handleStart(e.clientX)}
            onTouchStart={(e) => {
              if (e.touches[0]) handleStart(e.touches[0].clientX)
            }}
            style={{
              position: 'absolute',
              left: `${sliderPos}px`,
              top: '50%',
              transform: 'translateY(-50%)',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: '#FFFFFF',
              border: `2px solid ${getButtonBg()}`,
              color: getButtonBg(),
              cursor: verifiedRef.current ? 'default' : 'grab',
              zIndex: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              transition: status === 'idle' && sliderPos === 0 ? 'left 0.3s ease' : 'none'
            }}
          >
            {status === 'success' ? (
              <Check size={18} strokeWidth={3} />
            ) : status === 'fail' ? (
              <X size={18} strokeWidth={3} />
            ) : (
              <ArrowRight size={18} strokeWidth={2.5} />
            )}
          </div>
        </div>

        <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => {
              setImgIndex((prev) => prev + 1)
            }}
            disabled={verifiedRef.current || isLoading}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748B',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '6px',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = 'var(--color-primary, #800080)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#64748B'
            }}
          >
            <RotateCw size={13} />
            Ganti Gambar
          </button>
        </div>
      </div>
    </div>
  )
}
